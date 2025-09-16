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

  const vkAccessToken = req.headers["authorization"]?.replace("Bearer ", "");

  if (vkAccessToken) {
    try {
      console.log("Trying VK token authentication");
      const response = await axios.get("https://api.vk.com/method/users.get", {
        params: {
          access_token: vkAccessToken,
          v: "5.131",
        },
      });

      if (response.data.error) {
        console.log("Invalid VK token");
        return res.status(401).json({ ok: false, error: "Invalid VK token" });
      }

      req.userId = response.data.response[0].id;
      console.log("VK user authenticated, userId:", req.userId);
      return next();
    } catch (error) {
      console.error("VK token verification error:", error);
      return res
        .status(401)
        .json({ ok: false, error: "Token verification failed" });
    }
  }

  console.log("User not authenticated - no session or VK token");
  res.status(401).json({ ok: false, error: "Unauthorized" });
}
