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

    const alreadySubscribedInDB = userData?.targeted_actions?.subscribe === true;
    if (alreadySubscribedInDB) return;

    async function checkSubscriptionAndUpdate() {
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

        if (subscribed) {
          try {
            const update = await axios.post("/user/update-target", {
              user_id: userId,
              target_name: "subscribe",
              target_value: true,
            });
            console.log(update.data);
            setIsSubscribe(true);
          } catch (err) {
            console.error("Ошибка обновления subscribe в БД:", err);
          }
        }
      } catch (err) {
        console.error("Ошибка проверки подписки через VK API:", err);
      }
    }

    checkSubscriptionAndUpdate();
  }, [accessToken, userId, userData]);

  return isSubscribe;
}
