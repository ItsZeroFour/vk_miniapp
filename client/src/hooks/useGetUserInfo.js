import { useState, useEffect } from "react";
import axios from "../utils/axios";
import useVkEnvironment from "./useVkEnvironment";
import bridge from "@vkontakte/vk-bridge";

export const useGetUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isMiniApp } = useVkEnvironment();

  useEffect(() => {
    if (isMiniApp) {
      const getUser = async () => {
        setLoading(true);
        try {
          const launchParams = await bridge.send("VKWebAppGetLaunchParams");

          console.log("Launch params:", launchParams);

          const response = await axios.get(`/user/get`, {
            params: launchParams,
          });
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
    } else {
      const getUser = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/user/get`);
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
    }
  }, []);

  return { userInfo, loading, error };
};
