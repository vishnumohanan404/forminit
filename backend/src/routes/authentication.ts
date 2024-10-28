import { Router } from "express";
import { login, signup } from "../controllers/authentication";
import { loginValidation, signupValidation } from "../validations/user";
const router = Router();

// Define auth routes

router.post("/signup", signupValidation, signup);
router.get("/login", loginValidation, login);

export default router;
