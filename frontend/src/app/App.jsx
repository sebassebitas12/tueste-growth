import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "../context/ShopContext.jsx";
import { ShellWithDemo } from "../components/SiteChrome.jsx";
import { Home } from "../pages/Home.jsx";
import { Catalog } from "../pages/Catalog.jsx";
import { Product } from "../pages/Product.jsx";
import { Invitation } from "../pages/Invitation.jsx";
import { Cart } from "../pages/Cart.jsx";
import { Checkout } from "../pages/Checkout.jsx";
import { Confirmation } from "../pages/Confirmation.jsx";
import { Account } from "../pages/Account.jsx";
import { Referrals } from "../pages/Referrals.jsx";
import { Orders } from "../pages/Orders.jsx";
import { Rewards } from "../pages/Rewards.jsx";
import { Activity } from "../pages/Activity.jsx";
import { Conditions } from "../pages/Conditions.jsx";
import { Admin } from "../pages/Admin.jsx";
import { NotFound } from "../components/Feedback.jsx";
export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
