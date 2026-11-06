import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { BagArt } from "../components/ProductVisuals.jsx";
import { Loading, NotFound } from "../components/Feedback.jsx";
import { money } from "../utils/format.js";

export function Product() {
  const { id } = useParams();
  const { products, setCart, cart } = useShop();
  const navigate = useNavigate();
  const p = products.find((x) => x.id === id);
  if (!p) return products.length ? <NotFound /> : <Loading />;
  return (
    <div className="product-detail section-wrap">
      <Link className="back-link" to="/catalogo">
        <ArrowLeft size={16} /> Volver a cafés
      </Link>
      <div className="product-detail-grid">
        <div className="detail-art">
          <BagArt kind={p.id === "pack" ? "pack" : "duo"} />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">CAFÉ DE ESPECIALIDAD · {p.quantity}</p>
          <h1>{p.name}</h1>
          <p className="lead">{p.description}</p>
          <div className="detail-price">
            {money(p.price)}
            {p.id === "subscription" && <small> / mes</small>}
          </div>
          <p className="muted">Envío incluido en esta demostración.</p>
          <button
            className="button primary full"
            onClick={() => {
              setCart({ ...cart, productId: p.id, quantity: 1 });
              navigate("/carrito");
            }}
          >
            Agregar al carrito <ShoppingBag size={17} />
          </button>
          <Link className="text-link" to="/condiciones">
            Conocé las condiciones <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
