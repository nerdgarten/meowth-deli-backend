import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";

import { RouterManager } from "./routes";
import type { Express } from "express";

const allowedOrigins = [
  "http://localhost:3000",
  "https://meowth.borworntat.com"
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if(!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
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
