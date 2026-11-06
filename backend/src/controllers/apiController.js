import { createOrder, updateOrderStatus } from "../services/orderService.js";
import {
  getAccount,
  getActivity,
  getInvitation,
  getMetrics,
  listDemoUsers,
  listProducts,
} from "../services/shopService.js";

function sendError(res, error) {
  return res.status(error.status || 500).json({
    error: error.status
      ? error.message
      : "Ocurrió un error interno. Intentá de nuevo.",
  });
}

export const apiController = {
  health(_req, res) {
    res.json({ ok: true, storage: "sqlite" });
  },
  products(_req, res) {
    res.json(listProducts());
  },
  demo(_req, res) {
    res.json(listDemoUsers());
  },
  invitation(req, res) {
    try {
      res.json(getInvitation(req.params.code));
    } catch (error) {
      sendError(res, error);
    }
  },
  account(req, res) {
    try {
      res.json(getAccount(req.params.userId));
    } catch (error) {
      sendError(res, error);
    }
  },
  metrics(_req, res) {
    res.json(getMetrics());
  },
  activity(req, res) {
    res.json(getActivity(req.params.userId));
  },
  createOrder(req, res) {
    try {
      const result = createOrder(req.body);
      res.status(result.replayed ? 200 : 201).json({
        ...result,
        message: result.replayed
          ? undefined
          : "Pedido de demostración pendiente de confirmar.",
      });
    } catch (error) {
      sendError(res, error);
    }
  },
  updateOrderStatus(req, res) {
    try {
      const result = updateOrderStatus(req.params.id, req.body?.status);
      res.json(result);
    } catch (error) {
      sendError(res, error);
    }
  },
  notFound(_req, res) {
    res.status(404).json({ error: "No encontramos esa ruta de API." });
  },
  error(error, _req, res, _next) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error interno. Intentá de nuevo." });
  },
};
