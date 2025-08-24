import { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function useVKAuth(userId) {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const authVk = async () => {
      await axios
        .get(`/vk/get-token/${userId}`)
        .then((res) => setAccessToken(res.data.token))
        .catch(console.error);
    };

    authVk();
  }, [userId]);

  return { accessToken };
}
