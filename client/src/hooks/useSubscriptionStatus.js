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
          try {
            const res = await axios.get(`/vk/check-subscribe/${userId}`);
            subscribed = res.data.isMember === 1;
          } catch (error) {
            console.log(error);
          }
        }

        if (subscribed && !isSubscribe) {
          setIsSubscribe(true);

          if (userData?.targeted_actions?.subscribe === false) {
            try {
              await axios.post("/user/update-target", {
                user_id: userId,
                target_name: "subscribe",
                target_value: true,
              });
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
