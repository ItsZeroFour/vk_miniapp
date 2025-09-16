import { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function useVKAuth() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const authVk = async () => {
      await axios
        .get(`/vk/get-token`)
        .then((res) => setAccessToken(res.data.token))
        .catch(console.error);
    };

    authVk();
  }, []);

  return { accessToken };
}
