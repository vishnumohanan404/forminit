import { Router } from "express";
import { createWorkspace } from "../controllers/dashboard";
import { verifyToken } from "../middlewares/authentication";
const router = Router();

router.post("/", verifyToken, createWorkspace);
export default router;
