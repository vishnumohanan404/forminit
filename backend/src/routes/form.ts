import { Router } from "express";
import { verifyToken } from "../middlewares/authentication";
import { createNewForm, fetchForm, updateForm, viewForm } from "../controllers/form";
const router = Router();

router.post("/", verifyToken, createNewForm);
router.get("/:formId", verifyToken, fetchForm);
router.get("/view-form/:formId", viewForm);
router.put("/:id", verifyToken, updateForm);
// router.post("/:id", verifyToken, publishForm);
export default router;
