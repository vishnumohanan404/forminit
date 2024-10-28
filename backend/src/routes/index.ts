import express from "express";
import authRoutes from "./authentication";
import userRoutes from "./users";
import dashboardRoutes from "./dashboard";

const router = express.Router();

// Register individual routes with a base path
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
