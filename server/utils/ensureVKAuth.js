import axios from "axios";

export default async function ensureVKAuth(req, res, next) {
  const vkAccessToken = req.headers["authorization"]?.replace("Bearer ", "");

  if (!vkAccessToken) {
    return res.status(401).json({ ok: false, error: "VK token required" });
  }

  try {
    const response = await axios.get("https://api.vk.com/method/users.get", {
      params: {
        access_token: vkAccessToken,
        v: "5.131",
      },
    });

    if (response.data.error) {
      return res.status(401).json({ ok: false, error: "Invalid VK token" });
    }

    req.vkUserId = response.data.response[0].id;
    next();
  } catch (error) {
    console.error("VK token verification error:", error);
    res.status(401).json({ ok: false, error: "Token verification failed" });
  }
}
