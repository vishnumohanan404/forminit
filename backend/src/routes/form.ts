import { Router } from "express";
import { verifyToken } from "../middlewares/authentication";
import { createNewForm, fetchForm, updateForm } from "../controllers/form";
const router = Router();

router.post("/", verifyToken, createNewForm);
router.get("/:formId", verifyToken, fetchForm);
router.put("/:id", verifyToken, updateForm);
export default router;
