import { useState, useEffect } from "react";
import axios from "../utils/axios";

export const useGetUserInfo = (userId) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const getUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/get/${userId}`);
        if (response.status === 200) {
          setUserInfo(response.data);
        }
      } catch (err) {
        setError(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [userId]);

  return { userInfo, loading, error };
};
