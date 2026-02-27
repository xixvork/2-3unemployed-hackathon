import express from "express";
import { ordersRouter } from "./routes/orders";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/orders", ordersRouter);

  return app;
};
