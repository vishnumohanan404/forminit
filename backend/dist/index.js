"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const users_1 = __importDefault(require("./routes/users"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const port = Number(process.env.PORT) || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use("/api/users", users_1.default);
const server = http_1.default.createServer(app);
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
const MONGO_URL = String(process.env.DATABASE_URL);
mongoose_1.default.Promise = Promise;
mongoose_1.default
    .connect(MONGO_URL)
    .then(() => {
    console.log("Successfully connected to MongoDB!"); // Success message
})
    .catch((error) => console.error(error));
mongoose_1.default.connection.on("error", (error) => console.log(error));
