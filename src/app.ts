import express from "express";
import type { Express } from "express";
import authRouter from "./routes/auth.route.js";
import { sendEmail } from "./services/email.service.js";

const app: Express = express();


app.get('/test', (req, res) => {
    sendEmail("6632041821@student.chula.ac.th", "Hello", "HelloWorld")
    res.send('Hello World!');
});
app.use("/auth", authRouter);

export default app;
