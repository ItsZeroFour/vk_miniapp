export default async function ensureAuth(req, res, next) {
  console.log("=== AUTH DEBUG ===");
  console.log("URL:", req.url);
  console.log("Origin:", req.headers.origin);
  console.log("User-Agent:", req.headers["user-agent"]);

  // 1. Проверяем VK Mini App по Origin
  const isVKMiniapp =
    req.headers.origin?.includes("vk.com") ||
    req.headers.origin?.includes("vkuserapi.com");

  // 2. Для VK Mini App - пропускаем все запросы
  if (isVKMiniapp) {
    console.log("✅ VK Mini App detected - bypassing auth");

    // Для GET запросов пробуем получить user_id из query
    if (req.method === "GET") {
      req.userId =
        req.query.user_id || req.query.vk_user_id || "vk_miniapp_user";
    }
    // Для POST запросов - из body
    else if (req.method === "POST") {
      req.userId = req.body.user_id || req.body.vk_user_id || "vk_miniapp_user";
    }

    console.log("✅ Using userId:", req.userId);
    return next();
  }

  // 3. Для веба - используем сессии
  if (req.session && req.session.userId) {
    console.log(
      "✅ Web user authenticated via session, userId:",
      req.session.userId
    );
    req.userId = req.session.userId;
    return next();
  }

  // 4. Если не VK Mini App и нет сессии
  console.log("❌ Not VK Mini App and no session");
  res.status(401).json({ ok: false, error: "Unauthorized" });
}
