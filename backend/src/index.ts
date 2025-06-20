import "dotenv/config";
import http from "http";
import connectDB from "./config/db";
import { app } from "./app";

const port: number = Number(process.env.PORT) || 3000;

// Connect to MongoDB
const server = http.createServer(app);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${port}/`);
  connectDB();
});
