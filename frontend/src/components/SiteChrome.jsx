import { useEffect, useState } from "react";
import { ArrowRight, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
export function Logo() {
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

export function Header() {
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

export function Shell({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export function Footer() {
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

export function DemoBar() {
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

export function ShellWithDemo({ children }) {
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
