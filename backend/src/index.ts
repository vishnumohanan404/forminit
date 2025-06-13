import "dotenv/config";
import http from "http";
import connectDB from "./config/db";
import { app } from "./app";

const port: number = Number(process.env.PORT) || 3000;

// Connect to MongoDB
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
  connectDB();
});
