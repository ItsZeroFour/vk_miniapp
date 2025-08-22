import bridge from "@vkontakte/vk-bridge";

export default function usePlatform() {
  const isVKMiniApp = bridge.isWebView();
  return { isVKMiniApp };
}
