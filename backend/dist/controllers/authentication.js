"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const users_1 = require("../db/users");
const helpers_1 = require("../helpers");
const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            res.sendStatus(400);
            return;
        }
        const existingUser = await (0, users_1.getUserByEmail)(email);
        if (existingUser) {
            res.status(409).send("Email already exists");
            return;
        }
        const salt = (0, helpers_1.random)();
        const user = await (0, users_1.createUser)({
            email,
            username,
            authentication: {
                salt,
                password: (0, helpers_1.authentication)(salt, password),
            },
        });
        res.status(200).json(user).end();
    }
    catch (error) {
        res.sendStatus(400);
    }
};
exports.register = register;
