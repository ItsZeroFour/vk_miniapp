import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

function verifyMiniAppSign(params) {
  if (!params.sign) return false;

  const ordered = Object.keys(params)
    .filter((k) => k.startsWith("vk_"))
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const hash = crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(ordered)
    .digest()
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return hash === params.sign;
}

export default function ensureAuth(req, res, next) {
  console.log("=== AUTH DEBUG ===");
  console.log("URL:", req.url);

  if (verifyMiniAppSign(req.query)) {
    req.userId = req.query.vk_user_id;
    console.log("✅ VK Mini App userId (query):", req.userId);
    return next();
  }

  if (verifyMiniAppSign(req.body)) {
    req.userId = req.body.vk_user_id;
    console.log("✅ VK Mini App userId (body):", req.userId);
    return next();
  }

  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    console.log("✅ Web user via session:", req.userId);
    return next();
  }

  console.log("❌ Unauthorized");
  return res.status(401).json({ ok: false, error: "Unauthorized" });
}
