import { Router } from "express";
import { createWorkspace } from "../controllers/dashboard";
import { verifyToken } from "../middlewares/authentication";
import { deleteWorkspace } from "../controllers/workspace";
const router = Router();

router.post("/", verifyToken, createWorkspace);
router.delete("/:workspaceId", verifyToken, deleteWorkspace);
export default router;
