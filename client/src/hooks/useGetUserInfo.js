import { useState, useEffect, useCallback } from "react";
import axios from "../utils/axios";
import useVkEnvironment from "./useVkEnvironment";
import bridge from "@vkontakte/vk-bridge";

export const useGetUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { isMiniApp } = useVkEnvironment();

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (isMiniApp) {
      const getUser = async () => {
        setLoading(true);
        try {
          const launchParams = await bridge.send("VKWebAppGetLaunchParams");

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
  }, [isMiniApp, refreshTrigger]);

  return { userInfo, loading, error, refresh };
};
