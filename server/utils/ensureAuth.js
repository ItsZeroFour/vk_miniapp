import axios from "axios";

export default async function ensureUniversalAuth(req, res, next) {
  if (req.session && req.session.userId) {
    console.log(
      "✅ Web user authenticated via session, userId:",
      req.session.userId
    );
    req.userId = req.session.userId;
    return next();
  }

  const vkAccessToken =
    req.headers["authorization"]?.replace("Bearer ", "") ||
    req.query.access_token ||
    req.body.access_token;

  if (vkAccessToken) {
    try {
      console.log("🔑 Trying VK token authentication");
      const response = await axios.get("https://api.vk.com/method/users.get", {
        params: {
          access_token: vkAccessToken,
          v: "5.131",
        },
      });

      if (response.data.error) {
        console.log("❌ Invalid VK token");
        return res.status(401).json({ ok: false, error: "Invalid VK token" });
      }

      req.userId = response.data.response[0].id;
      console.log("✅ VK user authenticated, userId:", req.userId);
      return next();
    } catch (error) {
      console.error("VK token verification error:", error);
    }
  }

  try {
    const isVKRequest =
      req.headers["user-agent"]?.includes("VK") ||
      req.headers["origin"]?.includes("vk.com") ||
      req.query.vk_platform;

    if (isVKRequest) {
      console.log("🔍 Detected VK Mini App request, trying to get user info");

      const vkUserId = req.query.vk_user_id || req.query.user_id;

      if (vkUserId) {
        req.userId = vkUserId;
        console.log("✅ VK user ID from query params:", req.userId);
        return next();
      }

      if (req.body.user_id) {
        req.userId = req.body.user_id;
        console.log("✅ VK user ID from body:", req.userId);
        return next();
      }
    }
  } catch (error) {
    console.error("VK user detection error:", error);
  }

  console.log("❌ User not authenticated");
  res.status(401).json({ ok: false, error: "Unauthorized" });
}
