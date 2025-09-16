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
import ensureVKAuth from "../utils/ensureVKAuth.js";

const router = express.Router();

router.post("/auth", ensureAuth, ensureVKAuth, authUser);
router.post("/update-target", ensureAuth, ensureVKAuth, updateTargetStatus);
router.post("/complete-first-game", ensureAuth, ensureVKAuth, completeFirstGame);
router.post("/complete-second-game", ensureAuth, ensureVKAuth, completeSecondGame);
router.post("/complete-third-game", ensureAuth, ensureVKAuth, completeThirdGame);
router.get("/get", ensureAuth, ensureVKAuth, getUser);

export default router;
