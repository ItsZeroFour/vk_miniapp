import { useCallback } from "react";
import axios from "../utils/axios";

const useCompleteGame = () => {
  const completeGame = useCallback(async (gameName) => {
    try {
      await axios.post("/user/complete-game", {
        gameName,
      });

      return { success: true };
    } catch (err) {
      console.error("Game completion error:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Unknown error",
      };
    }
  }, []);

  return completeGame;
};

export default useCompleteGame;
