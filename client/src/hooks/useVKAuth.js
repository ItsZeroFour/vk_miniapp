import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";

export default function useVKAuth() {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authVk = async () => {
      try {
        const launchParams = await bridge.send("VKWebAppGetLaunchParams");
        const { vk_user_id, sign } = launchParams;

        if (vk_user_id && sign) {
          setUserId(vk_user_id);

          await axios.post("/user/auth", {}, { params: launchParams });
        }

        const tokenRes = await axios.get(
          "/vk/get-token",
          {},
          { params: launchParams }
        );

        console.log(tokenRes);

        if (tokenRes.data?.token) {
          setAccessToken(tokenRes.data.token);
        }
      } catch (err) {
        console.error("Ошибка в useVKAuth:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    authVk();
  }, []);

  return { accessToken, userId, loading, error };
}
