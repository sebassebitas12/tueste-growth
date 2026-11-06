import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { useAccount } from "../hooks/useAccount.js";
import { fetchJson } from "../services/api.js";
import { Loading } from "../components/Feedback.jsx";
import { money } from "../utils/format.js";

export function Checkout() {
  const { products, cart, user } = useShop();
  const { data: account } = useAccount(user);
  const product =
    products.find((p) => p.id === cart.productId) ||
    products.find((p) => p.id === "duo");
  const [form, setForm] = useState({ name: "", email: "" });
  const [useCredit, setUseCredit] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const navigate = useNavigate();
  if (!product) return <Loading />;
  const creditCents = useCredit
    ? Math.min(800, account?.credit_available_cents || 0)
    : 0;
  const discount = cart.inviteCode
    ? Math.min(800, product.price * cart.quantity)
    : creditCents;
  const total = product.price * cart.quantity - discount;
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await fetchJson("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: cart.quantity,
          inviteCode: cart.inviteCode || null,
          useCreditCents: creditCents,
          customerName: form.name,
          customerEmail: form.email,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      navigate(`/confirmacion/${data.order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="narrow-page">
      <p className="eyebrow">COMPRA SIMULADA · SIN PAGOS</p>
      <h1>
        Finalizá tu
        <br />
        <em>pedido.</em>
      </h1>
      <p className="lead">
        No ingresés datos bancarios. Esta compra se registra como demostración.
      </p>
      <form className="checkout-form" onSubmit={submit}>
        <label>
          Nombre
          <input
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Tu nombre"
          />
        </label>
        <label>
          Correo
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="nombre@correo.com"
          />
        </label>
        {!cart.inviteCode &&
          product.id === "duo" &&
          account?.credit_available_cents > 0 && (
            <label className="credit-choice">
              <input
                type="checkbox"
                checked={useCredit}
                onChange={(e) => {
                  setUseCredit(e.target.checked);
                  if (e.target.checked)
                    setForm({
                      name: account.user.name,
                      email: account.user.email,
                    });
                }}
              />
              <span>
                Usar hasta{" "}
                {money(Math.min(8, account.credit_available_cents / 100))} de
                crédito de {account.user.name}
              </span>
            </label>
          )}
        {useCredit && (
          <p className="muted small">
            El correo debe coincidir con la cuenta de demostración seleccionada.
            Este prototipo reserva el crédito mientras confirmás el pedido.
          </p>
        )}
        <div className="checkout-total">
          <span>Total simulado</span>
          <strong>{money(total)}</strong>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="button primary full" disabled={busy}>
          {busy ? "Registrando…" : `Confirmar pedido · ${money(total)}`}{" "}
          <ArrowRight size={17} />
        </button>
      </form>
      <p className="muted centered-text">
        Pago, envío y notificaciones no se realizan.
      </p>
    </div>
  );
}
