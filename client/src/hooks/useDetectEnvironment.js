import { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";

export function useDetectEnvironment() {
  const [environment, setEnvironment] = useState("loading");

  useEffect(() => {
    async function detectEnvironment() {
      try {
        await bridge.send("VKWebAppInit");
        console.log("Пользователь в VK Mini App");
        setEnvironment("vk-mini-app");
      } catch (error) {
        console.log("Пользователь в Web");
        setEnvironment("web");
      }
    }

    detectEnvironment();
  }, []);

  return environment;
}
