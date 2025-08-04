import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";

export default function useRepostStatus(userId, userData) {
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (userData?.targeted_actions?.share === true) {
      setIsShared(true);
    }
  }, [userData]);

  useEffect(() => {
    async function checkRepost() {
      try {
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
            access_token: auth.access_token,
            v: "5.131",
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

        if (reposted && !isShared) {
          setIsShared(true);

          if (userData?.targeted_actions?.share === false) {
            try {
              const res = await axios.post("/user/update-target", {
                user_id: userId,
                target_name: "share",
                target_value: true,
              });
              console.log(res.data);
            } catch (err) {
              console.error("Ошибка при обновлении share:", err);
            }
          }
        }
      } catch (e) {
        console.error("Ошибка при проверке репоста:", e);
        setIsShared(false);
      }
    }

    checkRepost();
  }, [userId, userData, isShared]);

  return isShared;
}
