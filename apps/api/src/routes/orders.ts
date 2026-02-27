import { Router } from "express";

export const ordersRouter = Router();

ordersRouter.post("/import", (_req, res) => {
  res.status(501).json({
    message: "POST /orders/import is not implemented yet"
  });
});

ordersRouter.post("/", (_req, res) => {
  res.status(501).json({
    message: "POST /orders is not implemented yet"
  });
});

ordersRouter.get("/", (_req, res) => {
  res.status(501).json({
    message: "GET /orders is not implemented yet"
  });
});
