import { ArrowLeft, ArrowRight, Check, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { BagArt } from "../components/ProductVisuals.jsx";
import { Loading } from "../components/Feedback.jsx";
import { money } from "../utils/format.js";

export function Cart() {
  const { products, cart, setCart } = useShop();
  const item =
    products.find((p) => p.id === cart.productId) ||
    products.find((p) => p.id === "duo");
  if (!item) return <Loading />;
  const subtotal = item.price * cart.quantity,
    eligible = !cart.inviteCode || item.id === "duo",
    discount = cart.inviteCode && item.id === "duo" ? Math.min(8, subtotal) : 0;
  return (
    <div className="narrow-page">
      <Link className="back-link" to="/catalogo">
        <ArrowLeft size={16} /> Seguir viendo cafés
      </Link>
      <div className="page-heading compact">
        <p className="eyebrow">UN MOMENTO PARA ELEGIR</p>
        <h1>Tu carrito.</h1>
      </div>
      <div className="cart-item">
        <div className="cart-art">
          <BagArt kind={item.id === "pack" ? "pack" : "duo"} />
        </div>
        <div className="cart-item-info">
          <h2>{item.name}</h2>
          <p>{item.quantity}</p>
          <strong>{money(item.price)}</strong>
        </div>
        <div className="quantity-control">
          <button
            aria-label="Reducir cantidad"
            onClick={() =>
              setCart({ ...cart, quantity: Math.max(1, cart.quantity - 1) })
            }
          >
            <Minus size={15} />
          </button>
          <span>{cart.quantity}</span>
          <button
            aria-label="Aumentar cantidad"
            onClick={() =>
              setCart({ ...cart, quantity: Math.min(5, cart.quantity + 1) })
            }
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
      {cart.inviteCode && eligible && (
        <p className="gift-applied">
          <Check size={17} /> Regalo de{" "}
          {cart.inviteCode === "ana-demo" ? "Ana" : cart.inviteCode} aplicado
        </p>
      )}
      {cart.inviteCode && !eligible && (
        <p className="error" role="alert">
          El regalo aplica a la compra de dos bolsas.{" "}
          <Link className="text-link" to="/catalogo/duo">
            Elegir dos bolsas
          </Link>
        </p>
      )}
      <div className="totals">
        <div>
          <span>Productos</span>
          <strong>{money(subtotal)}</strong>
        </div>
        {discount > 0 && (
          <div>
            <span>Beneficio de invitación</span>
            <strong>−{money(discount)}</strong>
          </div>
        )}
        <div>
          <span>Envío</span>
          <strong>Incluido</strong>
        </div>
        <div className="total">
          <span>Total</span>
          <strong>{money(subtotal - discount)}</strong>
        </div>
      </div>
      {eligible ? (
        <Link className="button primary full" to="/checkout">
          Continuar con la compra <ArrowRight size={17} />
        </Link>
      ) : (
        <button className="button primary full" disabled>
          Beneficio no elegible
        </button>
      )}
      <p className="muted centered-text">
        Compra de demostración. Sin cobros reales.
      </p>
    </div>
  );
}
