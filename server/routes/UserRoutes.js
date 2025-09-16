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
router.post("/update-target", updateTargetStatus);
router.post("/complete-first-game", completeFirstGame);
router.post("/complete-second-game", completeSecondGame);
router.post("/complete-third-game", completeThirdGame);
router.get("/get", ensureAuth, getUser);

export default router;
