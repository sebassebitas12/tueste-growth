import { Check } from "lucide-react";
import { NavLink } from "react-router-dom";
import { EmptyState } from "./Feedback.jsx";
export function AccountNav() {
  return (
    <aside className="account-nav">
      <p className="eyebrow">TU CUENTA</p>
      <NavLink end to="/cuenta">
        Resumen
      </NavLink>
      <NavLink to="/cuenta/pedidos">Pedidos</NavLink>
      <NavLink to="/cuenta/referidos">Mis referidos</NavLink>
      <NavLink to="/cuenta/recompensas">Recompensas</NavLink>
      <NavLink to="/cuenta/actividad">Actividad</NavLink>
    </aside>
  );
}

export function ReferralList({ rows }) {
  return rows.length ? (
    <ul className="referral-list">
      {rows.map((row) => (
        <li key={row.id}>
          <span className="status-check">
            <Check size={15} />
          </span>
          <div>
            <strong>{row.invitee_name || "Amistad invitada"}</strong>
            <small>
              {row.order_id ? "Compra confirmada" : "Invitación enviada"}
            </small>
          </div>
          <strong className="credit-plus">
            {row.order_id ? "+ $8" : "Pendiente"}
          </strong>
        </li>
      ))}
    </ul>
  ) : (
    <EmptyState
      title="Todavía no hay actividad"
      text="Compartí tu enlace y vas a ver cada invitación acá."
    />
  );
}
