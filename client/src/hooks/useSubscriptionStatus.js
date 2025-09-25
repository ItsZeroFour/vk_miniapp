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
    // if (!userId) return;

    async function checkSubscription() {
      try {
        let subscribed = false;

        if (isMiniApp) {
          console.log("test 1");

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
          console.log("test 2");

          try {
            // const launchParams = await bridge.send("VKWebAppGetLaunchParams");

            console.log("test 3");

            const res = await axios.get(`/vk/check-subscribe`, {
              // params: launchParams,
            });
            subscribed = res.data.isMember === 1;
          } catch (error) {
            console.log(error);
            console.log("test 4");
          }
        }

        if (subscribed && !isSubscribe) {
          setIsSubscribe(true);

          if (userData?.targeted_actions?.subscribe === false) {
            try {
              console.log("test 5");

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
              console.log("test 6");
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
