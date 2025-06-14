import { Router } from "express";
import { verifyToken } from "../middlewares/authentication";
import {
  createNewForm,
  fetchForm,
  fetchSubmissions,
  submitForm,
  updateForm,
  viewForm,
  deleteForm,
  toggleFormDisabledStatus,
} from "../controllers/form";
const router = Router();

router.post("/", verifyToken, createNewForm);
router.get("/:formId", verifyToken, fetchForm);
router.get("/view-form/:formId", viewForm);
router.put("/:id", verifyToken, updateForm);
router.post("/submit-form", submitForm);
router.get("/submissions/:formId", verifyToken, fetchSubmissions);
router.delete("/:id", verifyToken, deleteForm);
router.put("/disable/:id", verifyToken, toggleFormDisabledStatus);
export default router;
