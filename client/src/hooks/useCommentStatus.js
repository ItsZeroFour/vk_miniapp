import { useEffect, useState, useCallback } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";
import { isVkMiniApp } from "../utils/isVkMiniApp";

export default function useCommentStatus(accessToken, userId, userData) {
  const [commentStatus, setCommentStatus] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (userData?.targeted_actions?.comment) {
      setCommentStatus(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!userId) return;

    async function checkComments() {
      try {
        let userHasCommented = false;

        if (isVkMiniApp()) {
          const response = await bridge.send("VKWebAppCallAPIMethod", {
            method: "wall.getComments",
            params: {
              owner_id: -Number(process.env.REACT_APP_GROUP_ID),
              post_id: Number(process.env.REACT_APP_POST_ID_COMMENT),
              count: 100,
              v: "5.131",
              access_token: accessToken,
            },
          });

          userHasCommented = response.response.items.some(
            (c) => c.from_id === Number(userId)
          );
        } else {
          try {
            const res = await axios.get(`/vk/check-comment/${userId}`);
            userHasCommented = res.data.hasCommented;
          } catch (error) {
            console.log(error);
          }
        }

        if (userHasCommented && !commentStatus) {
          setCommentStatus(true);

          if (userData?.targeted_actions?.comment === false) {
            try {
              await axios.post("/user/update-target", {
                user_id: userId,
                target_name: "comment",
                target_value: true,
              });
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (err) {
        console.error("Ошибка проверки комментария:", err);
      }
    }

    checkComments();
  }, [accessToken, userId, userData, commentStatus, refreshKey]);

  return { isCommented: commentStatus, refresh };
}
