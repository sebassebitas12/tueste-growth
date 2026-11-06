import { Router } from "express";
import { apiController } from "../controllers/apiController.js";

const router = Router();
router.get("/health", apiController.health);
router.get("/products", apiController.products);
router.get("/demo", apiController.demo);
router.get("/referrals/:code", apiController.invitation);
router.get("/account/:userId", apiController.account);
router.get("/admin/metrics", apiController.metrics);
router.get("/activity/:userId", apiController.activity);
router.post("/orders", apiController.createOrder);
router.patch("/orders/:id/status", apiController.updateOrderStatus);

export default router;
