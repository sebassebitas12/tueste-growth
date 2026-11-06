import { createApp } from "./app.js";

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || "0.0.0.0";
const server = createApp().listen(port, host, () => {
  console.log(`Tueste API lista en http://localhost:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
