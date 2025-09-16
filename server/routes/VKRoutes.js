import express from "express";
import {
  checkComment,
  checkRepost,
  checkSubscribe,
  getToken,
} from "../components/VKControllers.js";
import ensureAuth from "../utils/ensureAuth.js";

const router = express.Router();

router.get("/check-subscribe/:userId", ensureAuth, checkSubscribe);
router.get("/check-comment/:userId", ensureAuth, checkComment);
router.get("/check-repost/:userId", ensureAuth, checkRepost);
router.get("/get-token/:userId", ensureAuth, getToken);

export default router;
