import express from "express";
import apiRoutes from "./routes/apiRoutes.js";
import { apiController } from "./controllers/apiController.js";

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "32kb" }));
  app.use("/api", apiRoutes);
  app.use("/api", apiController.notFound);
  app.use(apiController.error);
  return app;
}
