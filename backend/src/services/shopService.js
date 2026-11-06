import { shopRepository as repository } from "../repositories/shopRepository.js";

export function listProducts() {
  return repository.listProducts().map((product) => ({
    ...product,
    price: product.price_cents / 100,
  }));
}

export function listDemoUsers() {
  return {
    users: repository.getDemoUsers(),
    notice: "Datos de demostración; no son clientes reales.",
  };
}

export function getInvitation(code) {
  const invitation = repository.getInvitation(code);
  if (!invitation)
    throw Object.assign(
      new Error("Este enlace no existe o ya no está disponible."),
      { status: 404 },
    );
  return {
    code,
    inviter: invitation.inviter_name,
    discount_cents: 800,
    discount: 8,
  };
}

export function getAccount(userId) {
  const account = repository.getAccount(userId);
  if (!account)
    throw Object.assign(new Error("No encontramos esa cuenta demo."), {
      status: 404,
    });
  return account;
}

export function getMetrics() {
  const metrics = repository.getMetrics();
  return {
    funnel: metrics.funnel,
    economics: metrics.economics,
    orders: metrics.orders,
    confirmed_referrals: metrics.confirmedReferrals,
    credit_liability_cents: metrics.totalCredits,
    rewards_available: metrics.rewards.n,
    reward_estimated_cost_cents: metrics.rewards.cost,
    note: "Embudo y economía base del caso. Pedidos, créditos y recompensas vigentes se consultan de la base local de demostración.",
  };
}

export function getActivity(userId) {
  return repository.getActivity(userId);
}
