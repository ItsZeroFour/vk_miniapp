import crypto from "crypto";

function verifyMiniAppSign(query) {
  if (!query.sign) return false;

  const ordered = Object.keys(query)
    .filter((k) => k.startsWith("vk_"))
    .sort()
    .map((k) => `${k}=${query[k]}`)
    .join("&");

  const hash = crypto
    .createHmac("sha256", process.env.VK_APP_SECRET)
    .update(ordered)
    .digest()
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return hash === query.sign;
}

export default function ensureAuth(req, res, next) {
  console.log("=== AUTH DEBUG ===");
  console.log("URL:", req.url);

  if (verifyMiniAppSign(req.query)) {
    req.userId = req.query.vk_user_id;
    console.log("✅ VK Mini App userId:", req.userId);
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
