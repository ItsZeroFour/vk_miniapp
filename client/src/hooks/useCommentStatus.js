import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "axios";
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
    if (!userId || !accessToken) return;

    async function loadAllComments(offset = 0, allComments = []) {
      try {
        if (isVKMiniApp) {
          const response = await bridge.send("VKWebAppCallAPIMethod", {
            method: "wall.getComments",
            params: {
              owner_id: -Number(process.env.REACT_APP_GROUP_ID),
              post_id: Number(process.env.REACT_APP_POST_ID),
              count: 100,
              offset,
              v: "5.131",
              access_token: accessToken,
            },
          });

          const newComments = response.response.items;
          const total = response.response.count;
          const acc = [...allComments, ...newComments];

          if (acc.length < total) {
            return loadAllComments(offset + 100, acc);
          }

          return acc;
        } else {
          const response = await axios.get(
            "https://api.vk.com/method/wall.getComments",
            {
              params: {
                owner_id: -Number(process.env.REACT_APP_GROUP_ID),
                post_id: Number(process.env.REACT_APP_POST_ID),
                count: 100,
                offset,
                v: "5.131",
                access_token: accessToken,
              },
            }
          );

          const newComments = response.data.response.items;
          const total = response.data.response.count;
          const acc = [...allComments, ...newComments];

          if (acc.length < total) {
            return loadAllComments(offset + 100, acc);
          }

          return acc;
        }
      } catch (error) {
        console.error("Ошибка загрузки комментариев:", error);
        return [];
      }
    }

    loadAllComments().then((comments) => {
      const userHasCommented = comments.some(
        (c) => c.from_id === Number(userId)
      );
      if (userHasCommented) setCommentStatus(true);
    });
  }, [accessToken, userId, userData, isVKMiniApp]);

  return commentStatus;
}
