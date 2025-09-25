import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import session from "express-session";
import vkRoutes from "./routes/VKRoutes.js";

/* ROUTES */
import UserRoutes from "./routes/UserRoutes.js";
import MongoStore from "connect-mongo";
import {
  getAuthUrl,
  exchangeCodeForToken,
  getUserInfo,
  logout,
  isAuthenticated,
} from "./components/VKAuthControllers.js";
import User from "./models/User.js";

dotenv.config({ path: "./.env" });
const app = express();

/* CONSTANTS */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/* MIDDLEWARES */
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "20mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

/* VK AUTH */

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60,
    },
  })
);

app.get("/auth/vk", async (req, res) => {
  try {
    const authUrl = await getAuthUrl();
    res.redirect(authUrl);
  } catch (error) {
    console.error("Auth initiation error:", error);
    res.status(500).send("Authentication initiation failed");
  }
});

app.get("/auth/vk/callback", async (req, res) => {
  try {
    const { code, state, device_id, error, error_description } = req.query; // Добавлен device_id

    console.log("Callback received:", { code, state, device_id, error });

    if (error) {
      console.error("VK ID error:", error, error_description);
      return res
        .status(400)
        .send(`Authentication failed: ${error_description || error}`);
    }

    if (!code || !state) {
      return res
        .status(400)
        .send("Missing required parameters: code and state");
    }

    const tokens = await exchangeCodeForToken(code, state, device_id);

    req.session.userId = tokens.userId;
    req.session.accessToken = tokens.accessToken;

    console.log("Successfully authenticated user:", tokens.userId);
    console.log("Saved to session:", req.session.userId);

    try {
      const user_id = tokens.userId;

      if (!user_id) {
        return res.redirect(`${process.env.CLIENT_URL}?hide_video=true`);
      }

      const findUser = await User.findOne({ user_id });

      if (!findUser) {
        const doc = new User({
          user_id,
        });

        await doc.save();
        return res.redirect(
          `${process.env.CLIENT_URL}?userId=${user_id}&token=${tokens.accessToken}&hide_video=true`
        );
      } else {
        return res.redirect(
          `${process.env.CLIENT_URL}?userId=${user_id}&token=${tokens.accessToken}&hide_video=true`
        );
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось аутентифицировать пользователя",
      });
    }
  } catch (error) {
    console.error("Auth callback error:", error.message);

    if (error.message.includes("state parameter")) {
      console.log("Session expired. Please try logging in again.");
      return res.redirect(`${process.env.CLIENT_URL}?hide_video=true`);
    } else if (error.response?.data) {
      console.log(`VK ID error: ${JSON.stringify(error.response.data)}`);
      return res.redirect(`${process.env.CLIENT_URL}?hide_video=true`);
    } else {
      console.log("Authentication failed. Please try again");
      return res.redirect(`${process.env.CLIENT_URL}?hide_video=true`);
    }
  }
});

app.get("/profile", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/auth/vk");
  }

  try {
    const authenticated = await isAuthenticated(req.session.userId);
    if (!authenticated) {
      return res.redirect("/auth/vk");
    }

    const user = await getUserInfo(req.session.userId);
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).send("Error loading profile");
  }
});

app.get("/logout", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/");
  }

  try {
    await logout(req.session.userId);
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send("Logout failed");
  }
});

/* ROUTES */
app.use("/user", UserRoutes);
app.use("/vk", vkRoutes);

/* START FUNCTION */
async function start() {
  try {
    await mongoose
      .connect(MONGO_URI)
      .then(() => {
        console.log("Mongo db connection successfully");
      })
      .catch((err) => console.log(err));

    app.listen(PORT, (err) => {
      if (err) return console.log("Приложение аварийно завершилось: ", err);
      console.log(`Сервер успешно запущен! Порт: ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
