import Session from "../models/Session.js";
import Token from "../models/Token.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import crypto from "crypto";
import querystring from "querystring";
import axios from "axios";

dotenv.config();

const config = {
  clientId: process.env.VK_CLIENT_ID,
  redirectUri: process.env.VK_CALLBACK_URL,
  scope: "email,wall,groups",
  authUrl: "https://id.vk.com/authorize",
  tokenUrl: "https://id.vk.com/oauth2/auth",
  userInfoUrl: "https://id.vk.com/oauth2/user_info",
};

function generatePKCE() {
  const codeVerifier = crypto
    .randomBytes(32)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return { codeVerifier, codeChallenge };
}

function generateState() {
  return crypto.randomBytes(16).toString("hex");
}

export async function getAuthUrl() {
  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = generateState();

  const session = new Session({
    state,
    codeVerifier,
  });

  await session.save();

  const params = {
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  };

  return `${config.authUrl}?${querystring.stringify(params)}`;
}

export async function exchangeCodeForToken(code, state, deviceId) {
  if (!code || !state) {
    throw new Error("Missing code or state parameters");
  }

  const session = await Session.findOne({ state });
  if (!session) {
    console.log("Session not found for state:", state);
    throw new Error("Invalid or expired state parameter");
  }

  console.log(
    "Found session for state:",
    session.state,
    "created at:",
    session.createdAt
  );

  const params = new URLSearchParams();
  params.append("client_id", config.clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("code_verifier", session.codeVerifier);
  params.append("redirect_uri", config.redirectUri);

  if (deviceId && deviceId !== "unknown") {
    params.append("device_id", deviceId);
    console.log("Using device_id:", deviceId);
  }

  try {
    const response = await axios.post(config.tokenUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 10000,
    });

    await Session.deleteOne({ state });

    const responseData = response.data;
    console.log("Token exchange response:", responseData);

    if (!responseData.access_token || !responseData.refresh_token) {
      throw new Error("Invalid token response from VK ID");
    }

    const expiresIn = parseInt(responseData.expires_in) || 86400;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // Сохраняем токены в MongoDB
    const token = new Token({
      userId: responseData.user_id?.toString() || "unknown",
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token,
      deviceId: responseData.device_id || deviceId || "unknown",
      expiresAt: expiresAt,
      scope: responseData.scope || config.scope,
    });

    await token.save();

    return {
      userId: responseData.user_id,
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token,
      deviceId: responseData.device_id || deviceId,
      expiresAt: expiresAt,
      scope: responseData.scope,
    };
  } catch (error) {
    console.error(
      "Token exchange error:",
      error.response?.data || error.message
    );

    // Удаляем сессию в случае ошибки
    await Session.deleteOne({ state });

    throw error;
  }
}

export async function refreshToken(userId) {
  const token = await Token.findOne({ userId });

  if (!token) {
    throw new Error("No tokens found for this user");
  }

  const params = new URLSearchParams();
  params.append("client_id", config.clientId);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", token.refreshToken);

  // Добавляем device_id если он есть
  if (token.deviceId && token.deviceId !== "unknown") {
    params.append("device_id", token.deviceId);
    console.log("Using device_id for refresh:", token.deviceId);
  }

  try {
    const response = await axios.post(config.tokenUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const responseData = response.data;

    if (!responseData.access_token || !responseData.refresh_token) {
      throw new Error("Invalid response data from VK ID");
    }

    // Обновляем токены в MongoDB
    const expiresAt = new Date(
      Date.now() + parseInt(responseData.expires_in) * 1000
    );

    token.accessToken = responseData.access_token;
    token.refreshToken = responseData.refresh_token;
    token.expiresAt = expiresAt;
    token.scope = responseData.scope || token.scope;

    await token.save();

    return {
      userId: responseData.user_id || userId,
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token,
      expiresAt: expiresAt,
      scope: responseData.scope || token.scope,
    };
  } catch (error) {
    console.error(
      "Token refresh error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function getUserInfo(userId) {
  const user = await User.findOne({ userId });
  if (user) {
    return user;
  }

  const token = await Token.findOne({ userId });
  if (!token) {
    throw new Error("No access token found for this user");
  }

  try {
    const response = await axios.get(config.userInfoUrl, {
      params: {
        access_token: token.accessToken,
      },
    });

    const userData = response.data.user;
    console.log(userData, userId);

    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },
      {
        user_id: userId,
      },
      { upsert: true, new: true }
    );

    return updatedUser;
  } catch (error) {
    console.error("User info error:", error.response?.data || error.message);
    throw error;
  }
}

export async function logout(userId) {
  const token = await Token.findOne({ userId });

  if (!token) {
    throw new Error("No tokens found for this user");
  }

  const params = new URLSearchParams();
  params.append("client_id", config.clientId);
  params.append("access_token", token.accessToken);

  try {
    await axios.post("https://id.vk.com/oauth2/logout", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    await Token.deleteOne({ userId });

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    throw error;
  }
}

export async function isAuthenticated(userId) {
  const token = await Token.findOne({ userId });
  if (!token) return false;

  if (token.expiresAt < new Date()) {
    try {
      await refreshToken(userId);
      return true;
    } catch (error) {
      return false;
    }
  }

  return true;
}

export async function cleanupOldSessions() {
  try {
    const result = await Session.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 3600 * 1000) }, // старше 1 часа
    });
    console.log(`Cleaned up ${result.deletedCount} old sessions`);
  } catch (error) {
    console.error("Session cleanup error:", error);
  }
}
