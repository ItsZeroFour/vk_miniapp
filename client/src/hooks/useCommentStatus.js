import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";

export default function useCommentStatus(accessToken, userId, userData) {
  const [commentStatus, setCommentStatus] = useState(false);

  useEffect(() => {
    if (userData?.targeted_actions?.comment === true) {
      setCommentStatus(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!accessToken || !userId) return;

    const alreadyCommentedInDB = userData?.targeted_actions?.comment === true;
    if (alreadyCommentedInDB) return;

    const loadAllComments = async (offset = 0, allComments = []) => {
      try {
        const response = await bridge.send("VKWebAppCallAPIMethod", {
          method: "wall.getComments",
          params: {
            owner_id: Number(`-${process.env.REACT_APP_GROUP_ID}`),
            post_id: 1,
            need_likes: 0,
            count: 100,
            offset,
            v: "5.131",
            access_token: accessToken,
          },
        });

        if (response.error) {
          console.error("Ошибка VK API:", response.error.error_msg);
          return [];
        }

        const newComments = response.response.items;
        const total = response.response.count;
        const acc = [...allComments, ...newComments];

        if (acc.length < total) {
          return loadAllComments(offset + 100, acc);
        }

        return acc;
      } catch (error) {
        console.error("Ошибка загрузки комментариев:", error);
        return [];
      }
    };

    async function checkAndUpdateCommentStatus() {
      const comments = await loadAllComments();
      const userHasCommented = comments.some((c) => c.from_id === userId);

      if (userHasCommented) {
        try {
          const res = await axios.post("/user/update-target", {
            user_id: userId,
            target_name: "comment",
            target_value: true,
          });
          console.log(res.data);
          setCommentStatus(true);
        } catch (err) {
          console.error("Ошибка обновления comment в БД:", err);
        }
      }
    }

    checkAndUpdateCommentStatus();
  }, [accessToken, userId, userData]);

  return commentStatus;
}
