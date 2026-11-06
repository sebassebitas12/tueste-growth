import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const backendRoot = resolve(import.meta.dirname, "..");
const frontendRoot = resolve(backendRoot, "../frontend");
const root = resolve(backendRoot, "..");
const dbPath = resolve(backendRoot, `data/integration-${randomUUID()}.sqlite`);
const apiPort = 32100 + Math.floor(Math.random() * 500);
const webPort = 32600 + Math.floor(Math.random() * 300);
const apiOrigin = `http://127.0.0.1:${apiPort}`;
const webOrigin = `http://127.0.0.1:${webPort}`;
const env = {
  ...process.env,
  DB_PATH: dbPath,
  PORT: String(apiPort),
  VITE_API_PROXY: apiOrigin,
};
let api,
  web,
  apiErrorLog = "";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(url) {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return r;
    } catch {}
    await sleep(150);
  }
  throw new Error(`Servidor no respondió: ${url}`);
}
async function apiJson(path, options) {
  const r = await fetch(`${apiOrigin}${path}`, options);
  const data = await r.json();
  return { status: r.status, data };
}
async function createOrder(
  email,
  key,
  inviteCode = "ana-demo",
  productId = "duo",
  useCreditCents = 0,
) {
  return apiJson("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId,
      quantity: 1,
      inviteCode,
      useCreditCents,
      customerName: "Cliente demo",
      customerEmail: email,
      idempotencyKey: key,
      price: 1,
    }),
  });
}
function startApi() {
  api = spawn(process.execPath, [resolve(backendRoot, "src/index.js")], {
    cwd: backendRoot,
    env,
    stdio: ["ignore", "ignore", "pipe"],
  });
  api.stderr.setEncoding("utf8");
  api.stderr.on("data", (chunk) => (apiErrorLog += chunk));
}
function startWeb() {
  web = spawn(
    process.execPath,
    [
      resolve(root, "node_modules/vite/bin/vite.js"),
      "--host",
      "127.0.0.1",
      "--port",
      String(webPort),
      "--configLoader",
      "runner",
    ],
    { cwd: frontendRoot, env, stdio: "ignore" },
  );
}
try {
  const seeded = spawnSync(
    process.execPath,
    [resolve(backendRoot, "src/db/seed.js"), "--reset"],
    { cwd: backendRoot, env, encoding: "utf8" },
  );
  assert.equal(seeded.status, 0, seeded.stderr || "Falló el seed de prueba.");
  startApi();
  startWeb();
  await Promise.all([waitFor(`${apiOrigin}/api/health`), waitFor(webOrigin)]);
  const webHealth = await fetch(`${webOrigin}/api/health`);
  assert.deepEqual(await webHealth.json(), { ok: true, storage: "sqlite" });
  const shell = await (await fetch(`${webOrigin}/invitacion/ana-demo`)).text();
  assert.match(shell, /Tueste/);
  const product = await apiJson("/api/products");
  assert.equal(product.data.find((p) => p.id === "duo").price_cents, 3400);
  const metrics = await apiJson("/api/admin/metrics");
  assert.equal(
    metrics.status,
    200,
    `${JSON.stringify(metrics.data)} ${apiErrorLog}`,
  );
  assert.equal(
    metrics.data.funnel.find((step) => step.step_key === "program").denominator,
    350,
  );
  assert.equal(
    metrics.data.economics.find((item) => item.metric_key === "accessory_cost")
      .value_cents,
    2400,
  );
  assert.equal((await apiJson("/api/referrals/no-existe")).status, 404);
  assert.equal(
    (
      await createOrder(
        "pack-ineligible@demo.tueste",
        `product-${randomUUID()}`,
        "ana-demo",
        "pack",
      )
    ).status,
    409,
  );
  const key = `invite-third-${randomUUID()}`;
  const pending = await createOrder("amistad.tercera@demo.tueste", key);
  assert.equal(pending.status, 201);
  assert.equal(pending.data.order.total_cents, 2600);
  assert.equal(pending.data.order.status, "pending");
  const repeat = await apiJson("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: "duo",
      quantity: 1,
      inviteCode: "ana-demo",
      customerName: "Cliente demo",
      customerEmail: "amistad.tercera@demo.tueste",
      idempotencyKey: key,
    }),
  });
  assert.equal(repeat.status, 200);
  assert.equal(repeat.data.replayed, true);
  const confirmed = await apiJson(
    `/api/orders/${pending.data.order.id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    },
  );
  assert.equal(confirmed.data.order.status, "confirmed");
  let account = (await apiJson("/api/account/ana")).data;
  assert.equal(account.credit_available_cents, 2400);
  assert.equal(account.confirmed_referrals, 3);
  assert.equal(account.reward.status, "available");
  const confirmAgain = await apiJson(
    `/api/orders/${pending.data.order.id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    },
  );
  assert.equal(confirmAgain.data.replayed, true);
  account = (await apiJson("/api/account/ana")).data;
  assert.equal(account.credit_available_cents, 2400);
  const returned = await apiJson(
    `/api/orders/${pending.data.order.id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "returned" }),
    },
  );
  assert.equal(returned.data.order.status, "returned");
  account = (await apiJson("/api/account/ana")).data;
  assert.equal(account.credit_available_cents, 1600);
  assert.equal(account.confirmed_referrals, 2);
  assert.equal(account.reward.status, "reversed");
  const returnedAgain = await apiJson(
    `/api/orders/${pending.data.order.id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "returned" }),
    },
  );
  assert.equal(returnedAgain.data.replayed, true);
  assert.equal(
    (
      await apiJson("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "duo",
          quantity: 1,
          inviteCode: "ana-demo",
          customerName: "Ana",
          customerEmail: "ana@demo.tueste",
          idempotencyKey: `self-${randomUUID()}`,
        }),
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await apiJson("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "duo",
          quantity: 1,
          inviteCode: "ana-demo",
          customerName: "Sofía",
          customerEmail: "sofia@demo.tueste",
          idempotencyKey: `existing-${randomUUID()}`,
        }),
      })
    ).status,
    409,
  );
  const cancel = await createOrder(
    "cancelado@demo.tueste",
    `cancel-${randomUUID()}`,
    null,
  );
  const cancelled = await apiJson(
    `/api/orders/${cancel.data.order.id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    },
  );
  assert.equal(cancelled.data.order.status, "cancelled");
  api.kill();
  await sleep(350);
  api = null;
  startApi();
  await waitFor(`${apiOrigin}/api/health`);
  account = (await apiJson("/api/account/ana")).data;
  assert.equal(account.credit_available_cents, 1600);
  assert.equal(account.reward.status, "reversed");
  const creditOrder = await createOrder(
    "ana@demo.tueste",
    `credit-${randomUUID()}`,
    null,
    "duo",
    800,
  );
  assert.equal(creditOrder.status, 201);
  assert.equal(creditOrder.data.order.total_cents, 2600);
  account = (await apiJson("/api/account/ana")).data;
  assert.equal(account.credit_available_cents, 800);
  const creditConfirmed = await apiJson(
    `/api/orders/${creditOrder.data.order.id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    },
  );
  assert.equal(creditConfirmed.data.order.status, "confirmed");
  account = (await apiJson("/api/account/ana")).data;
  assert.equal(account.credit_redeemed_cents, 800);
  await apiJson(`/api/orders/${creditOrder.data.order.id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "returned" }),
  });
  account = (await apiJson("/api/account/ana")).data;
  assert.equal(account.credit_available_cents, 1600);
  assert.equal(account.credit_redeemed_cents, 0);
  const stack = await createOrder(
    "otra-amistad@demo.tueste",
    `stack-${randomUUID()}`,
    "ana-demo",
    "duo",
    800,
  );
  assert.equal(stack.status, 409);
  console.log(
    "OK: Vite → API → SQLite; precio/beneficio; idempotencia; autorreferido; primera compra; estados; crédito/premio; persistencia tras reinicio.",
  );
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  api?.kill();
  web?.kill();
  await sleep(250);
  for (const file of [dbPath, `${dbPath}-wal`, `${dbPath}-shm`])
    if (existsSync(file)) rmSync(file);
}
