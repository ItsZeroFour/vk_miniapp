import express from "express";
import {
  authUser,
  completeFirstGame,
  completeSecondGame,
  completeThirdGame,
  getUser,
  updateTargetStatus,
} from "../components/UserControllers.js";
import ensureAuth from "../utils/ensureAuth.js";

const router = express.Router();

router.post("/auth", ensureAuth, authUser);
router.post("/update-target", ensureAuth, updateTargetStatus);
router.post("/complete-first-game", ensureAuth, completeFirstGame);
router.post("/complete-second-game", ensureAuth, completeSecondGame);
router.post("/complete-third-game", ensureAuth, completeThirdGame);
router.get("/get", ensureAuth, getUser);

export default router;
