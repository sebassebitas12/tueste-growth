import { Coffee } from "lucide-react";
import { Link } from "react-router-dom";
export function Loading() {
  return (
    <div className="loading" role="status">
      Cargando…
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="narrow-page centered">
      <p className="eyebrow">ALGO NO SALIÓ</p>
      <h1>Volvamos a intentarlo.</h1>
      <p>{message}</p>
      <button className="button secondary" onClick={() => location.reload()}>
        Reintentar
      </button>
    </div>
  );
}

export function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <Coffee size={22} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="narrow-page centered">
      <p className="eyebrow">NO ENCONTRAMOS ESA PÁGINA</p>
      <h1>Sigamos buscando.</h1>
      <Link className="button primary" to="/catalogo">
        Ver cafés
      </Link>
    </div>
  );
}
