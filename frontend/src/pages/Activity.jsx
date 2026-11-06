import { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext.jsx";
import { fetchJson } from "../services/api.js";
import { AccountNav } from "../components/AccountComponents.jsx";
import { EmptyState, ErrorState, Loading } from "../components/Feedback.jsx";

export function Activity() {
  const { user } = useShop();
  const [rows, setRows] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    fetchJson(`/activity/${user}`)
      .then(setRows)
      .catch((e) => setError(e.message));
  }, [user]);
  return (
    <div className="account-layout section-wrap">
      <AccountNav />
      <section className="account-main">
        <p className="eyebrow">MI CUENTA</p>
        <h1>Tu actividad.</h1>
        {error ? (
          <ErrorState message={error} />
        ) : !rows ? (
          <Loading />
        ) : rows.length ? (
          <ul className="order-list">
            {rows.map((row) => (
              <li key={row.id}>
                <div>
                  <strong>{row.invitee_name || "Invitación enviada"}</strong>
                  <small>
                    {row.order_id
                      ? `Compra ${row.order_status === "confirmed" ? "confirmada" : row.order_status}`
                      : row.status === "pending"
                        ? "Compra pendiente"
                        : "Invitación"}
                  </small>
                </div>
                <span className={`activity-state ${row.status}`}>
                  {row.status === "confirmed"
                    ? "Confirmado"
                    : row.status === "pending"
                      ? "Pendiente"
                      : row.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Tu actividad empieza con una invitación"
            text="Compartí el enlace personal para ver avances acá."
          />
        )}
      </section>
    </div>
  );
}
