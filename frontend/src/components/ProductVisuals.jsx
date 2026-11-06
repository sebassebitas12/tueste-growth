import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { coffeePhoto } from "../utils/assets.js";
import { money } from "../utils/format.js";
export function CoffeePhoto({ className = "" }) {
  return (
    <div
      className={`coffee-photo ${className}`}
      role="img"
      aria-label="Fotografía conceptual de café Tueste"
    >
      <img src={coffeePhoto} alt="" />
    </div>
  );
}

export function BagArt({ kind = "duo" }) {
  return (
    <div className={`bag-art ${kind}`} aria-hidden="true">
      <i className="bag bag-one">
        <b>tueste</b>
        <span />
      </i>
      <i className="bag bag-two">
        <b>tueste</b>
        <span />
      </i>
      {kind === "pack" && (
        <i className="bag bag-three">
          <b>tueste</b>
          <span />
        </i>
      )}
      <i className="cup" />
    </div>
  );
}

export function ProductGrid({ items }) {
  return (
    <div className="product-grid">
      {items.map((item, i) => (
        <Link
          className="product-tile"
          to={`/catalogo/${item.id}`}
          key={item.id}
        >
          <div className={`product-visual visual-${i}`}>
            <BagArt kind={item.id === "pack" ? "pack" : "duo"} />
          </div>
          <div className="product-info">
            <p className="eyebrow">{item.quantity}</p>
            <h3>{item.name}</h3>
            <div>
              <strong>{money(item.price)}</strong>
              <span>
                Ver café <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
