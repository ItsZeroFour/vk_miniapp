import { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function useVKAuth(userId) {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/vk/get-token/${userId}`)
      .then((res) => setAccessToken(res.data.token))
      .catch(console.error);
  }, [userId]);

  return { accessToken };
}
