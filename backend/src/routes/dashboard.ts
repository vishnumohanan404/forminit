import { Router } from "express";
import { getDashboard, createWorkspace } from "../controllers/dashboard";
import { verifyToken } from "../middlewares/authentication";
const router = Router();

router.get("/", verifyToken, getDashboard);

export default router;
