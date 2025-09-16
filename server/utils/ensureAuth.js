import axios from "axios";

export default async function ensureAuth(req, res, next) {
  console.log("🔍 Auth check started");
  console.log("Origin:", req.headers['origin']);
  console.log("User-Agent:", req.headers['user-agent']);
  console.log("Query params:", Object.keys(req.query));
  console.log("Body keys:", Object.keys(req.body || {}));

  if (req.session && req.session.userId) {
    console.log("✅ Web user authenticated via session, userId:", req.session.userId);
    req.userId = req.session.userId;
    return next();
  }

  const tokenSources = [
    req.headers["authorization"]?.replace("Bearer ", ""),
    req.query.access_token,
    req.body?.access_token,
    req.query.vk_access_token,
    req.body?.vk_access_token
  ];

  const validTokens = tokenSources.filter(token => token && token !== 'undefined');

  for (const token of validTokens) {
    if (token) {
      try {
        console.log("🔑 Trying token:", token.substring(0, 10) + '...');
        const response = await axios.get("https://api.vk.com/method/users.get", {
          params: { 
            access_token: token, 
            v: "5.131",
            fields: "id"
          }
        });
        
        if (response.data.response && response.data.response[0]?.id) {
          req.userId = response.data.response[0].id.toString();
          console.log("✅ VK user authenticated via token, userId:", req.userId);
          return next();
        }
      } catch (error) {
        console.log("❌ Token verification failed:", error.message);
        continue;
      }
    }
  }

  const userIdSources = [
    req.query.user_id,
    req.query.vk_user_id,
    req.query.userId,
    req.body?.user_id,
    req.body?.vk_user_id,
    req.body?.userId
  ];

  const validUserIds = userIdSources.filter(id => id && id !== 'undefined');

  if (validUserIds.length > 0) {
    req.userId = validUserIds[0].toString();
    console.log("✅ User ID from request data:", req.userId);
    return next();
  }

  const isVKRequest = req.headers['origin']?.includes('vk.com') 
                    || req.headers['user-agent']?.includes('VK')
                    || req.query.vk_platform
                    || req.query.vk_is_app_user;

  if (isVKRequest) {
    console.log("✅ VK Mini App detected, but no auth data. Using fallback.");
    req.userId = 'vk_miniapp_user';
    return next();
  }

  console.log("❌ User not authenticated - no valid session, token, or user ID");
  res.status(401).json({ ok: false, error: "Unauthorized" });
}