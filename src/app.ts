import express from "express";
import type { Express } from "express";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import { RouterManager } from "./routes";

const app: Express = express();

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

const routerManager = new RouterManager();

app.use(routerManager.getRouter());
app.get("/healthz", (req, res) => {
  res.status(StatusCodes.OK).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default app;
