import express from "express";
import type { Express } from "express";
import authRouter from "./routes/auth.route.js";

const app: Express = express();

app.use(express.json());
app.use("/auth", authRouter);

export default app;
