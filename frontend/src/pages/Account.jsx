import { ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { useAccount } from "../hooks/useAccount.js";
import { AccountNav, ReferralList } from "../components/AccountComponents.jsx";
import { ErrorState, EmptyState, Loading } from "../components/Feedback.jsx";
import { money } from "../utils/format.js";

export function Account() {
  const { user } = useShop();
  const { data, error } = useAccount(user);
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  const referrals = data.confirmed_referrals;
  return (
    <div className="account-layout section-wrap">
      <AccountNav />
      <section className="account-main">
        <p className="eyebrow">MI CUENTA · DEMOSTRACIÓN</p>
        <h1>Hola, {data.user.name}.</h1>
        <p className="lead">Tu café y lo que compartís, en un solo lugar.</p>
        <div className="account-stats">
          <div>
            <span>Crédito disponible</span>
            <strong>{money(data.credit_available_cents / 100)}</strong>
          </div>
          <div>
            <span>Amistades que compraron</span>
            <strong>{referrals}</strong>
          </div>
        </div>
        <section className="progress-panel">
          <div>
            <p className="eyebrow">TU PRÓXIMO PREMIO</p>
            <h2>
              {referrals >= 3
                ? "Tu accesorio está disponible."
                : `Un accesorio para tu ritual`}
            </h2>
          </div>
          <p>{Math.min(referrals, 3)} de 3 amistades compraron</p>
          <div className="progress-track">
            <span style={{ width: `${(Math.min(referrals, 3) / 3) * 100}%` }} />
          </div>
          <p className="muted">
            {referrals >= 3
              ? "Premio listo para tu próximo pedido."
              : "Te falta una compra confirmada."}
          </p>
          <p className="reward-note">
            <Gift size={23} /> Accesorio conceptual · costo supuesto de $24
          </p>
        </section>
        <h2 className="subhead">Compras de tus amistades</h2>
        <ReferralList rows={data.referrals} />
        <div className="account-links">
          <Link to="/cuenta/pedidos">
            Ver pedidos <ArrowRight size={15} />
          </Link>
          <Link to="/cuenta/actividad">
            Ver actividad <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
