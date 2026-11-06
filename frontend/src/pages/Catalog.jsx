import { useShop } from "../context/ShopContext.jsx";
import { ProductGrid } from "../components/ProductVisuals.jsx";
import { Loading } from "../components/Feedback.jsx";

export function Catalog() {
  const { products } = useShop();
  return (
    <div className="page section-wrap">
      <div className="page-heading">
        <p className="eyebrow">CAFÉS TUESTE</p>
        <h1>
          Elegí lo que va
          <br />
          con tu <em>ritual.</em>
        </h1>
        <p>
          Una selección sencilla para tomar en casa, compartir o recibir cada
          mes.
        </p>
      </div>
      {products.length ? <ProductGrid items={products} /> : <Loading />}
      <p className="concept-note">
        Imágenes y empaques conceptuales · Caso académico
      </p>
    </div>
  );
}
