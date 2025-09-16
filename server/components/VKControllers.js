import { useEffect, useState, useCallback } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";
import { isVkMiniApp } from "../utils/isVkMiniApp";

export default function useSubscriptionStatus(accessToken, userId, userData) {
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (userData?.targeted_actions?.subscribe === true) {
      setIsSubscribe(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!userId) return;

    async function checkSubscription() {
      try {
        let subscribed = false;

        if (isVkMiniApp()) {
          // Проверка через VK Bridge
          const res = await bridge.send("VKWebAppCallAPIMethod", {
            method: "groups.isMember",
            params: {
              group_id: process.env.REACT_APP_GROUP_ID,
              user_id: userId,
              v: "5.131",
              access_token: accessToken,
            },
          });
          subscribed = res.response === 1;
        } else {
          // Проверка через сервер
          const launchParams = await bridge.send("VKWebAppGetLaunchParams");
          const res = await axios.get("/vk/check-subscribe", {
            params: launchParams,
          });
          subscribed = res.data.isMember === 1;
        }

        if (subscribed && !isSubscribe) {
          setIsSubscribe(true);

          if (userData?.targeted_actions?.subscribe === false) {
            try {
              const launchParams = await bridge.send("VKWebAppGetLaunchParams");
              await axios.post(
                "/user/update-target",
                { target_name: "subscribe", target_value: true },
                { params: launchParams }
              );
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (err) {
        console.error("Ошибка проверки подписки:", err);
      }
    }

    checkSubscription();
  }, [accessToken, userId, userData, isSubscribe, refreshKey]);

  return { isSubscribe, refresh };
}

export default function useCommentStatus(accessToken, userId, userData) {
  const [commentStatus, setCommentStatus] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (userData?.targeted_actions?.comment) {
      setCommentStatus(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!userId) return;

    async function checkComments() {
      try {
        let userHasCommented = false;

        if (isVkMiniApp()) {
          // Проверка через VK Bridge
          const response = await bridge.send("VKWebAppCallAPIMethod", {
            method: "wall.getComments",
            params: {
              owner_id: -Number(process.env.REACT_APP_GROUP_ID),
              post_id: Number(process.env.REACT_APP_POST_ID_COMMENT),
              count: 100,
              v: "5.131",
              access_token: accessToken,
            },
          });

          userHasCommented = response.response.items.some(
            (c) => c.from_id === Number(userId)
          );
        } else {
          // Проверка через сервер
          const launchParams = await bridge.send("VKWebAppGetLaunchParams");
          const res = await axios.get("/vk/check-comment", {
            params: launchParams,
          });
          userHasCommented = res.data.hasCommented;
        }

        if (userHasCommented && !commentStatus) {
          setCommentStatus(true);

          if (userData?.targeted_actions?.comment === false) {
            try {
              const launchParams = await bridge.send("VKWebAppGetLaunchParams");
              await axios.post(
                "/user/update-target",
                { target_name: "comment", target_value: true },
                { params: launchParams }
              );
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (err) {
        console.error("Ошибка проверки комментария:", err);
      }
    }

    checkComments();
  }, [accessToken, userId, userData, commentStatus, refreshKey]);

  return { isCommented: commentStatus, refresh };
}


export async function checkRepost(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const response = await axios.get("https://api.vk.com/method/wall.get", {
      params: {
        owner_id: userId,
        count: 100,
        filter: "owner",
        v: "5.131",
        access_token: process.env.VK_SERVICE_TOKEN_AUTH,
      },
    });

    const posts = response.data?.response?.items || [];
    const groupId = -Number(process.env.VK_GROUP_ID);
    const postId = Number(process.env.VK_POST_ID);

    const reposted = posts.some((item) => {
      const original = item.copy_history?.[0];
      return original && original.from_id === groupId && original.id === postId;
    });

    return res.json({ shared: reposted });
  } catch (err) {
    console.error("Ошибка проверки репоста:", err.message);
    return res.status(500).json({ error: "Ошибка проверки репоста" });
  }
}

export async function getToken(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const response = await axios.get("https://api.vk.com/method/users.get", {
      params: {
        user_ids: userId,
        access_token: process.env.VK_SERVICE_TOKEN_AUTH,
        v: "5.131",
      },
    });

    return res.json({
      user: response.data,
    });
  } catch (err) {
    console.error("Ошибка получения токена:", err.message);
    return res.status(500).json({ error: "Ошибка получения токена" });
  }
}

