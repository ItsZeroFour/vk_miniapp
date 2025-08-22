import express from "express";
import {
  checkComment,
  checkRepost,
  checkSubscribe,
  getToken,
} from "../components/VKControllers.js";

const router = express.Router();

router.get("/check-subscribe/:userId", checkSubscribe);
router.get("/check-comment/:userId", checkComment);
router.get("/check-repost/:userId", checkRepost);
router.get("/get-token/:userId", getToken);

export default router;
