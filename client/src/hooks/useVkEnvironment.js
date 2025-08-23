// React hook — определяет, где запущено приложение: в VK Mini App или в обычном WEB-браузере.
// Алгоритм:
// 1) Быстрая синхронная проверка по URL, referrer и userAgent.
// 2) Попытка динамически импортировать @vkontakte/vk-bridge и инициализировать его — если это сработает, считаем, что это Mini App.
// 3) Возвращает объект { environment, isMiniApp, isBridgeAvailable }.

import { useEffect, useState, useRef } from "react";

export default function useVkEnvironment() {
  const [environment, setEnvironment] = useState("unknown");
  const [isBridgeAvailable, setIsBridgeAvailable] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const detectSync = () => {
      if (typeof window === "undefined") return;

      const ua = navigator && navigator.userAgent ? navigator.userAgent : "";
      const ref = typeof document !== "undefined" ? document.referrer : "";
      const search =
        typeof window !== "undefined" ? window.location.search : "";

      const maybeByQuery =
        /vk_platform|vk_app_id|vk_access_token|vk_access_token_settings/i.test(
          search
        );
      const maybeByReferrer = /vk\.com/i.test(ref);
      const maybeByUA = /vkminiapp|vkontakte|vkshare|vkandroid|vkios|vk/i.test(
        ua
      );

      if (maybeByQuery || maybeByReferrer || maybeByUA) {
        setEnvironment("vk-miniapp");
      } else {
        setEnvironment("web");
      }
    };

    detectSync();

    (async () => {
      try {
        const bridgeModule = await import("@vkontakte/vk-bridge");
        if (!mountedRef.current) return;

        const bridge = bridgeModule.default || bridgeModule;
        if (bridge && typeof bridge.send === "function") {
          try {
            await bridge.send("VKWebAppInit");
          } catch (e) {}

          setIsBridgeAvailable(true);
          setEnvironment("vk-miniapp");
        }
      } catch (err) {}
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    environment,
    isMiniApp: environment === "vk-miniapp",
    isBridgeAvailable,
  };
}
