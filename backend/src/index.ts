import express, { Application } from "express";
import "dotenv/config";
import http from "http";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import router from "./routes";
import connectDB from "./config/db";
import morgan from "morgan";
import logger from "./logger";

const port: number = Number(process.env.PORT) || 3000;
const app: Application = express();
// Morgan middleware for logging HTTP requests
app.use(
  morgan(":method :url :status :response-time ms", {
    stream: {
      write: (message: string) => logger.info(message.trim()), // Redirect Morgan logs to Winston
    },
  })
);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
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
