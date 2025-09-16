export default function ensureAuth(req, res, next) {
  if (req.session && req.session.userId) {
    console.log("✅ User authenticated, userId:", req.session.userId);
    return next();
  }

  console.log("❌ User not authenticated");
  res.status(401).json({ ok: false, error: "Unauthorized" });
}
