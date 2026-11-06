import { ArrowRight, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { CoffeePhoto, ProductGrid } from "../components/ProductVisuals.jsx";
import { money } from "../utils/format.js";

export function Home() {
  const { products } = useShop();
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">CAFÉ DE ESPECIALIDAD · COSTA RICA</p>
          <h1>
            Buen café.
            <br />
            Mejor <em>compartido.</em>
          </h1>
          <p className="lead">Café de especialidad, directo a tu casa.</p>
          <Link className="button primary" to="/catalogo">
            Explorar cafés <ArrowRight size={17} />
          </Link>
        </div>
        <CoffeePhoto className="hero-image" />
      </section>
      <section className="selection section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PARA TU PRÓXIMA TAZA</p>
            <h2>Elegí tu próxima taza</h2>
          </div>
          <Link className="text-link" to="/catalogo">
            Ver todos los cafés <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid items={products.slice(0, 3)} />
      </section>
      <section className="share-banner">
        <Coffee size={22} />
        <h3>Compartí Tueste con una amistad.</h3>
        <p>Tu amistad recibe $8. Vos ganás $8 cuando su compra se confirma.</p>
        <Link to="/cuenta/referidos" aria-label="Conocé el programa">
          <ArrowRight />
        </Link>
      </section>
    </>
  );
}
