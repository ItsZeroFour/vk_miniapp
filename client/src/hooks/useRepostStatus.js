import { useEffect, useState, useCallback } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";
import useVkEnvironment from "./useVkEnvironment";

export default function useRepostStatus(accessToken, userId, userData) {
  const [isShared, setIsShared] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { isMiniApp } = useVkEnvironment();

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (userData?.targeted_actions?.share === true) {
      setIsShared(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!userId) return;

    async function checkRepost() {
      try {
        let reposted = false;

        if (isMiniApp) {
          const launchParams = await bridge.send("VKWebAppGetLaunchParams");
          const res = await axios.get(`/vk/check-repost`, {
            params: launchParams,
          });
          reposted = res.data.shared;
        } else {
          try {
            // const launchParams = await bridge.send("VKWebAppGetLaunchParams");
            const res = await axios.get(`/vk/check-repost`, {
              // params: launchParams, // ← ДОБАВЛЕНО: передаем параметры авторизации
            });
            reposted = res.data.shared;
          } catch (error) {
            console.log(error);
          }
        }

        if (reposted && !isShared) {
          setIsShared(true);

          if (userData?.targeted_actions?.share === false) {
            try {
              if (isMiniApp) {
                const launchParams = await bridge.send("VKWebAppGetLaunchParams");
                await axios.post(
                  "/user/update-target",
                  {
                    user_id: userId,
                    target_name: "share",
                    target_value: true,
                  },
                  {
                    params: launchParams,
                  }
                );
              } else {
                await axios.post(
                  "/user/update-target",
                  {
                    user_id: userId,
                    target_name: "share",
                    target_value: true,
                  },
                  {
                    // params: launchParams,
                  }
                );
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (e) {
        console.error("Ошибка при проверке репоста:", e);
        setIsShared(false);
      }
    }

    checkRepost();
  }, [userId, userData, isShared, refreshKey]);

  return { isShared, refresh };
}
