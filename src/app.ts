import express from "express";
import type { Express } from "express";
import authRouter from "./routes/auth.route";
import { StatusCodes } from "http-status-codes";

const app: Express = express();

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use(express.json());
app.get("/healthz", (req, res) => {
  res.status(StatusCodes.OK).send("OK");
});
app.use("/auth", authRouter);

export default app;
