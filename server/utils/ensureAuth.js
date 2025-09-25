import crypto from "crypto";
import dotenv from "dotenv";
import { isAuthenticated } from "./components/VKAuthControllers.js";

dotenv.config();

function verifyMiniAppSign(params) {
  if (!params || !params.sign) return false;

  const ordered = Object.keys(params)
    .filter((k) => k.startsWith("vk_"))
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const hash = crypto
    .createHmac("sha256", process.env.VK_SECURITY_KEY)
    .update(ordered)
    .digest()
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return hash === params.sign;
}

export default function ensureAuth(req, res, next) {
  if (verifyMiniAppSign(req.query)) {
    req.userId = req.query.vk_user_id || req.query.user_id;
    console.log("✅ Authenticated via session1:", req.session.userId);

    return next();
  }

  if (verifyMiniAppSign(req.body)) {
    req.userId = req.body.vk_user_id || req.query.user_id;
    console.log("✅ Authenticated via session2:", req.session.userId);
    return next();
  }

  if (req.session && req.session.userId) {
    try {
      const authenticated = isAuthenticated(req.session.userId);
      if (authenticated) {
        req.userId = req.session.userId;
        console.log("✅ Authenticated via session:", req.session.userId);
        return next();
      } else {
        req.session.destroy();
        console.log("❌ Session expired");
      }
    } catch (error) {
      console.log("❌ Session validation error:", error);
    }
  }

  console.log("❌ Unauthorized", req.session);
  return res.status(401).json({ ok: false, error: "Unauthorized" });
}
