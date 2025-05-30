"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = exports.random = void 0;
const crypto_1 = __importDefault(require("crypto"));
// authentication
const random = () => crypto_1.default.randomBytes(128).toString("base64");
exports.random = random;
const authentication = (salt, password) => {
    return crypto_1.default
        .createHmac("sha256", [salt, password].join("/"))
        .update(String(process.env.JWT_SECRET));
};
exports.authentication = authentication;
