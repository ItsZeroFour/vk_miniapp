// useVkEnvironment.js
// React hook — определяет, где запущено приложение: в VK Mini App или в обычном WEB-браузере.
// Алгоритм:
// 1) Быстрая синхронная проверка по URL, referrer и userAgent.
// 2) Попытка динамически импортировать @vkontakte/vk-bridge и инициализировать его — если это сработает, считаем, что это Mini App.
// 3) Возвращает объект { environment, isMiniApp, isBridgeAvailable }.

import { useEffect, useState, useRef } from "react";

export default function useVkEnvironment() {
  const [environment, setEnvironment] = useState("unknown"); // 'vk-miniapp' | 'web' | 'unknown'
  const [isBridgeAvailable, setIsBridgeAvailable] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const detectSync = () => {
      if (typeof window === "undefined") return;

      const ua = (navigator && navigator.userAgent) ? navigator.userAgent : "";
      const ref = typeof document !== "undefined" ? document.referrer : "";
      const search = typeof window !== "undefined" ? window.location.search : "";

      // Признаки, которые часто встречаются для запуска внутри VK:
      // - параметры в query (vk_platform, vk_app_id, access_token и т.д.)
      // - referrer с vk.com
      // - userAgent содержит упоминание VK или VKMiniApp
      const maybeByQuery = /vk_platform|vk_app_id|vk_access_token|vk_access_token_settings/i.test(search);
      const maybeByReferrer = /vk\.com/i.test(ref);
      const maybeByUA = /vkminiapp|vkontakte|vkshare|vkandroid|vkios|vk/i.test(ua);

      if (maybeByQuery || maybeByReferrer || maybeByUA) {
        setEnvironment("vk-miniapp");
      } else {
        setEnvironment("web");
      }
    };

    detectSync();

    // Асинхронная проверка — пытаемся подключить vk-bridge и инициализировать его.
    // Если библиотека присутствует и отвечает, это надёжный признак запуска внутри Mini App.
    (async () => {
      try {
        // Динамический импорт: если пакет не установлен на вебе, импорт бросит ошибку.
        const bridgeModule = await import("@vkontakte/vk-bridge");
        if (!mountedRef.current) return;

        const bridge = bridgeModule.default || bridgeModule;
        if (bridge && typeof bridge.send === "function") {
          // Попробуем безопасно вызвать инициализацию — некоторые окружения требуют VKWebAppInit.
          try {
            // Не блокируем основной результат — если send упадёт, просто пометим, что bridge доступен.
            await bridge.send("VKWebAppInit");
          } catch (e) {
            // Игнорируем ошибки и считаем bridge доступным всё равно.
          }

          setIsBridgeAvailable(true);
          setEnvironment("vk-miniapp");
        }
      } catch (err) {
        // Импорт не удался — скорее всего обычный WEB.
        // Ничего делать не нужно.
      }
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
