import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Conditions() {
  return (
    <div className="page section-wrap conditions">
      <p className="eyebrow">TUESTE · PROPUESTA ACADÉMICA</p>
      <h1>
        Reglas claras,
        <br />
        <em>buen café.</em>
      </h1>
      <p className="lead">
        Condiciones del prototipo y datos del caso, separados de las hipótesis
        del equipo.
      </p>
      <div className="condition-section">
        <h2>Beneficios de invitación</h2>
        <ul>
          <li>
            La amistad recibe $8 de descuento en su primera compra de dos bolsas
            ($34); en la demo, el total queda en $26 con envío incluido.
          </li>
          <li>
            Quien invita recibe $8 de crédito cuando la compra válida se
            confirma. Puede acumularlo y canjear hasta $8 en un pedido de dos
            bolsas.
          </li>
          <li>
            La demo no combina el descuento de invitación y el crédito en una
            misma compra. El crédito se reserva mientras el pedido está
            pendiente y se confirma al confirmar la compra.
          </li>
          <li>
            Se excluyen autorreferidos, correos duplicados y compras canceladas.
            Los estados pendientes no generan premios.
          </li>
        </ul>
      </div>
      <div className="condition-section">
        <h2>Premio propuesto</h2>
        <p>
          Al confirmarse tres amistades compradoras, se desbloquea un accesorio
          único para el próximo pedido regular. Su costo completo de $24 es un
          supuesto pendiente de cotización, no un costo observado.
        </p>
      </div>
      <div className="condition-section">
        <h2>Simulación y límites</h2>
        <p>
          Pagos, envíos, clientes, compras y notificaciones son simulados. No
          hay cobros ni mensajes enviados. No ingresés información bancaria.
        </p>
        <p>
          En esta demo, cancelar o devolver un pedido restaura el crédito
          canjeado. Si ya se gastó el crédito ganado por un referido y devolver
          ese pedido dejaría el saldo negativo, la devolución no se procesa en
          el prototipo. Es una regla operativa de demo; la política comercial
          real ante devoluciones sigue pendiente. También están pendientes el
          plazo de validación y la elegibilidad fuera de estas pantallas.
        </p>
      </div>
      <Link className="text-link" to="/cuenta/referidos">
        Volver a mis referidos <ArrowRight size={16} />
      </Link>
    </div>
  );
}
