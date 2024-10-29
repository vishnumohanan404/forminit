import { Router } from "express";
import { google, login, signup } from "../controllers/authentication";
import { loginValidation, signupValidation } from "../validations/user";
const router = Router();

// Define auth routes

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/google", google);

export default router;
