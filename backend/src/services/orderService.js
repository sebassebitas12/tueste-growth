import { randomUUID } from "node:crypto";
import { transaction } from "../db/connection.js";
import { shopRepository as repository } from "../repositories/shopRepository.js";

function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}

export function createOrder(input = {}) {
  const {
    productId,
    quantity = 1,
    inviteCode,
    customerName,
    customerEmail,
    idempotencyKey,
    useCreditCents = 0,
  } = input;
  const product = repository.getProduct(productId);
  if (!product) throw httpError(400, "Elegí un producto disponible.");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5)
    throw httpError(400, "La cantidad debe estar entre 1 y 5.");
  if (
    !Number.isInteger(useCreditCents) ||
    useCreditCents < 0 ||
    useCreditCents > 800
  )
    throw httpError(400, "Podés usar hasta $8 de crédito por pedido.");
  if (useCreditCents > 0 && productId !== "duo")
    throw httpError(
      409,
      "El crédito de demostración aplica a la compra de dos bolsas.",
    );
  if (!customerName?.trim() || !/^\S+@\S+\.\S+$/.test(customerEmail || ""))
    throw httpError(
      400,
      "Completá un nombre y un correo válidos para la demostración.",
    );
  if (!idempotencyKey || typeof idempotencyKey !== "string")
    throw httpError(
      400,
      "No pudimos identificar esta solicitud. Volvé a intentarlo.",
    );

  const normalizedEmail = customerEmail.toLowerCase();
  try {
    return transaction(() => {
      const existing = repository.findOrderByKey(idempotencyKey);
      if (existing) return { order: existing, replayed: true };
      const inviter = inviteCode
        ? repository.findInviterByCode(inviteCode)
        : null;
      if (inviteCode && !inviter)
        throw httpError(404, "El enlace de invitación no es válido.");
      if (inviter && productId !== "duo")
        throw httpError(
          409,
          "El beneficio de invitación aplica a la compra de dos bolsas.",
        );
      if (inviter && useCreditCents > 0)
        throw httpError(
          409,
          "En esta demostración, el descuento de invitación y el crédito no se combinan.",
        );
      if (inviter && inviter.email.toLowerCase() === normalizedEmail)
        throw httpError(409, "No podés usar tu propio enlace de invitación.");

      let user = repository.findUserByEmail(normalizedEmail);
      if (useCreditCents > 0 && !user)
        throw httpError(
          409,
          "El crédito está ligado a una cuenta demo existente.",
        );
      if (user && inviter && user.id === inviter.id)
        throw httpError(409, "No podés usar tu propio enlace de invitación.");
      if (user && inviter && repository.userHasOrders(user.id))
        throw httpError(
          409,
          "El beneficio de invitación aplica a una primera compra elegible.",
        );
      if (useCreditCents > 0) {
        const balance = repository.creditBalance(user.id);
        if (balance.available < useCreditCents)
          throw httpError(
            409,
            "El crédito disponible cambió. Revisá tu cuenta y volvé a intentar.",
          );
      }
      if (!user) {
        user = {
          id: randomUUID(),
          name: customerName.trim(),
          email: normalizedEmail,
        };
        repository.createUser(user);
      }
      if (inviter && repository.userHasReferral(user.id))
        throw httpError(
          409,
          "Este cliente ya tiene una invitación registrada.",
        );

      const referralId = inviter
        ? Number(
            repository.createReferral(inviter.id, user.id, inviteCode)
              .lastInsertRowid,
          )
        : null;
      const subtotal = product.price_cents * quantity;
      const discount = inviter ? Math.min(800, subtotal) : useCreditCents;
      const id = randomUUID();
      const order = {
        id,
        userId: user.id,
        referralId,
        subtotal,
        discount,
        total: subtotal - discount,
        idempotencyKey,
      };
      repository.createOrder(order);
      repository.createOrderItem(id, productId, quantity, product.price_cents);
      if (useCreditCents > 0)
        repository.reserveCredit(user.id, id, useCreditCents);
      return {
        order: {
          id,
          status: "pending",
          user_id: user.id,
          subtotal_cents: subtotal,
          discount_cents: discount,
          total_cents: subtotal - discount,
          subtotal: subtotal / 100,
          discount: discount / 100,
          total: (subtotal - discount) / 100,
        },
        replayed: false,
      };
    });
  } catch (error) {
    if (error.status) throw error;
    throw httpError(
      409,
      "No fue posible registrar el pedido. Revisá si ya se procesó.",
    );
  }
}

export function updateOrderStatus(orderId, nextStatus) {
  if (!["confirmed", "cancelled", "returned"].includes(nextStatus))
    throw httpError(400, "Estado de pedido no válido.");
  try {
    return transaction(() => {
      const order = repository.getOrder(orderId);
      if (!order) throw httpError(404, "No encontramos el pedido.");
      if (order.status === nextStatus) return { order, replayed: true };

      if (order.status === "confirmed" && nextStatus === "returned") {
        if (order.referral_id) {
          const referral = repository.getReferral(order.referral_id);
          const earning = repository.getOrderCreditAmount(order.id);
          const allEarned = repository.inviterAvailableCredits(
            referral.inviter_id,
          );
          const spent = repository.inviterSpentCredits(referral.inviter_id);
          if (allEarned - earning - spent < 0)
            throw httpError(
              409,
              "El crédito de esta compra ya se usó. La política comercial ante este caso sigue pendiente; no se cambió el pedido.",
            );
        }
        repository.updateOrderStatus(order.id, "returned");
        repository.reverseOrderRedemptions(order.id);
        if (order.referral_id) {
          const referral = repository.getReferral(order.referral_id);
          repository.updateReferralStatus(referral.id, "returned");
          repository.reverseOrderCredits(order.id);
          if (repository.countConfirmedReferrals(referral.inviter_id) < 3)
            repository.reverseAvailableReward(referral.inviter_id);
        }
        return { order: { ...order, status: "returned" }, replayed: false };
      }

      if (order.status !== "pending")
        throw httpError(
          409,
          "Este pedido ya se resolvió y no se puede cambiar desde esta demo.",
        );
      repository.updateOrderStatus(order.id, nextStatus);
      if (nextStatus === "confirmed")
        repository.resolveOrderRedemptions(order.id, "redeemed");
      if (nextStatus === "cancelled")
        repository.resolveOrderRedemptions(order.id, "reversed");

      if (order.referral_id) {
        const referral = repository.getReferral(order.referral_id);
        if (nextStatus === "confirmed") {
          repository.updateReferralStatus(referral.id, "confirmed");
          repository.createReferralCredit(referral.inviter_id, order.id);
          if (repository.countConfirmedReferrals(referral.inviter_id) >= 3) {
            const reward = repository.getReward(referral.inviter_id);
            if (reward?.status === "reversed")
              repository.restoreReward(reward.id);
            else if (!reward)
              repository.createReward(randomUUID(), referral.inviter_id);
          }
        } else repository.updateReferralStatus(referral.id, nextStatus);
      }
      return { order: { ...order, status: nextStatus }, replayed: false };
    });
  } catch (error) {
    if (error.status) throw error;
    throw httpError(500, error.message);
  }
}
