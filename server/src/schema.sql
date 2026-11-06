PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  referral_code TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS case_funnel (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  step_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  value INTEGER NOT NULL,
  denominator INTEGER NOT NULL,
  source TEXT NOT NULL,
  sort_order INTEGER NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS case_economics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  value_cents INTEGER NOT NULL,
  display_value TEXT NOT NULL,
  detail TEXT NOT NULL,
  source TEXT NOT NULL,
  sort_order INTEGER NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inviter_id TEXT NOT NULL REFERENCES users(id),
  invitee_id TEXT UNIQUE REFERENCES users(id),
  code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('invited','pending','confirmed','cancelled','returned')),
  reward_id TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(inviter_id, code, invitee_id)
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  referral_id INTEGER REFERENCES referrals(id),
  status TEXT NOT NULL CHECK (status IN ('pending','confirmed','cancelled','returned')),
  subtotal_cents INTEGER NOT NULL,
  discount_cents INTEGER NOT NULL DEFAULT 0,
  shipping_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL REFERENCES orders(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS credits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  order_id TEXT NOT NULL UNIQUE REFERENCES orders(id),
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available','redeemed','reversed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS credit_redemptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  order_id TEXT NOT NULL UNIQUE REFERENCES orders(id),
  amount_cents INTEGER NOT NULL CHECK (amount_cents BETWEEN 1 AND 800),
  status TEXT NOT NULL CHECK (status IN ('pending','redeemed','reversed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS rewards (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  kind TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available','redeemed','reversed')),
  threshold INTEGER NOT NULL,
  estimated_cost_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, kind, threshold)
);
