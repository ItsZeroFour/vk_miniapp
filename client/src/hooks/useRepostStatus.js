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
    if (userData?.targeted_actions?.share === true) {
      setIsShared(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!userId) return;

    async function checkRepost() {
      try {
        let reposted = false;

        if (isVkMiniApp()) {
          const userInfo = await bridge.send("VKWebAppGetUserInfo");
          const auth = await bridge.send("VKWebAppGetAuthToken", {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: "wall",
          });

          const response = await bridge.send("VKWebAppCallAPIMethod", {
            method: "wall.get",
            params: {
              owner_id: userInfo.id,
              count: 100,
              filter: "owner",
              access_token: auth.access_token,
              v: "5.131",
            },
          });

          const groupId = -Number(process.env.REACT_APP_GROUP_ID);
          const postId = Number(process.env.REACT_APP_POST_ID);

          reposted = response.response.items.some((item) => {
            const original = item.copy_history?.[0];
            return (
              original && original.from_id === groupId && original.id === postId
            );
          });
        } else {
          try {
            const res = await axios.get(`/vk/check-repost/${userId}`);
            reposted = res.data.shared;
          } catch (error) {
            console.log(error);
          }
        }

        if (reposted && !isShared) {
          setIsShared(true);

          if (userData?.targeted_actions?.share === false) {
            try {
              await axios.post("/user/update-target", {
                user_id: userId,
                target_name: "share",
                target_value: true,
              });
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
