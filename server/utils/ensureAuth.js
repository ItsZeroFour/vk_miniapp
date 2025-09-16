export default function ensureAuth(req, res, next) {
  console.log("=== SESSION DEBUG ===");
  console.log("Session ID:", req.sessionID);
  console.log("Session data:", req.session);
  console.log("UserID in session:", req.session?.userId);
  console.log("=====================");

  if (req.session && req.session.userId) {
    console.log("✅ User authenticated, userId:", req.session.userId);
    return next();
  }

  console.log("❌ User not authenticated");
  res.status(401).json({ ok: false, error: "Unauthorized" });
}
