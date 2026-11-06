import { useEffect, useState } from "react";
import { ArrowRight, Package } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "../services/api.js";

export function Confirmation() {
  const { id } = useParams();
  const [status, setStatus] = useState("loading"),
    [err, setErr] = useState("");
  const [order, setOrder] = useState(null);
  async function resolve(next) {
    setStatus("working");
    setErr("");
    try {
      const data = await fetchJson(`/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      setOrder(data.order);
      setStatus(next);
    } catch (e) {
      setErr(e.message);
      setStatus("pending");
    }
  }
  useEffect(() => {
    if (status === "loading") setStatus("pending");
  }, [status]);
  return (
    <div className="narrow-page confirmation">
      <div className="confirm-icon">
        <Package size={27} />
      </div>
      <p className="eyebrow">PEDIDO DE DEMOSTRACIÓN</p>
      <h1>
        {status === "confirmed"
          ? "Tu compra quedó confirmada."
          : status === "cancelled"
            ? "Pedido cancelado."
            : status === "returned"
              ? "Devolución registrada."
              : "Tu pedido está pendiente."}
      </h1>
      <p className="muted">
        Referencia {id.slice(0, 8)} · Esta compra es simulada.
      </p>
      {order && (
        <p>
          Estado: <strong>{order.status}</strong>
        </p>
      )}
      {status === "pending" || status === "working" ? (
        <div className="decision-actions">
          <button
            className="button primary full"
            disabled={status === "working"}
            onClick={() => resolve("confirmed")}
          >
            Simular compra confirmada
          </button>
          <button
            className="button secondary full"
            disabled={status === "working"}
            onClick={() => resolve("cancelled")}
          >
            Simular cancelación
          </button>
        </div>
      ) : (
        <div className="decision-actions">
          <Link className="button primary full" to="/cuenta">
            Ver mi cuenta
          </Link>
          {status === "confirmed" && (
            <button
              className="button secondary full"
              onClick={() => resolve("returned")}
            >
              Simular devolución
            </button>
          )}
        </div>
      )}
      {err && (
        <p className="error" role="alert">
          {err}
        </p>
      )}
      <Link className="text-link centered-link" to="/cuenta/referidos">
        Revisar progreso de referidos <ArrowRight size={16} />
      </Link>
    </div>
  );
}
