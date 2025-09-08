import express from "express";
import type { Express } from "express";
import authRouter from "./routes/auth.route.js";
import { sendEmail } from "./services/email.service.js";

const app: Express = express();

app.use("/auth", authRouter);

export default app;
