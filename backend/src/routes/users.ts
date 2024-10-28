import { Router } from "express";
import { createUser, getUserById, getUsers } from "../controllers/users";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);

export default router;
