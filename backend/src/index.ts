import express, { Application, Request, Response } from "express";
import "dotenv/config";

const port: number = Number(process.env.PORT) || 3000;
const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
