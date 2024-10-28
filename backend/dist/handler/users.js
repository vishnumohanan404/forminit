"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
async function getUsers(req, res) {
    res.send([]);
}
async function getUserById(req, res) {
    res.send({});
}
async function createUser(req, res) {
    const newUser = {
        username: "Vishnu",
        id: 121,
        email: "vishnu@gmail.com",
    };
    res.status(201).send(newUser);
}
