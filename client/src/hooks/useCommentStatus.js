import { useEffect, useState, useCallback } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";
import useVkEnvironment from "./useVkEnvironment";

export default function useCommentStatus(accessToken, userId, userData) {
  const [commentStatus, setCommentStatus] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { isMiniApp } = useVkEnvironment();

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

        if (isMiniApp) {
          const launchParams = await bridge.send("VKWebAppGetLaunchParams");
          const res = await axios.get(`/vk/check-comment`, {
            params: launchParams,
          });
          userHasCommented = res.data.hasCommented;
        } else {
          try {
            // const launchParams = await bridge.send("VKWebAppGetLaunchParams");
            const res = await axios.get(`/vk/check-comment`, {
              // params: launchParams,
            });
            userHasCommented = res.data.hasCommented;
          } catch (error) {
            console.log(error);
          }
        }

        if (userHasCommented && !commentStatus) {
          setCommentStatus(true);

          if (userData?.targeted_actions?.comment === false) {
            try {
              const launchParams = await bridge.send("VKWebAppGetLaunchParams");
              await axios.post(
                "/user/update-target",
                {
                  user_id: userId,
                  target_name: "comment",
                  target_value: true,
                },
                {
                  params: launchParams,
                }
              );
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