import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "axios";
import usePlatform from "./usePlatform";

export default function useRepostStatus(userId, userData) {
  const [isShared, setIsShared] = useState(false);
  const { isVKMiniApp } = usePlatform();

  useEffect(() => {
    if (userData?.targeted_actions?.share === true) {
      setIsShared(true);
    }
  }, [userData]);

  useEffect(() => {
    async function checkRepost() {
      try {
        if (isVKMiniApp) {
          const userInfo = await bridge.send("VKWebAppGetUserInfo", {});
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
              v: "5.131",
              access_token: auth.access_token,
            },
          });

          const groupId = -Number(process.env.REACT_APP_GROUP_ID);
          const postId = Number(process.env.REACT_APP_POST_ID);

          const reposted = response.response.items.some((item) => {
            const original = item.copy_history?.[0];
            return (
              original && original.from_id === groupId && original.id === postId
            );
          });

          if (reposted) setIsShared(true);
        } else {
          const token = localStorage.getItem("token");

          const response = await axios.get(
            "https://api.vk.com/method/wall.get",
            {
              params: {
                owner_id: userId,
                count: 100,
                filter: "owner",
                v: "5.131",
                access_token: token,
              },
            }
          );

          const groupId = -Number(process.env.REACT_APP_GROUP_ID);
          const postId = Number(process.env.REACT_APP_POST_ID);

          const reposted = response.data.response.items.some((item) => {
            const original = item.copy_history?.[0];
            return (
              original && original.from_id === groupId && original.id === postId
            );
          });

          if (reposted) setIsShared(true);
        }
      } catch (e) {
        console.error("Ошибка при проверке репоста:", e);
      }
    }

    checkRepost();
  }, [userId, userData, isVKMiniApp]);

  return isShared;
}
