import express from "express";
import authRoutes from "./authentication";
import userRoutes from "./users";
import dashboardRoutes from "./dashboard";
import workspaceRoutes from "./workspace";
import formRoutes from "./form";

const router = express.Router();

// Register individual routes with a base path
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/workspace", workspaceRoutes);
router.use("/form", formRoutes);

export default router;
