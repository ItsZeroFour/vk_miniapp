import express from "express";
import {
  checkComment,
  checkRepost,
  checkSubscribe,
  getToken,
} from "../components/VKControllers.js";
import ensureAuth from "../utils/ensureAuth.js";

const router = express.Router();

router.get("/check-subscribe", ensureAuth, checkSubscribe);
router.get("/check-comment", ensureAuth, checkComment);
router.get("/check-repost", ensureAuth, checkRepost);
router.get("/get-token", ensureAuth, getToken);

export default router;
