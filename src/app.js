import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

import path from "path"; // Import the 'path' module

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "10000kb" }));
app.use(express.static("Z:/oneLogin"));
app.use(cookieParser());

import { upload } from "./middleware/multer.middleware.js";

app.post('/upload', upload.fields([
  { name: 'image', maxCount: 1 }
]), (req, res) => {
  const imagePath = req?.files?.image[0]?.path;
  const imageUrl = `/uploads/${path.basename(imagePath)}`;
  res.send(imageUrl);
});



export { app };
