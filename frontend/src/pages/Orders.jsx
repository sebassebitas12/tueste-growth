import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { useAccount } from "../hooks/useAccount.js";
import { AccountNav } from "../components/AccountComponents.jsx";
import { EmptyState, ErrorState, Loading } from "../components/Feedback.jsx";
import { money } from "../utils/format.js";

export function Orders() {
  const { user } = useShop();
  const { data, error } = useAccount(user);
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  return (
    <div className="account-layout section-wrap">
      <AccountNav />
      <section className="account-main">
        <p className="eyebrow">MI CUENTA</p>
        <h1>Mis pedidos.</h1>
        {data.orders.length ? (
          <ul className="order-list">
            {data.orders.map((o) => (
              <li key={o.id}>
                <div>
                  <strong>
                    {o.id.startsWith("demo-")
                      ? "Pedido de ejemplo"
                      : `Pedido ${o.id.slice(0, 8)}`}
                  </strong>
                  <small>
                    {new Date(o.created_at + "Z").toLocaleDateString("es-CR")} ·{" "}
                    {o.status === "confirmed"
                      ? "Confirmado"
                      : o.status === "pending"
                        ? "Pendiente"
                        : o.status === "returned"
                          ? "Devuelto"
                          : "Cancelado"}
                  </small>
                </div>
                <strong>{money(o.total_cents / 100)}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Todavía no hay pedidos"
            text="Cuando hagás una compra de demostración, aparecerá acá."
          />
        )}
      </section>
    </div>
  );
}
