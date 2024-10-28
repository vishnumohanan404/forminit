"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../controllers/authentication");
// @ts-ignore
exports.default = (router) => {
    router.post("/auth/register", authentication_1.register);
};
