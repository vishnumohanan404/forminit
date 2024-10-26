import express from "express";
import "dotenv/config";
const port = Number(process.env.PORT) || 3000;
const app = express();
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
