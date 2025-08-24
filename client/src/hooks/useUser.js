import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "../utils/axios";

export default function useUser() {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    bridge
      .send("VKWebAppGetUserInfo")
      .then((data) => setUserId(data.id))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const authUser = async () => {
      await axios
        .post("/user/auth", { user_id: userId })
        .then((res) => setUserData(res.data))
        .catch(console.error);
    };

    authUser();
  }, [userId]);

  return { userId, userData };
}
