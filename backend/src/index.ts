import express, { Application } from "express";
import "dotenv/config";
import http from "http";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import router from "./routes";
import connectDB from "./config/db";

const port: number = Number(process.env.PORT) || 3000;
const app: Application = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();
// routes
app.use("/api", router);
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
