import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";

export default function useVKAuth(userId) {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (!userId) return;

    bridge
      .send("VKWebAppGetAuthToken", {
        app_id: Number(process.env.REACT_APP_APP_ID),
        scope: "wall",
      })
      .then((res) => setAccessToken(res.access_token))
      .catch(console.error);
  }, [userId]);

  return { accessToken };
}
