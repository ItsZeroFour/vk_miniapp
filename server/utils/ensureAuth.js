export default function ensureAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ ok: false, error: "Unauthorized" });
}
