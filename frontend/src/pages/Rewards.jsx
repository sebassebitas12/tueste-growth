import { ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { useAccount } from "../hooks/useAccount.js";
import { AccountNav } from "../components/AccountComponents.jsx";
import { ErrorState, Loading } from "../components/Feedback.jsx";
import { money } from "../utils/format.js";

export function Rewards() {
  const { user } = useShop();
  const { data, error } = useAccount(user);
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  return (
    <div className="account-layout section-wrap">
      <AccountNav />
      <section className="account-main">
        <p className="eyebrow">MI CUENTA</p>
        <h1>Recompensas.</h1>
        <div className="reward-large">
          <Gift size={30} />
          <div>
            <h2>Un accesorio para tu ritual</h2>
            <p>
              {data.reward?.status === "available"
                ? "Disponible para tu próximo pedido"
                : `Propuesta de premio · avance ${Math.min(data.confirmed_referrals, 3)} de 3`}
            </p>
          </div>
        </div>
        <h2 className="subhead">Créditos de invitación</h2>
        <div className="credit-row">
          <span>Disponibles</span>
          <strong>{money(data.credit_available_cents / 100)}</strong>
        </div>
        <div className="credit-row">
          <span>Canjeados</span>
          <strong>{money(data.credit_redeemed_cents / 100)}</strong>
        </div>
        <Link to="/condiciones" className="text-link">
          Ver condiciones completas <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
