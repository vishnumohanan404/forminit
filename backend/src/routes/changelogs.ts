import { Router } from "express";
import { fetchChangelogs } from "../controllers/changelogs";
const router = Router();

router.get("/", fetchChangelogs);
export default router;
