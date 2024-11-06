import { Router } from "express";
import { getUser, updatePassword, updateUser } from "../controllers/user";
import { verifyToken } from "../middlewares/authentication";

const router = Router();

router.get("/", verifyToken, getUser);
router.put("/", verifyToken, updateUser);
router.put("/update-password", verifyToken, updatePassword);
export default router;
