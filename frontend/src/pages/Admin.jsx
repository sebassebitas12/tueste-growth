import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchJson } from "../services/api.js";
import { EconomicsRows, FunnelRows } from "../components/AdminCharts.jsx";
import { ErrorState, Loading } from "../components/Feedback.jsx";
import { money } from "../utils/format.js";

export function Admin() {
  const [metrics, setMetrics] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    fetchJson("/admin/metrics")
      .then(setMetrics)
      .catch((e) => setError(e.message));
  }, []);
  if (error) return <ErrorState message={error} />;
  if (!metrics) return <Loading />;
  const purchaseMetric = metrics.funnel.find(
    (step) => step.step_key === "purchases",
  );
  const visitMetric = metrics.funnel.find(
    (step) => step.step_key === "program",
  );
  const initialMetric = metrics.funnel.find(
    (step) => step.step_key === "initial",
  );
  return (
    <div className="admin-page section-wrap">
      <p className="eyebrow">PANEL DE DIEGO · DEMOSTRACIÓN</p>
      <h1>
        Lo que mueve
        <br />
        el <em>crecimiento.</em>
      </h1>
      <p className="lead">
        Datos del caso y actividad local de esta demo, mostrados por separado.
      </p>
      <div className="admin-stats">
        <div>
          <span>Compras referidas (caso)</span>
          <strong>{purchaseMetric?.value ?? 0}</strong>
          <small>
            {purchaseMetric?.value ?? 0} de {purchaseMetric?.denominator ?? 0}{" "}
            visitas a tienda
          </small>
        </div>
        <div>
          <span>Programa visto (caso)</span>
          <strong>
            {Math.round(
              ((visitMetric?.value ?? 0) / (initialMetric?.value ?? 1)) * 100,
            )}
            %
          </strong>
          <small>
            {visitMetric?.value ?? 0} de {initialMetric?.value ?? 0} clientes
            iniciales
          </small>
        </div>
        <div>
          <span>Pedidos registrados en demo</span>
          <strong>{metrics.orders.reduce((n, o) => n + o.n, 0)}</strong>
          <small>datos locales, incluye semillas</small>
        </div>
        <div>
          <span>Crédito disponible (demo)</span>
          <strong>{money(metrics.credit_liability_cents / 100)}</strong>
          <small>saldo a canjear en la base local</small>
        </div>
      </div>
      <section className="funnel">
        <h2>Embudo histórico del caso</h2>
        <p className="muted">
          Cada paso muestra su numerador y denominador. Fuente: Parte 2, página
          3.
        </p>
        <FunnelRows items={metrics.funnel} />
      </section>
      <section className="economics">
        <h2>Economía y plan</h2>
        <div className="economics-grid">
          <EconomicsRows items={metrics.economics} />
        </div>
      </section>
      <p className="concept-note">
        12% → 24% es una meta de planificación, no un resultado observado. Día 1
        vs día 6 es una hipótesis de experimento.
      </p>
      <Link className="text-link" to="/FICHA_GROWTH.html">
        Ficha de Growth <ArrowUpRight size={15} />
      </Link>
    </div>
  );
}
