import express from "express";
import { authUser, updateTargetStatus } from "../components/UserControllers.js";

const router = express.Router();

router.post("/auth", authUser);
router.post("/update-target", updateTargetStatus);

export default router;
