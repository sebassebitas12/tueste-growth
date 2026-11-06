import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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
import App from "./app/App.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
