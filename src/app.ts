import express from "express";
import type { Express } from "express";
import userRouter from "./routes/user.route.js";

const app: Express = express();

app.use(express.json());
app.use("/user", userRouter);

export default app;
