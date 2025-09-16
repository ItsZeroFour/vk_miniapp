import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";

export default function useUser() {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const launchParams = await bridge.send("VKWebAppGetLaunchParams");
        const { vk_user_id } = launchParams;

        if (vk_user_id) {
          setUserId(vk_user_id);

          const res = await axios.post(
            "/user/auth",
            {},
            { params: launchParams }
          );

          setUserData(res.data);
        }
      } catch (err) {
        console.error("Ошибка авторизации:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return { userId, userData, loading, error };
}
