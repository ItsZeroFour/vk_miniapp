import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";
import usePlatform from "./usePlatform";

export default function useSubscriptionStatus(accessToken, userId, userData) {
  const [isSubscribe, setIsSubscribe] = useState(false);
  const { isVKMiniApp } = usePlatform();

  useEffect(() => {
    if (userData?.targeted_actions?.subscribe === true) {
      setIsSubscribe(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!userId) return;

    async function checkSubscription() {
      try {
        if (isVKMiniApp) {
          const res = await bridge.send("VKWebAppCallAPIMethod", {
            method: "groups.isMember",
            params: {
              group_id: process.env.REACT_APP_GROUP_ID,
              user_id: userId,
              extended: 0,
              v: "5.131",
              access_token: accessToken,
            },
          });

          if (res.response === 1) setIsSubscribe(true);
        } else {
          // Проверка через API
          const res = await axios.get(`/user/check-subscribe/${userId}`);
          if (res.data.subscribed) setIsSubscribe(true);
        }
      } catch (err) {
        console.error("Ошибка проверки подписки:", err);
      }
    }

    checkSubscription();
  }, [accessToken, userId, userData, isVKMiniApp]);

  return isSubscribe;
}
