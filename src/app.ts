import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";

import { RouterManager } from "./routes";
import type { Express } from "express";

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean | string) => void,
  ) => {
    const borworntatRegex = /^https:\/\/([a-zA-Z0-9-]+\.)*borworntat\.com$/;
    if (
      !origin ||
      origin.startsWith("http://localhost") ||
      borworntatRegex.test(origin)
    ) {
      callback(null, origin || "*");
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
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
