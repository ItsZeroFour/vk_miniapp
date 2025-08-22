import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";
import usePlatform from "./usePlatform";

export default function useCommentStatus(accessToken, userId, userData) {
  const [commentStatus, setCommentStatus] = useState(false);
  const { isVKMiniApp } = usePlatform();

  useEffect(() => {
    if (userData?.targeted_actions?.comment) {
      setCommentStatus(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!userId) return;

    async function checkComments() {
      try {
        if (isVKMiniApp) {
          const response = await bridge.send("VKWebAppCallAPIMethod", {
            method: "wall.getComments",
            params: {
              owner_id: Number(`-${process.env.REACT_APP_GROUP_ID}`),
              post_id: Number(process.env.REACT_APP_POST_ID),
              count: 100,
              v: "5.131",
              access_token: accessToken,
            },
          });

          const userHasCommented = response.response.items.some(
            (c) => c.from_id === Number(userId)
          );
          if (userHasCommented) setCommentStatus(true);
        } else {
          const res = await axios.get(`/user/check-comment/${userId}`);
          if (res.data.hasCommented) setCommentStatus(true);
        }
      } catch (err) {
        console.error("Ошибка проверки комментариев:", err);
      }
    }

    checkComments();
  }, [accessToken, userId, userData, isVKMiniApp]);

  return commentStatus;
}
