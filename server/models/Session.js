import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  state: { type: String, required: false },
  codeVerifier: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

export default mongoose.model("Session", SessionSchema);
