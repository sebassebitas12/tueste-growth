import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchJson } from "../services/api.js";
const Ctx = createContext(null);
export const useShop = () => useContext(Ctx);
export function Provider({ children }) {
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
