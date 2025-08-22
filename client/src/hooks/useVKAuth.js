import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";
import usePlatform from "./usePlatform";

export default function useVKAuth(userId) {
  const [accessToken, setAccessToken] = useState(null);
  const { isVKMiniApp } = usePlatform();

  useEffect(() => {
    if (!userId) return;

    if (isVKMiniApp) {
      bridge
        .send("VKWebAppGetAuthToken", {
          app_id: Number(process.env.REACT_APP_APP_ID),
          scope: "wall",
        })
        .then((res) => setAccessToken(res.access_token))
        .catch(console.error);
    } else {
      axios
        .get(`/auth/token?user_id=${userId}`)
        .then((res) => setAccessToken(res.data.token))
        .catch(console.error);
    }
  }, [userId, isVKMiniApp]);

  return { accessToken };
}
