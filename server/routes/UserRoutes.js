import express from "express";
import {
  authUser,
  completeFirstGame,
  getUser,
  updateTargetStatus,
} from "../components/UserControllers.js";
import ensureAuth from "../utils/ensureAuth.js";

const router = express.Router();

router.post("/auth", authUser);
router.post("/update-target", updateTargetStatus);
router.post("/complete-first-game", completeFirstGame);
router.get("/get", ensureAuth, getUser);

export default router;
