import { db } from "../db/connection.js";

export const shopRepository = {
  listProducts() {
    return db
      .prepare(
        "SELECT id,name,description,quantity,price_cents FROM products WHERE active=1",
      )
      .all();
  },
  getProduct(id) {
    return db.prepare("SELECT * FROM products WHERE id=? AND active=1").get(id);
  },
  getDemoUsers() {
    return db
      .prepare(
        "SELECT id,name,role,referral_code FROM users WHERE id IN ('ana','diego')",
      )
      .all();
  },
  getInvitation(code) {
    return (
      db
        .prepare(
          "SELECT u.name inviter_name FROM referrals r JOIN users u ON u.id=r.inviter_id WHERE r.code=? LIMIT 1",
        )
        .get(code) ||
      db
        .prepare("SELECT name inviter_name FROM users WHERE referral_code=?")
        .get(code)
    );
  },
  getAccount(userId) {
    const user = db
      .prepare("SELECT id,name,email,role,referral_code FROM users WHERE id=?")
      .get(userId);
    if (!user) return null;
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
    return {
      user,
      referrals,
      orders,
      credit_available_cents: Math.max(0, earned - redemption),
      credit_redeemed_cents: redeemed,
      confirmed_referrals: referrals.filter(
        (referral) => referral.status === "confirmed" && referral.order_id,
      ).length,
      reward: reward || null,
    };
  },
  getMetrics() {
    const orders = db
      .prepare(
        "SELECT status,COUNT(*) n,COALESCE(SUM(total_cents),0) revenue FROM orders GROUP BY status",
      )
      .all();
    const confirmedReferrals = db
      .prepare("SELECT COUNT(*) n FROM referrals WHERE status='confirmed'")
      .get().n;
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
    return {
      orders,
      confirmedReferrals,
      totalCredits,
      rewards,
      funnel: db
        .prepare(
          "SELECT step_key,label,value,denominator,source FROM case_funnel ORDER BY sort_order",
        )
        .all(),
      economics: db
        .prepare(
          "SELECT metric_key,label,value_cents,display_value,detail,source FROM case_economics ORDER BY sort_order",
        )
        .all(),
    };
  },
  getActivity(userId) {
    return db
      .prepare(
        `SELECT r.id,r.status,r.created_at,u.name invitee_name,o.id order_id,o.status order_status,o.total_cents
         FROM referrals r LEFT JOIN users u ON u.id=r.invitee_id
         LEFT JOIN orders o ON o.referral_id=r.id
         WHERE r.inviter_id=? ORDER BY r.created_at DESC`,
      )
      .all(userId);
  },
  findOrderByKey(key) {
    return db.prepare("SELECT * FROM orders WHERE idempotency_key=?").get(key);
  },
  findInviterByCode(code) {
    return db.prepare("SELECT * FROM users WHERE referral_code=?").get(code);
  },
  findUserByEmail(email) {
    return db.prepare("SELECT * FROM users WHERE email=?").get(email);
  },
  userHasOrders(userId) {
    return Boolean(
      db.prepare("SELECT id FROM orders WHERE user_id=? LIMIT 1").get(userId),
    );
  },
  userHasReferral(userId) {
    return Boolean(
      db.prepare("SELECT id FROM referrals WHERE invitee_id=?").get(userId),
    );
  },
  creditBalance(userId) {
    const earned = db
      .prepare(
        "SELECT COALESCE(SUM(amount_cents),0) n FROM credits WHERE user_id=? AND status='available'",
      )
      .get(userId).n;
    const reserved = db
      .prepare(
        "SELECT COALESCE(SUM(amount_cents),0) n FROM credit_redemptions WHERE user_id=? AND status IN ('pending','redeemed')",
      )
      .get(userId).n;
    return { earned, reserved, available: earned - reserved };
  },
  createUser(user) {
    db.prepare("INSERT INTO users(id,name,email) VALUES(?,?,?)").run(
      user.id,
      user.name,
      user.email,
    );
  },
  createReferral(inviterId, inviteeId, code) {
    return db
      .prepare(
        "INSERT INTO referrals(inviter_id,invitee_id,code,status) VALUES(?,?,?,'pending')",
      )
      .run(inviterId, inviteeId, code);
  },
  createOrder(order) {
    db.prepare(
      "INSERT INTO orders(id,user_id,referral_id,status,subtotal_cents,discount_cents,shipping_cents,total_cents,idempotency_key) VALUES(?,?,?,'pending',?,?,0,?,?)",
    ).run(
      order.id,
      order.userId,
      order.referralId,
      order.subtotal,
      order.discount,
      order.total,
      order.idempotencyKey,
    );
  },
  createOrderItem(orderId, productId, quantity, unitPriceCents) {
    db.prepare(
      "INSERT INTO order_items(order_id,product_id,quantity,unit_price_cents) VALUES(?,?,?,?)",
    ).run(orderId, productId, quantity, unitPriceCents);
  },
  reserveCredit(userId, orderId, amountCents) {
    db.prepare(
      "INSERT INTO credit_redemptions(user_id,order_id,amount_cents,status) VALUES(?,?,?,'pending')",
    ).run(userId, orderId, amountCents);
  },
  getOrder(id) {
    return db.prepare("SELECT * FROM orders WHERE id=?").get(id);
  },
  updateOrderStatus(id, status) {
    db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, id);
  },
  getReferral(id) {
    return db.prepare("SELECT * FROM referrals WHERE id=?").get(id);
  },
  updateReferralStatus(id, status) {
    db.prepare("UPDATE referrals SET status=? WHERE id=?").run(status, id);
  },
  getOrderCreditAmount(orderId) {
    return db
      .prepare(
        "SELECT COALESCE(SUM(amount_cents),0) n FROM credits WHERE order_id=? AND status='available'",
      )
      .get(orderId).n;
  },
  countConfirmedReferrals(inviterId) {
    return db
      .prepare(
        "SELECT COUNT(*) n FROM referrals WHERE inviter_id=? AND status='confirmed'",
      )
      .get(inviterId).n;
  },
  inviterAvailableCredits(inviterId) {
    return db
      .prepare(
        "SELECT COALESCE(SUM(amount_cents),0) n FROM credits WHERE user_id=? AND status='available'",
      )
      .get(inviterId).n;
  },
  inviterSpentCredits(inviterId) {
    return db
      .prepare(
        "SELECT COALESCE(SUM(amount_cents),0) n FROM credit_redemptions WHERE user_id=? AND status IN ('pending','redeemed')",
      )
      .get(inviterId).n;
  },
  reverseOrderRedemptions(orderId) {
    db.prepare(
      "UPDATE credit_redemptions SET status='reversed' WHERE order_id=? AND status='redeemed'",
    ).run(orderId);
  },
  reverseOrderCredits(orderId) {
    db.prepare(
      "UPDATE credits SET status='reversed' WHERE order_id=? AND status='available'",
    ).run(orderId);
  },
  resolveOrderRedemptions(orderId, status) {
    db.prepare(
      "UPDATE credit_redemptions SET status=? WHERE order_id=? AND status='pending'",
    ).run(status, orderId);
  },
  createReferralCredit(inviterId, orderId) {
    db.prepare(
      "INSERT OR IGNORE INTO credits(user_id,order_id,amount_cents,status) VALUES(?,?,800,'available')",
    ).run(inviterId, orderId);
  },
  getReward(inviterId) {
    return db
      .prepare(
        "SELECT id,status FROM rewards WHERE user_id=? AND kind='accessory' AND threshold=3",
      )
      .get(inviterId);
  },
  restoreReward(id) {
    db.prepare("UPDATE rewards SET status='available' WHERE id=?").run(id);
  },
  reverseAvailableReward(inviterId) {
    db.prepare(
      "UPDATE rewards SET status='reversed' WHERE user_id=? AND kind='accessory' AND status='available'",
    ).run(inviterId);
  },
  createReward(id, userId) {
    db.prepare(
      "INSERT INTO rewards(id,user_id,kind,status,threshold,estimated_cost_cents) VALUES(?,?,'accessory','available',3,2400)",
    ).run(id, userId);
  },
};
