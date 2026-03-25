import { Router } from "express";
import { verifyToken } from "../middlewares/authentication";
import {
  createNewForm,
  fetchForm,
  fetchFormAnalytics,
  fetchSubmissions,
  submitForm,
  updateForm,
  viewForm,
  deleteForm,
  toggleFormDisabledStatus,
  publishFormController,
} from "../controllers/form";
const router = Router();

router.post("/", verifyToken, createNewForm);
router.get("/analytics/:formId", verifyToken, fetchFormAnalytics);
router.get("/:formId", verifyToken, fetchForm);
router.get("/view-form/:formId", viewForm);
router.put("/:id", verifyToken, updateForm);
router.post("/submit-form", submitForm);
router.get("/submissions/:formId", verifyToken, fetchSubmissions);
router.delete("/:id", verifyToken, deleteForm);
router.put("/disable/:id", verifyToken, toggleFormDisabledStatus);
router.put("/publish/:id", verifyToken, publishFormController);
export default router;
