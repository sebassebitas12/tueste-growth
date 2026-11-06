import { db, transaction } from "./connection.js";

if (process.argv.includes("--reset")) {
  db.exec(
    "DROP TABLE IF EXISTS rewards; DROP TABLE IF EXISTS credit_redemptions; DROP TABLE IF EXISTS credits; DROP TABLE IF EXISTS order_items; DROP TABLE IF EXISTS orders; DROP TABLE IF EXISTS referrals; DROP TABLE IF EXISTS case_economics; DROP TABLE IF EXISTS case_funnel; DROP TABLE IF EXISTS products; DROP TABLE IF EXISTS users;",
  );
  db.exec(
    (await import("node:fs")).readFileSync(
      new URL("./schema.sql", import.meta.url),
      "utf8",
    ),
  );
}

transaction(() => {
  db.prepare(
    `INSERT OR IGNORE INTO users(id,name,email,role,referral_code) VALUES
    ('ana','Ana','ana@demo.tueste','customer','ana-demo'),
    ('diego','Diego','diego@demo.tueste','admin','diegodemo'),
    ('sofia','Sofía','sofia@demo.tueste','customer',NULL),
    ('luis','Luis','luis@demo.tueste','customer',NULL)`,
  ).run();
  const addProduct = db.prepare(
    "INSERT OR IGNORE INTO products(id,name,description,quantity,price_cents) VALUES(?,?,?,?,?)",
  );
  addProduct.run(
    "duo",
    "Dos bolsas",
    "Dos bolsas de café de especialidad, 340 g cada una.",
    "2 × 340 g",
    3400,
  );
  addProduct.run(
    "pack",
    "Pack de tres",
    "Tres bolsas para compartir el ritual.",
    "3 × 340 g",
    4800,
  );
  addProduct.run(
    "subscription",
    "Suscripción",
    "Dos bolsas al mes. Pausa cuando lo necesités.",
    "2 bolsas / mes",
    3060,
  );
  const metric = db.prepare(
    "INSERT OR IGNORE INTO case_funnel(step_key,label,value,denominator,source,sort_order) VALUES(?,?,?,?,?,?)",
  );
  metric.run(
    "initial",
    "Clientes iniciales",
    1000,
    1000,
    "Parte 2, página 3",
    1,
  );
  metric.run("email", "Abren el correo", 350, 1000, "Parte 2, página 3", 2);
  metric.run("program", "Entran al programa", 120, 350, "Parte 2, página 3", 3);
  metric.run(
    "senders",
    "Envían invitaciones",
    100,
    120,
    "Parte 2, página 3",
    4,
  );
  metric.run("sent", "Invitaciones enviadas", 300, 100, "Parte 2, página 3", 5);
  metric.run(
    "visits",
    "Abren la tienda invitada",
    150,
    300,
    "Parte 2, página 3",
    6,
  );
  metric.run(
    "purchases",
    "Compran por referido",
    60,
    150,
    "Parte 2, página 3",
    7,
  );
  const economy = db.prepare(
    "INSERT OR IGNORE INTO case_economics(metric_key,label,value_cents,display_value,detail,source,sort_order) VALUES(?,?,?,?,?,?,?)",
  );
  economy.run(
    "cac",
    "CAC actual de Meta",
    5000,
    "$50",
    "($4.000 de Meta + $1.000 de agencia) / 100 clientes nuevos de Meta",
    "Parte 1, páginas 4–5; Parte 2, página 4",
    1,
  );
  economy.run(
    "reward_cap",
    "Tope de recompensas",
    2500,
    "$25",
    "Mitad del CAC; no garantiza rentabilidad.",
    "Parte 2, página 4",
    2,
  );
  economy.run(
    "accessory_cost",
    "Costo completo del accesorio",
    2400,
    "$24",
    "Supuesto del equipo, pendiente de cotización.",
    "Supuesto de diseño",
    3,
  );
  economy.run(
    "meta_budget",
    "Presupuesto mensual de Meta",
    400000,
    "$4.000",
    "Inversión mensual actual del caso.",
    "Parte 1, página 6; Parte 2, página 2",
    4,
  );
  const ref = db.prepare(
    "INSERT OR IGNORE INTO referrals(id,inviter_id,invitee_id,code,status,reward_id) VALUES(?, 'ana', ?, 'ana-demo','confirmed',?)",
  );
  ref.run(1, "sofia", "reward-sofia");
  ref.run(2, "luis", "reward-luis");
  const insertOrder = db.prepare(
    `INSERT OR IGNORE INTO orders(id,user_id,referral_id,status,subtotal_cents,discount_cents,shipping_cents,total_cents,idempotency_key,created_at) VALUES(?,?,?,'confirmed',3400,0,0,3400,?,datetime('now',?))`,
  );
  insertOrder.run("demo-sofia", "sofia", 1, "seed-sofia", "-12 days");
  insertOrder.run("demo-luis", "luis", 2, "seed-luis", "-7 days");
  const item = db.prepare(
    "INSERT OR IGNORE INTO order_items(order_id,product_id,quantity,unit_price_cents) VALUES(?,?,1,3400)",
  );
  item.run("demo-sofia", "duo");
  item.run("demo-luis", "duo");
  const credit = db.prepare(
    "INSERT OR IGNORE INTO credits(user_id,order_id,amount_cents,status) VALUES('ana',?,800,'available')",
  );
  credit.run("demo-sofia");
  credit.run("demo-luis");
});
db.close();
console.log("Base local preparada con usuarios y actividad de demostración.");
