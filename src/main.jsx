import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Coffee,
  Gift,
  Menu,
  Minus,
  Package,
  Plus,
  Share2,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import "@fontsource/bitter/latin-400.css";
import "@fontsource/bitter/latin-500.css";
import "@fontsource/bitter/latin-600.css";
import "@fontsource/bitter/latin-700.css";
import "@fontsource/bitter/latin-ext-400.css";
import "@fontsource/bitter/latin-ext-500.css";
import "@fontsource/bitter/latin-ext-600.css";
import "@fontsource/bitter/latin-ext-700.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/dm-sans/latin-ext-400.css";
import "@fontsource/dm-sans/latin-ext-500.css";
import "@fontsource/dm-sans/latin-ext-600.css";
import "@fontsource/dm-sans/latin-ext-700.css";
import "./styles.css";
import "./overrides.css";

const API = "/api";
const Ctx = createContext(null);
const useShop = () => useContext(Ctx);
const money = (value) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
const fetchJson = async (path, options) => {
  const response = await fetch(`${API}${path}`, options);
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "No pudimos completar la solicitud.");
  return data;
};
async function copyText(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
    const field = document.createElement("textarea");
    field.value = value;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  } catch {
    return false;
  }
}

function Provider({ children }) {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState("ana");
  const [cart, setCart] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("tueste-cart")) || {
          productId: "duo",
          quantity: 1,
          inviteCode: "",
        }
      );
    } catch {
      return { productId: "duo", quantity: 1, inviteCode: "" };
    }
  });
  const [notice, setNotice] = useState("");
  useEffect(() => {
    fetchJson("/products")
      .then(setProducts)
      .catch(() =>
        setNotice(
          "No se pudo conectar con la API. Iniciá el proyecto desde la raíz.",
        ),
      );
  }, []);
  useEffect(() => {
    localStorage.setItem("tueste-cart", JSON.stringify(cart));
  }, [cart]);
  const value = useMemo(
    () => ({ products, user, setUser, cart, setCart, notice, setNotice }),
    [products, user, cart, notice],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
function Logo() {
  return (
    <Link className="brand" to="/" aria-label="Tueste, inicio">
      <svg viewBox="0 0 42 38" aria-hidden="true">
        <path d="M6 10C10 2 23 1 29 5c6 4 3 11-2 16-5 5-12 8-18 5C2 23 2 17 6 10Z" />
        <path d="M19 17c5-7 12-10 17-7 5 4 3 11-2 17-5 7-13 10-18 7-5-3-3-11 3-17Z" />
      </svg>
      <span>tueste</span>
    </Link>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const { cart } = useShop();
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  return (
    <header className="topbar">
      <Logo />
      <nav
        className={open ? "main-nav open" : "main-nav"}
        aria-label="Principal"
      >
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/catalogo">Cafés</NavLink>
        <NavLink to="/cuenta/referidos">Compartí Tueste</NavLink>
      </nav>
      <div className="head-actions">
        <Link className="icon-button" to="/cuenta" aria-label="Mi cuenta">
          <UserRound size={21} />
        </Link>
        <Link
          className="icon-button bag-link"
          to="/carrito"
          aria-label={`Carrito, ${cart.quantity} productos`}
        >
          <ShoppingBag size={21} />
          <span>{cart.quantity}</span>
        </Link>
        <button
          className="icon-button menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={21} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
function Shell({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Logo />
        <p>Café de especialidad, directo a tu casa.</p>
      </div>
      <nav aria-label="Enlaces del pie">
        <Link to="/catalogo">Cafés</Link>
        <Link to="/condiciones">Condiciones</Link>
        <Link to="/panel-diego">Panel de demostración</Link>
      </nav>
      <small>
        Prototipo académico · Compras, pedidos y actividad simulados
      </small>
    </footer>
  );
}
function DemoBar() {
  const { user, setUser } = useShop();
  return (
    <aside className="demo-bar">
      <span>
        <span className="demo-mark" />
        Acceso de demostración
      </span>
      <label htmlFor="demo-user">Vista</label>
      <select
        id="demo-user"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      >
        <option value="ana">Ana · cliente</option>
        <option value="diego">Diego · panel</option>
      </select>
      <Link to={user === "diego" ? "/panel-diego" : "/cuenta"}>
        Abrir <ArrowRight size={14} />
      </Link>
    </aside>
  );
}
function ShellWithDemo({ children }) {
  const { notice } = useShop();
  return (
    <>
      <DemoBar />
      {notice && (
        <div className="global-notice" role="alert">
          {notice}
        </div>
      )}
      <Shell>{children}</Shell>
    </>
  );
}
function CoffeePhoto({ className = "" }) {
  return (
    <div
      className={`coffee-photo ${className}`}
      role="img"
      aria-label="Fotografía conceptual de café Tueste"
    >
      <img src="/docs/diseno/tueste-inicio-desktop-movil-v1.png" alt="" />
    </div>
  );
}
function BagArt({ kind = "duo" }) {
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
function Home() {
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
function ProductGrid({ items }) {
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
function Catalog() {
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
function Product() {
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
function Invitation() {
  const { code } = useParams();
  const { setCart, cart } = useShop();
  const [invite, setInvite] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    fetchJson(`/referrals/${encodeURIComponent(code)}`)
      .then((data) => {
        setInvite(data);
        setCart((c) => ({ ...c, inviteCode: code }));
      })
      .catch((e) => setError(e.message));
  }, [code, setCart]);
  if (error)
    return (
      <div className="narrow-page centered">
        <p className="eyebrow">ENLACE NO DISPONIBLE</p>
        <h1>
          Esta invitación
          <br />
          no está disponible.
        </h1>
        <p>{error}</p>
        <Link className="button primary" to="/catalogo">
          Seguir viendo cafés
        </Link>
      </div>
    );
  if (!invite) return <Loading />;
  return (
    <div className="narrow-page invite-page">
      <p className="eyebrow">UN REGALO DE {invite.inviter.toUpperCase()}</p>
      <h1>
        Tu primer café,
        <br />
        con <em>$8 de regalo.</em>
      </h1>
      <p className="lead">El beneficio ya está aplicado.</p>
      <div className="invite-visual">
        <BagArt kind="duo" />
      </div>
      <h2>Dos bolsas de 340 g</h2>
      <div className="price-line">
        <span>Precio regular</span>
        <strong>{money(34)}</strong>
      </div>
      <div className="price-line">
        <span>Regalo de {invite.inviter}</span>
        <strong>−{money(8)}</strong>
      </div>
      <div className="price-line total">
        <span>Tu total</span>
        <strong>{money(26)}</strong>
      </div>
      <p className="muted">
        Envío incluido · {invite.inviter} también recibe $8 cuando se confirme
        tu compra.
      </p>
      <Link className="button primary full" to="/catalogo/duo">
        Continuar con mi regalo <ArrowRight size={17} />
      </Link>
      <Link className="text-link centered-link" to="/condiciones">
        Recompensas y condiciones
      </Link>
      <p className="demo-caption">Demostración simulada</p>
      <span className="visually-hidden">{cart.inviteCode}</span>
    </div>
  );
}
function Cart() {
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
function Checkout() {
  const { products, cart, user } = useShop();
  const { data: account } = useAccount(user);
  const product =
    products.find((p) => p.id === cart.productId) ||
    products.find((p) => p.id === "duo");
  const [form, setForm] = useState({ name: "", email: "" });
  const [useCredit, setUseCredit] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const navigate = useNavigate();
  if (!product) return <Loading />;
  const creditCents = useCredit
    ? Math.min(800, account?.credit_available_cents || 0)
    : 0;
  const discount = cart.inviteCode
    ? Math.min(800, product.price * cart.quantity)
    : creditCents;
  const total = product.price * cart.quantity - discount;
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await fetchJson("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: cart.quantity,
          inviteCode: cart.inviteCode || null,
          useCreditCents: creditCents,
          customerName: form.name,
          customerEmail: form.email,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      navigate(`/confirmacion/${data.order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="narrow-page">
      <p className="eyebrow">COMPRA SIMULADA · SIN PAGOS</p>
      <h1>
        Finalizá tu
        <br />
        <em>pedido.</em>
      </h1>
      <p className="lead">
        No ingresés datos bancarios. Esta compra se registra como demostración.
      </p>
      <form className="checkout-form" onSubmit={submit}>
        <label>
          Nombre
          <input
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Tu nombre"
          />
        </label>
        <label>
          Correo
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="nombre@correo.com"
          />
        </label>
        {!cart.inviteCode &&
          product.id === "duo" &&
          account?.credit_available_cents > 0 && (
            <label className="credit-choice">
              <input
                type="checkbox"
                checked={useCredit}
                onChange={(e) => {
                  setUseCredit(e.target.checked);
                  if (e.target.checked)
                    setForm({
                      name: account.user.name,
                      email: account.user.email,
                    });
                }}
              />
              <span>
                Usar hasta{" "}
                {money(Math.min(8, account.credit_available_cents / 100))} de
                crédito de {account.user.name}
              </span>
            </label>
          )}
        {useCredit && (
          <p className="muted small">
            El correo debe coincidir con la cuenta de demostración seleccionada.
            Este prototipo reserva el crédito mientras confirmás el pedido.
          </p>
        )}
        <div className="checkout-total">
          <span>Total simulado</span>
          <strong>{money(total)}</strong>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="button primary full" disabled={busy}>
          {busy ? "Registrando…" : `Confirmar pedido · ${money(total)}`}{" "}
          <ArrowRight size={17} />
        </button>
      </form>
      <p className="muted centered-text">
        Pago, envío y notificaciones no se realizan.
      </p>
    </div>
  );
}
function Confirmation() {
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
function useAccount(userId) {
  const [data, setData] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetchJson(`/account/${userId}`)
      .then((d) => active && setData(d))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [userId]);
  return { data, error };
}
function Account() {
  const { user } = useShop();
  const { data, error } = useAccount(user);
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  const referrals = data.confirmed_referrals;
  return (
    <div className="account-layout section-wrap">
      <AccountNav />
      <section className="account-main">
        <p className="eyebrow">MI CUENTA · DEMOSTRACIÓN</p>
        <h1>Hola, {data.user.name}.</h1>
        <p className="lead">Tu café y lo que compartís, en un solo lugar.</p>
        <div className="account-stats">
          <div>
            <span>Crédito disponible</span>
            <strong>{money(data.credit_available_cents / 100)}</strong>
          </div>
          <div>
            <span>Amistades que compraron</span>
            <strong>{referrals}</strong>
          </div>
        </div>
        <section className="progress-panel">
          <div>
            <p className="eyebrow">TU PRÓXIMO PREMIO</p>
            <h2>
              {referrals >= 3
                ? "Tu accesorio está disponible."
                : `Un accesorio para tu ritual`}
            </h2>
          </div>
          <p>{Math.min(referrals, 3)} de 3 amistades compraron</p>
          <div className="progress-track">
            <span style={{ width: `${(Math.min(referrals, 3) / 3) * 100}%` }} />
          </div>
          <p className="muted">
            {referrals >= 3
              ? "Premio listo para tu próximo pedido."
              : "Te falta una compra confirmada."}
          </p>
          <p className="reward-note">
            <Gift size={23} /> Accesorio conceptual · costo supuesto de $24
          </p>
        </section>
        <h2 className="subhead">Compras de tus amistades</h2>
        <ReferralList rows={data.referrals} />
        <div className="account-links">
          <Link to="/cuenta/pedidos">
            Ver pedidos <ArrowRight size={15} />
          </Link>
          <Link to="/cuenta/actividad">
            Ver actividad <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
function AccountNav() {
  return (
    <aside className="account-nav">
      <p className="eyebrow">TU CUENTA</p>
      <NavLink end to="/cuenta">
        Resumen
      </NavLink>
      <NavLink to="/cuenta/pedidos">Pedidos</NavLink>
      <NavLink to="/cuenta/referidos">Mis referidos</NavLink>
      <NavLink to="/cuenta/recompensas">Recompensas</NavLink>
      <NavLink to="/cuenta/actividad">Actividad</NavLink>
    </aside>
  );
}
function ReferralList({ rows }) {
  return rows.length ? (
    <ul className="referral-list">
      {rows.map((row) => (
        <li key={row.id}>
          <span className="status-check">
            <Check size={15} />
          </span>
          <div>
            <strong>{row.invitee_name || "Amistad invitada"}</strong>
            <small>
              {row.order_id ? "Compra confirmada" : "Invitación enviada"}
            </small>
          </div>
          <strong className="credit-plus">
            {row.order_id ? "+ $8" : "Pendiente"}
          </strong>
        </li>
      ))}
    </ul>
  ) : (
    <EmptyState
      title="Todavía no hay actividad"
      text="Compartí tu enlace y vas a ver cada invitación acá."
    />
  );
}
function Referrals() {
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
function Orders() {
  const { user } = useShop();
  const { data, error } = useAccount(user);
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  return (
    <div className="account-layout section-wrap">
      <AccountNav />
      <section className="account-main">
        <p className="eyebrow">MI CUENTA</p>
        <h1>Mis pedidos.</h1>
        {data.orders.length ? (
          <ul className="order-list">
            {data.orders.map((o) => (
              <li key={o.id}>
                <div>
                  <strong>
                    {o.id.startsWith("demo-")
                      ? "Pedido de ejemplo"
                      : `Pedido ${o.id.slice(0, 8)}`}
                  </strong>
                  <small>
                    {new Date(o.created_at + "Z").toLocaleDateString("es-CR")} ·{" "}
                    {o.status === "confirmed"
                      ? "Confirmado"
                      : o.status === "pending"
                        ? "Pendiente"
                        : o.status === "returned"
                          ? "Devuelto"
                          : "Cancelado"}
                  </small>
                </div>
                <strong>{money(o.total_cents / 100)}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Todavía no hay pedidos"
            text="Cuando hagás una compra de demostración, aparecerá acá."
          />
        )}
      </section>
    </div>
  );
}
function Rewards() {
  const { user } = useShop();
  const { data, error } = useAccount(user);
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  return (
    <div className="account-layout section-wrap">
      <AccountNav />
      <section className="account-main">
        <p className="eyebrow">MI CUENTA</p>
        <h1>Recompensas.</h1>
        <div className="reward-large">
          <Gift size={30} />
          <div>
            <h2>Un accesorio para tu ritual</h2>
            <p>
              {data.reward?.status === "available"
                ? "Disponible para tu próximo pedido"
                : `Propuesta de premio · avance ${Math.min(data.confirmed_referrals, 3)} de 3`}
            </p>
          </div>
        </div>
        <h2 className="subhead">Créditos de invitación</h2>
        <div className="credit-row">
          <span>Disponibles</span>
          <strong>{money(data.credit_available_cents / 100)}</strong>
        </div>
        <div className="credit-row">
          <span>Canjeados</span>
          <strong>{money(data.credit_redeemed_cents / 100)}</strong>
        </div>
        <Link to="/condiciones" className="text-link">
          Ver condiciones completas <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
function Activity() {
  const { user } = useShop();
  const [rows, setRows] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    fetchJson(`/activity/${user}`)
      .then(setRows)
      .catch((e) => setError(e.message));
  }, [user]);
  return (
    <div className="account-layout section-wrap">
      <AccountNav />
      <section className="account-main">
        <p className="eyebrow">MI CUENTA</p>
        <h1>Tu actividad.</h1>
        {error ? (
          <ErrorState message={error} />
        ) : !rows ? (
          <Loading />
        ) : rows.length ? (
          <ul className="order-list">
            {rows.map((row) => (
              <li key={row.id}>
                <div>
                  <strong>{row.invitee_name || "Invitación enviada"}</strong>
                  <small>
                    {row.order_id
                      ? `Compra ${row.order_status === "confirmed" ? "confirmada" : row.order_status}`
                      : row.status === "pending"
                        ? "Compra pendiente"
                        : "Invitación"}
                  </small>
                </div>
                <span className={`activity-state ${row.status}`}>
                  {row.status === "confirmed"
                    ? "Confirmado"
                    : row.status === "pending"
                      ? "Pendiente"
                      : row.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Tu actividad empieza con una invitación"
            text="Compartí el enlace personal para ver avances acá."
          />
        )}
      </section>
    </div>
  );
}
function Conditions() {
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
function FunnelRows({ items }) {
  return items.map((step) => {
    const ratio = step.value / step.denominator;
    const percent = Math.round(ratio * 1000) / 10;
    const ratioText =
      step.step_key === "sent"
        ? `${ratio.toFixed(1).replace(".", ",")} invitaciones por persona que invita`
        : `${step.value} de ${step.denominator} · ${percent.toLocaleString("es-CR")}%`;
    return (
      <div className="funnel-row" key={step.step_key}>
        <span>
          {step.label}
          <small>{ratioText}</small>
        </span>
        <div>
          <i style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>
        <strong>{step.value.toLocaleString("es-CR")}</strong>
      </div>
    );
  });
}
function EconomicsRows({ items }) {
  return items.map((item) => (
    <div key={item.metric_key}>
      <span>{item.label}</span>
      <strong>{item.display_value}</strong>
      <small>{item.detail}</small>
    </div>
  ));
}
function Admin() {
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
function Loading() {
  return (
    <div className="loading" role="status">
      Cargando…
    </div>
  );
}
function ErrorState({ message }) {
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
function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <Coffee size={22} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
function NotFound() {
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
function Router() {
  return (
    <Provider>
      <ShellWithDemo>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/catalogo/:id" element={<Product />} />
          <Route path="/invitacion/:code" element={<Invitation />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmacion/:id" element={<Confirmation />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="/cuenta/pedidos" element={<Orders />} />
          <Route path="/cuenta/referidos" element={<Referrals />} />
          <Route path="/cuenta/recompensas" element={<Rewards />} />
          <Route path="/cuenta/actividad" element={<Activity />} />
          <Route path="/condiciones" element={<Conditions />} />
          <Route path="/panel-diego" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ShellWithDemo>
    </Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </React.StrictMode>,
);
