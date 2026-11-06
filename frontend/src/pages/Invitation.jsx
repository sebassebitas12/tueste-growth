import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { fetchJson } from "../services/api.js";
import { BagArt } from "../components/ProductVisuals.jsx";
import { Loading } from "../components/Feedback.jsx";
import { money } from "../utils/format.js";

export function Invitation() {
  const { code } = useParams();
  const { setCart, cart } = useShop();
  const [invite, setInvite] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    fetchJson(`/referrals/${encodeURIComponent(code)}`)
      .then((data) => {
        setInvite(data);
        setCart((c) => ({ ...c, inviteCode: code }));
      })
      .catch((e) => setError(e.message));
  }, [code, setCart]);
  if (error)
    return (
      <div className="narrow-page centered">
        <p className="eyebrow">ENLACE NO DISPONIBLE</p>
        <h1>
          Esta invitación
          <br />
          no está disponible.
        </h1>
        <p>{error}</p>
        <Link className="button primary" to="/catalogo">
          Seguir viendo cafés
        </Link>
      </div>
    );
  if (!invite) return <Loading />;
  return (
    <div className="narrow-page invite-page">
      <p className="eyebrow">UN REGALO DE {invite.inviter.toUpperCase()}</p>
      <h1>
        Tu primer café,
        <br />
        con <em>$8 de regalo.</em>
      </h1>
      <p className="lead">El beneficio ya está aplicado.</p>
      <div className="invite-visual">
        <BagArt kind="duo" />
      </div>
      <h2>Dos bolsas de 340 g</h2>
      <div className="price-line">
        <span>Precio regular</span>
        <strong>{money(34)}</strong>
      </div>
      <div className="price-line">
        <span>Regalo de {invite.inviter}</span>
        <strong>−{money(8)}</strong>
      </div>
      <div className="price-line total">
        <span>Tu total</span>
        <strong>{money(26)}</strong>
      </div>
      <p className="muted">
        Envío incluido · {invite.inviter} también recibe $8 cuando se confirme
        tu compra.
      </p>
      <Link className="button primary full" to="/catalogo/duo">
        Continuar con mi regalo <ArrowRight size={17} />
      </Link>
      <Link className="text-link centered-link" to="/condiciones">
        Recompensas y condiciones
      </Link>
      <p className="demo-caption">Demostración simulada</p>
      <span className="visually-hidden">{cart.inviteCode}</span>
    </div>
  );
}
