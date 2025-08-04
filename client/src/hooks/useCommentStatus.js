import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";

export default function useCommentStatus(accessToken, userId, userData) {
  const [commentStatus, setCommentStatus] = useState(false);

  useEffect(() => {
    if (userData?.targeted_actions?.comment) {
      setCommentStatus(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!accessToken || !userId) return;

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
        console.error("Ошибка запроса:", error);
        return [];
      }
    };

    loadAllComments().then((comments) => {
      const userHasCommented = comments.some((c) => c.from_id === userId);

      if (userHasCommented && !commentStatus) {
        setCommentStatus(true);

        if (userData?.targeted_actions?.comment === false) {
          async function updateCommentTargetStatus() {
            try {
              const res = await axios.post("/user/update-target", {
                user_id: userId,
                target_name: "comment",
                target_value: true,
              });
              console.log(res.data);
            } catch (err) {
              console.error(err);
            }
          }

          updateCommentTargetStatus();
        }
      }
    });
  }, [accessToken, userId, userData, commentStatus]);

  return commentStatus;
}
