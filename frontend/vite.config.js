import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    fs: { allow: [repoRoot] },
    proxy: { "/api": process.env.VITE_API_PROXY || "http://localhost:3001" },
  },
});
