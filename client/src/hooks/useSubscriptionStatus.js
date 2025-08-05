import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";

export default function useSubscriptionStatus(accessToken, userId, userData) {
  const [isSubscribe, setIsSubscribe] = useState(false);

  useEffect(() => {
    if (userData?.targeted_actions?.subscribe === true) {
      setIsSubscribe(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!accessToken || !userId) return;

    async function checkSubscription() {
      try {
        const res = await bridge.send("VKWebAppCallAPIMethod", {
          method: "groups.isMember",
          params: {
            group_id: process.env.REACT_APP_GROUP_ID,
            user_id: 0,
            extended: 0,
            v: "5.131",
            access_token: accessToken,
          },
        });

        const subscribed = res.response === 1;

        if (subscribed && !isSubscribe) {
          setIsSubscribe(true);

          if (userData?.targeted_actions?.subscribe === false) {
            try {
              const update = await axios.post("/user/update-target", {
                user_id: userId,
                target_name: "subscribe",
                target_value: true,
              });
              console.log(update.data);
            } catch (err) {
              console.error("Ошибка обновления subscribe:", err);
            }
          }
        }
      } catch (err) {
        console.error("Ошибка проверки подписки:", err);
      }
    }

    checkSubscription();
  }, [accessToken, userId, userData, isSubscribe]);

  return isSubscribe;
}
