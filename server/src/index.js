import express from "express";
import { randomUUID } from "node:crypto";
import { db, transaction, centsToDollars } from "./db.js";

const app = express();
app.use(express.json({ limit: "32kb" }));
const PORT = Number(process.env.PORT || 3001);
const prices = Object.fromEntries(
  db
    .prepare("SELECT id,price_cents FROM products WHERE active=1")
    .all()
    .map((p) => [p.id, p.price_cents]),
);
const apiError = (res, status, message) =>
  res.status(status).json({ error: message });

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, storage: "sqlite" }),
);
app.get("/api/products", (_req, res) =>
  res.json(
    db
      .prepare(
        "SELECT id,name,description,quantity,price_cents FROM products WHERE active=1",
      )
      .all()
      .map((p) => ({ ...p, price: centsToDollars(p.price_cents) })),
  ),
);
app.get("/api/demo", (_req, res) =>
  res.json({
    users: db
      .prepare(
        "SELECT id,name,role,referral_code FROM users WHERE id IN ('ana','diego')",
      )
      .all(),
    notice: "Datos de demostración; no son clientes reales.",
  }),
);
app.get("/api/referrals/:code", (req, res) => {
  const invite = db
    .prepare(
      "SELECT r.code,r.status,u.name inviter_name FROM referrals r JOIN users u ON u.id=r.inviter_id WHERE r.code=? LIMIT 1",
    )
    .get(req.params.code);
  const inviter = db
    .prepare("SELECT name,referral_code FROM users WHERE referral_code=?")
    .get(req.params.code);
  if (!invite && !inviter)
    return apiError(res, 404, "Este enlace no existe o ya no está disponible.");
  res.json({
    code: req.params.code,
    inviter: invite?.inviter_name || inviter.name,
    discount_cents: 800,
    discount: 8,
  });
});
app.get("/api/account/:userId", (req, res) => {
  const user = db
    .prepare("SELECT id,name,email,role,referral_code FROM users WHERE id=?")
    .get(req.params.userId);
  if (!user) return apiError(res, 404, "No encontramos esa cuenta demo.");
  const referrals = db
    .prepare(
      `SELECT r.id,r.status,r.created_at,u.name invitee_name,o.id order_id
    FROM referrals r LEFT JOIN users u ON u.id=r.invitee_id
    LEFT JOIN orders o ON o.referral_id=r.id AND o.status='confirmed'
    WHERE r.inviter_id=? ORDER BY r.id DESC`,
    )
    .all(user.id);
  const earned = db
    .prepare(
      "SELECT COALESCE(SUM(amount_cents),0) total FROM credits WHERE user_id=? AND status='available'",
    )
    .get(user.id).total;
  const redemption = db
    .prepare(
      "SELECT COALESCE(SUM(amount_cents),0) total FROM credit_redemptions WHERE user_id=? AND status IN ('pending','redeemed')",
    )
    .get(user.id).total;
  const available = Math.max(0, earned - redemption);
  const redeemed = db
    .prepare(
      "SELECT COALESCE(SUM(amount_cents),0) total FROM credit_redemptions WHERE user_id=? AND status='redeemed'",
    )
    .get(user.id).total;
  const orders = db
    .prepare(
      "SELECT id,status,subtotal_cents,discount_cents,total_cents,created_at FROM orders WHERE user_id=? ORDER BY created_at DESC",
    )
    .all(user.id);
  const reward = db
    .prepare(
      "SELECT id,status,estimated_cost_cents FROM rewards WHERE user_id=? AND kind='accessory'",
    )
    .get(user.id);
  res.json({
    user,
    referrals,
    orders,
    credit_available_cents: available,
    credit_redeemed_cents: redeemed,
    confirmed_referrals: referrals.filter(
      (r) => r.status === "confirmed" && r.order_id,
    ).length,
    reward: reward || null,
  });
});
app.get("/api/admin/metrics", (_req, res) => {
  const count = (sql) => db.prepare(sql).get().n;
  const orders = db
    .prepare(
      "SELECT status,COUNT(*) n,COALESCE(SUM(total_cents),0) revenue FROM orders GROUP BY status",
    )
    .all();
  const confirmedReferrals = count(
    "SELECT COUNT(*) n FROM referrals WHERE status='confirmed'",
  );
  const totalCredits = db
    .prepare(
      "SELECT COALESCE(SUM(amount_cents),0) n FROM credits WHERE status='available'",
    )
    .get().n;
  const rewards = db
    .prepare(
      "SELECT COUNT(*) n,COALESCE(SUM(estimated_cost_cents),0) cost FROM rewards WHERE status='available'",
    )
    .get();
  const funnel = db
    .prepare(
      "SELECT step_key,label,value,denominator,source FROM case_funnel ORDER BY sort_order",
    )
    .all();
  const economics = db
    .prepare(
      "SELECT metric_key,label,value_cents,display_value,detail,source FROM case_economics ORDER BY sort_order",
    )
    .all();
  res.json({
    funnel,
    economics,
    orders,
    confirmed_referrals: confirmedReferrals,
    credit_liability_cents: totalCredits,
    rewards_available: rewards.n,
    reward_estimated_cost_cents: rewards.cost,
    note: "Embudo y economía base del caso. Pedidos, créditos y recompensas vigentes se consultan de la base local de demostración.",
  });
});
app.get("/api/activity/:userId", (req, res) => {
  const rows = db
    .prepare(
      `SELECT r.id,r.status,r.created_at,u.name invitee_name,o.id order_id,o.status order_status,o.total_cents
    FROM referrals r LEFT JOIN users u ON u.id=r.invitee_id LEFT JOIN orders o ON o.referral_id=r.id
    WHERE r.inviter_id=? ORDER BY r.created_at DESC`,
    )
    .all(req.params.userId);
  res.json(rows);
});

app.post("/api/orders", (req, res) => {
  const {
    productId,
    quantity = 1,
    inviteCode,
    customerName,
    customerEmail,
    idempotencyKey,
    useCreditCents = 0,
  } = req.body || {};
  if (!productId || !prices[productId])
    return apiError(res, 400, "Elegí un producto disponible.");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5)
    return apiError(res, 400, "La cantidad debe estar entre 1 y 5.");
  if (
    !Number.isInteger(useCreditCents) ||
    useCreditCents < 0 ||
    useCreditCents > 800
  )
    return apiError(res, 400, "Podés usar hasta $8 de crédito por pedido.");
  if (useCreditCents > 0 && productId !== "duo")
    return apiError(
      res,
      409,
      "El crédito de demostración aplica a la compra de dos bolsas.",
    );
  if (!customerName?.trim() || !/^\S+@\S+\.\S+$/.test(customerEmail || ""))
    return apiError(
      res,
      400,
      "Completá un nombre y un correo válidos para la demostración.",
    );
  if (!idempotencyKey || typeof idempotencyKey !== "string")
    return apiError(
      res,
      400,
      "No pudimos identificar esta solicitud. Volvé a intentarlo.",
    );
  const existing = db
    .prepare("SELECT * FROM orders WHERE idempotency_key=?")
    .get(idempotencyKey);
  if (existing)
    return res.status(200).json({ order: existing, replayed: true });
  const inviter = inviteCode
    ? db.prepare("SELECT * FROM users WHERE referral_code=?").get(inviteCode)
    : null;
  if (inviteCode && !inviter)
    return apiError(res, 404, "El enlace de invitación no es válido.");
  if (inviter && productId !== "duo")
    return apiError(
      res,
      409,
      "El beneficio de invitación aplica a la compra de dos bolsas.",
    );
  if (inviter && useCreditCents > 0)
    return apiError(
      res,
      409,
      "En esta demostración, el descuento de invitación y el crédito no se combinan.",
    );
  if (inviter && inviter.email.toLowerCase() === customerEmail.toLowerCase())
    return apiError(res, 409, "No podés usar tu propio enlace de invitación.");
  try {
    const result = transaction(() => {
      let user = db
        .prepare("SELECT * FROM users WHERE email=?")
        .get(customerEmail.toLowerCase());
      if (useCreditCents > 0 && !user)
        throw Object.assign(
          new Error("El crédito está ligado a una cuenta demo existente."),
          { status: 409 },
        );
      if (user && inviter && user.id === inviter.id)
        throw Object.assign(
          new Error("No podés usar tu propio enlace de invitación."),
          { status: 409 },
        );
      if (
        user &&
        inviter &&
        db.prepare("SELECT id FROM orders WHERE user_id=? LIMIT 1").get(user.id)
      )
        throw Object.assign(
          new Error(
            "El beneficio de invitación aplica a una primera compra elegible.",
          ),
          { status: 409 },
        );
      if (useCreditCents > 0) {
        const earned = db
          .prepare(
            "SELECT COALESCE(SUM(amount_cents),0) n FROM credits WHERE user_id=? AND status='available'",
          )
          .get(user.id).n;
        const reserved = db
          .prepare(
            "SELECT COALESCE(SUM(amount_cents),0) n FROM credit_redemptions WHERE user_id=? AND status IN ('pending','redeemed')",
          )
          .get(user.id).n;
        if (earned - reserved < useCreditCents)
          throw Object.assign(
            new Error(
              "El crédito disponible cambió. Revisá tu cuenta y volvé a intentar.",
            ),
            { status: 409 },
          );
      }
      if (!user) {
        const id = randomUUID();
        db.prepare("INSERT INTO users(id,name,email) VALUES(?,?,?)").run(
          id,
          customerName.trim(),
          customerEmail.toLowerCase(),
        );
        user = {
          id,
          name: customerName.trim(),
          email: customerEmail.toLowerCase(),
        };
      }
      if (
        inviter &&
        db.prepare("SELECT id FROM referrals WHERE invitee_id=?").get(user.id)
      )
        throw Object.assign(
          new Error("Este cliente ya tiene una invitación registrada."),
          { status: 409 },
        );
      const referral = inviter
        ? db
            .prepare(
              "INSERT INTO referrals(inviter_id,invitee_id,code,status) VALUES(?,?,?,'pending')",
            )
            .run(inviter.id, user.id, inviteCode)
        : null;
      const referralId = referral ? Number(referral.lastInsertRowid) : null;
      const subtotal = prices[productId] * quantity;
      const discount = inviter ? Math.min(800, subtotal) : useCreditCents;
      const id = randomUUID();
      db.prepare(
        "INSERT INTO orders(id,user_id,referral_id,status,subtotal_cents,discount_cents,shipping_cents,total_cents,idempotency_key) VALUES(?,?,?,'pending',?,?,0,?,?)",
      ).run(
        id,
        user.id,
        referralId,
        subtotal,
        discount,
        subtotal - discount,
        idempotencyKey,
      );
      db.prepare(
        "INSERT INTO order_items(order_id,product_id,quantity,unit_price_cents) VALUES(?,?,?,?)",
      ).run(id, productId, quantity, prices[productId]);
      if (useCreditCents > 0)
        db.prepare(
          "INSERT INTO credit_redemptions(user_id,order_id,amount_cents,status) VALUES(?,?,?,'pending')",
        ).run(user.id, id, useCreditCents);
      return {
        id,
        userId: user.id,
        referralId,
        subtotal,
        discount,
        total: subtotal - discount,
      };
    });
    res.status(201).json({
      order: {
        id: result.id,
        status: "pending",
        user_id: result.userId,
        subtotal_cents: result.subtotal,
        discount_cents: result.discount,
        total_cents: result.total,
        subtotal: centsToDollars(result.subtotal),
        discount: centsToDollars(result.discount),
        total: centsToDollars(result.total),
      },
      message: "Pedido de demostración pendiente de confirmar.",
    });
  } catch (error) {
    return apiError(
      res,
      error.status || 409,
      error.status
        ? error.message
        : "No fue posible registrar el pedido. Revisá si ya se procesó.",
    );
  }
});

app.patch("/api/orders/:id/status", (req, res) => {
  const { status } = req.body || {};
  if (!["confirmed", "cancelled", "returned"].includes(status))
    return apiError(res, 400, "Estado de pedido no válido.");
  try {
    const out = transaction(() => {
      const order = db
        .prepare("SELECT * FROM orders WHERE id=?")
        .get(req.params.id);
      if (!order)
        throw Object.assign(new Error("No encontramos el pedido."), {
          status: 404,
        });
      if (order.status === status) return { order, replayed: true };
      if (order.status === "confirmed" && status === "returned") {
        if (order.referral_id) {
          const ref = db
            .prepare("SELECT * FROM referrals WHERE id=?")
            .get(order.referral_id);
          const earning = db
            .prepare(
              "SELECT COALESCE(SUM(amount_cents),0) n FROM credits WHERE order_id=? AND status='available'",
            )
            .get(order.id).n;
          const allEarned = db
            .prepare(
              "SELECT COALESCE(SUM(amount_cents),0) n FROM credits WHERE user_id=? AND status='available'",
            )
            .get(ref.inviter_id).n;
          const spent = db
            .prepare(
              "SELECT COALESCE(SUM(amount_cents),0) n FROM credit_redemptions WHERE user_id=? AND status IN ('pending','redeemed')",
            )
            .get(ref.inviter_id).n;
          if (allEarned - earning - spent < 0)
            throw Object.assign(
              new Error(
                "El crédito de esta compra ya se usó. La política comercial ante este caso sigue pendiente; no se cambió el pedido.",
              ),
              { status: 409 },
            );
        }
        db.prepare("UPDATE orders SET status='returned' WHERE id=?").run(
          order.id,
        );
        db.prepare(
          "UPDATE credit_redemptions SET status='reversed' WHERE order_id=? AND status='redeemed'",
        ).run(order.id);
        if (order.referral_id) {
          const ref = db
            .prepare("SELECT * FROM referrals WHERE id=?")
            .get(order.referral_id);
          db.prepare("UPDATE referrals SET status='returned' WHERE id=?").run(
            ref.id,
          );
          db.prepare(
            "UPDATE credits SET status='reversed' WHERE order_id=? AND status='available'",
          ).run(order.id);
          const confirmed = db
            .prepare(
              "SELECT COUNT(*) n FROM referrals WHERE inviter_id=? AND status='confirmed'",
            )
            .get(ref.inviter_id).n;
          if (confirmed < 3)
            db.prepare(
              "UPDATE rewards SET status='reversed' WHERE user_id=? AND kind='accessory' AND status='available'",
            ).run(ref.inviter_id);
        }
        return { order: { ...order, status: "returned" }, replayed: false };
      }
      if (order.status !== "pending")
        throw Object.assign(
          new Error(
            "Este pedido ya se resolvió y no se puede cambiar desde esta demo.",
          ),
          { status: 409 },
        );
      db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, order.id);
      if (status === "confirmed")
        db.prepare(
          "UPDATE credit_redemptions SET status='redeemed' WHERE order_id=? AND status='pending'",
        ).run(order.id);
      if (status === "cancelled")
        db.prepare(
          "UPDATE credit_redemptions SET status='reversed' WHERE order_id=? AND status='pending'",
        ).run(order.id);
      if (order.referral_id) {
        const ref = db
          .prepare("SELECT * FROM referrals WHERE id=?")
          .get(order.referral_id);
        if (status === "confirmed") {
          db.prepare("UPDATE referrals SET status='confirmed' WHERE id=?").run(
            ref.id,
          );
          db.prepare(
            "INSERT OR IGNORE INTO credits(user_id,order_id,amount_cents,status) VALUES(?,?,800,'available')",
          ).run(ref.inviter_id, order.id);
          const confirmed = db
            .prepare(
              "SELECT COUNT(*) n FROM referrals WHERE inviter_id=? AND status='confirmed'",
            )
            .get(ref.inviter_id).n;
          if (confirmed >= 3) {
            const reward = db
              .prepare(
                "SELECT id,status FROM rewards WHERE user_id=? AND kind='accessory' AND threshold=3",
              )
              .get(ref.inviter_id);
            if (reward?.status === "reversed")
              db.prepare(
                "UPDATE rewards SET status='available' WHERE id=?",
              ).run(reward.id);
            else if (!reward)
              db.prepare(
                "INSERT INTO rewards(id,user_id,kind,status,threshold,estimated_cost_cents) VALUES(?,?,'accessory','available',3,2400)",
              ).run(randomUUID(), ref.inviter_id);
          }
        } else
          db.prepare("UPDATE referrals SET status=? WHERE id=?").run(
            status,
            ref.id,
          );
      }
      return { order: { ...order, status }, replayed: false };
    });
    res.json({ order: out.order, replayed: out.replayed });
  } catch (error) {
    return apiError(res, error.status || 500, error.message);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(500)
    .json({ error: "Ocurrió un error interno. Intentá de nuevo." });
});
app.listen(PORT, process.env.HOST || "0.0.0.0", () =>
  console.log(`Tueste API lista en http://localhost:${PORT}`),
);
