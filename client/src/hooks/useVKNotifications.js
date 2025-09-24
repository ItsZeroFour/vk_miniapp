// hooks/useVKNotifications.js
import { useState, useCallback } from 'react';
import bridge from '@vkontakte/vk-bridge';

export const useVKNotifications = () => {
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkPermission = useCallback(async () => {
    try {
      const result = await bridge.send('VKWebAppGetUserInfo');
      return true;
    } catch (err) {
      return false;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await bridge.send('VKWebAppAllowNotifications');
      
      if (result.result) {
        setIsAllowed(true);
        return { success: true };
      } else {
        setError('Пользователь отказал в разрешении');
        return { success: false, error: 'denied' };
      }
    } catch (error) {
      let errorMessage = 'Произошла ошибка';
      
      switch (error.error_data?.error_code) {
        case 1:
          errorMessage = 'Метод недоступен';
          break;
        case 4:
          errorMessage = 'Пользователь отклонил запрос';
          break;
        default:
          errorMessage = error.error_data?.error_msg || 'Неизвестная ошибка';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isAllowed,
    isLoading,
    error,
    requestPermission,
    checkPermission,
  };
};