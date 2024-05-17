import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "10000kb" }));
app.use(express.static("Z:/oneLogin"));
app.use(cookieParser());


// Routes for Application
import { companyRouter } from "./routes/company.route.js";
import { userRouter } from "./routes/user.route.js";

app.use("/api/v1/company", companyRouter);
app.use("/api/v1/user", userRouter);


export { app };