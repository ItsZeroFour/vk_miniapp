import { useEffect, useState, useCallback } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";
import useVkEnvironment from "./useVkEnvironment";

export default function useSubscriptionStatus(accessToken, userId, userData) {
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { isMiniApp } = useVkEnvironment();

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

        if (isMiniApp) {
          const launchParams = await bridge.send("VKWebAppGetLaunchParams");
          const res = await axios.get(`/vk/check-subscribe`, {
            params: launchParams,
          });
          subscribed = res.data.isMember === 1;
        } else {
          try {
            // const launchParams = await bridge.send("VKWebAppGetLaunchParams");
            const res = await axios.get(`/vk/check-subscribe`, {
              // params: launchParams,
            });
            subscribed = res.data.isMember === 1;
          } catch (error) {
            console.log(error);
          }
        }

        if (subscribed && !isSubscribe) {
          setIsSubscribe(true);

          if (userData?.targeted_actions?.subscribe === false) {
            try {
              const launchParams = await bridge.send("VKWebAppGetLaunchParams");
              await axios.post(
                "/user/update-target",
                {
                  user_id: userId,
                  target_name: "subscribe",
                  target_value: true,
                },
                {
                  params: launchParams,
                }
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
