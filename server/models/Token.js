import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  deviceId: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  scope: { type: String, required: true },
});

export default mongoose.model("Token", TokenSchema);
