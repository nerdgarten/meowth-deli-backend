import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";

import { RouterManager } from "@/routes";

import type { Express } from "express";

const corsOptions = {
  origin: "*",
  methods: "*",
  allowedHeaders: "*",
  credentials: true,
};

const app: Express = express();

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

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
