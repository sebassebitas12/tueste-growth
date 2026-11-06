import { useState } from "react";
import { ArrowRight, ArrowUpRight, Gift, Share2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { useAccount } from "../hooks/useAccount.js";
import { AccountNav, ReferralList } from "../components/AccountComponents.jsx";
import { ErrorState, Loading } from "../components/Feedback.jsx";
import { copyText, money } from "../utils/format.js";

export function Referrals() {
  const { user } = useShop();
  const { data, error } = useAccount(user);
  const [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false),
    [preview, setPreview] = useState(false);
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  const shareUrl = `${location.origin}/invitacion/${data.user.referral_code}`;
  const message = `Te comparto mi café favorito. Tenés $8 de regalo: ${shareUrl}`;
  async function copy(value) {
    const ok = await copyText(value);
    setCopied(ok);
    setCopyError(!ok);
  }
  return (
    <div className="account-layout section-wrap">
      <AccountNav />
      <section className="account-main">
        <p className="eyebrow">COMPARTÍ TUESTE</p>
        <h1>
          Compartí tu
          <br />
          <em>café favorito.</em>
        </h1>
        <p className="lead">
          Tu amistad recibe $8. Vos ganás $8 cuando su compra se confirma.
        </p>
        <p className="muted">
          Cuando recibás y probés tu café, compartí tu enlace personal.
        </p>
        <div className="share-actions">
          <button className="button primary" onClick={() => copy(shareUrl)}>
            <Share2 size={17} />
            {copied ? "Enlace copiado" : "Copiar mi enlace"}
          </button>
          <button className="button secondary" onClick={() => setPreview(true)}>
            Vista previa para WhatsApp <ArrowUpRight size={16} />
          </button>
        </div>
        {copyError && (
          <p className="error" role="alert">
            No se pudo copiar automáticamente. Seleccioná el enlace desde la
            vista previa.
          </p>
        )}
        <p className="muted small">
          El mensaje queda en esta pantalla y no se envía.
        </p>
        <section className="progress-panel">
          <p className="eyebrow">TU PRÓXIMO PREMIO</p>
          <h2>{data.confirmed_referrals} de 3 amistades compraron</h2>
          <div className="progress-track">
            <span
              style={{
                width: `${(Math.min(data.confirmed_referrals, 3) / 3) * 100}%`,
              }}
            />
          </div>
          <p className="muted">
            {Math.max(0, 3 - data.confirmed_referrals)} compra
            {3 - data.confirmed_referrals === 1 ? "" : "s"} confirmada
            {3 - data.confirmed_referrals === 1 ? "" : "s"} para desbloquearlo.
          </p>
          <p className="reward-note">
            <Gift size={22} /> Un accesorio para tu ritual
          </p>
        </section>
        <div className="credit-row">
          <span>Crédito disponible</span>
          <strong>{money(data.credit_available_cents / 100)}</strong>
        </div>
        <ReferralList rows={data.referrals} />
        <Link className="text-link" to="/condiciones">
          Recompensas y condiciones <ArrowRight size={16} />
        </Link>
        {preview && (
          <div className="modal-backdrop" onClick={() => setPreview(false)}>
            <section
              className="share-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="preview-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="modal-close"
                aria-label="Cerrar vista previa"
                onClick={() => setPreview(false)}
              >
                <X size={20} />
              </button>
              <p className="eyebrow">MENSAJE LISTO · NO SE ENVÍA</p>
              <h2 id="preview-title">Vista previa</h2>
              <textarea
                readOnly
                value={message}
                aria-label="Mensaje de invitación"
              />
              <button
                className="button primary full"
                onClick={() => copy(message)}
              >
                {copied ? "Mensaje copiado" : "Copiar mensaje"}
              </button>
              <p className="muted small">
                Podés pegarlo en el canal que elijás. Tu amistad verá el regalo
                ya aplicado.
              </p>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}
