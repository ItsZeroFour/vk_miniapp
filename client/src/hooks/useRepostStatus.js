import { useEffect, useState, useCallback } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";
import { isVkMiniApp } from "../utils/isVkMiniApp";

export default function useRepostStatus(accessToken, userId, userData) {
  const [isShared, setIsShared] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (userData?.targeted_actions?.share) {
      setIsShared(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!userId) return;

    async function checkRepost() {
      try {
        let reposted = false;

        if (isVkMiniApp()) {
          // Проверка через VK Bridge
          const groupId = -Number(process.env.REACT_APP_GROUP_ID);
          const postId = Number(process.env.REACT_APP_POST_ID);

          const response = await bridge.send("VKWebAppCallAPIMethod", {
            method: "wall.getReposts",
            params: {
              owner_id: groupId,
              post_id: postId,
              count: 100,
              v: "5.131",
              access_token: accessToken,
            },
          });

          reposted = response.response.items.some(
            (r) => r.from_id === Number(userId)
          );
        } else {
          // Проверка через сервер
          const launchParams = await bridge.send("VKWebAppGetLaunchParams");
          const res = await axios.get("/vk/check-repost", {
            params: launchParams,
          });
          reposted = res.data.shared;
        }

        if (reposted && !isShared) {
          setIsShared(true);

          if (userData?.targeted_actions?.share === false) {
            try {
              const launchParams = await bridge.send("VKWebAppGetLaunchParams");
              await axios.post(
                "/user/update-target",
                { target_name: "share", target_value: true },
                { params: launchParams }
              );
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (err) {
        console.error("Ошибка проверки репоста:", err);
      }
    }

    checkRepost();
  }, [accessToken, userId, userData, isShared, refreshKey]);

  return { isShared, refresh };
}
