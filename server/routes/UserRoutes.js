import express from "express";
import {
  authUser,
  completeGame,
  getUser,
  updateTargetStatus,
} from "../components/UserControllers.js";

const router = express.Router();

router.post("/auth", authUser);
router.post("/update-target", updateTargetStatus);
router.post("/complete-game", completeGame);
router.get("/get/:userId", getUser);

export default router;
