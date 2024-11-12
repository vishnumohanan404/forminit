import morgan from "morgan";
import logger from "./logger";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import router from "./routes";
import express, { Application } from "express";

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
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
  })
);
app.options("*", cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
// routes
app.use("/api", router);

export { app };
