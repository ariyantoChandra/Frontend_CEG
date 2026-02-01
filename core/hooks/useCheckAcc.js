import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import * as API from "@/core/services/api";

const getGameSessionId = () => {
  try {
    const gameData = localStorage.getItem("game_data");
    if (!gameData) return null;
    try {
      const parsed = JSON.parse(gameData);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed.game_session_id || null;
      }
      return null;
    } catch {
      return null;
    }
  } catch (err) {
    console.error("Error reading game_data:", err);
    return null;
  }
};

export function useCheckGameSession() {
  const router = useRouter();
  const gameSessionId = useMemo(() => getGameSessionId(), []);

  const { data, error, mutate } = useSWR(
    gameSessionId ? ["check-game-session", gameSessionId] : null,
    async () => {
      if (!gameSessionId) return null;
      try {
        const response = await API.rally.checkGameSession({ gamesession: gameSessionId });
        return response?.data;
      } catch (err) {
        return { success: false, data: false };
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    if (data?.data === false) {
      clearGameLocalStorage();
      router.push("/rally");
    }
  }, [data, router]);

  return { data, error, mutate };
}

function clearGameLocalStorage() {
  try {
    const keysToKeep = ["user", "role", "token", "user_id"];
    const allKeys = Object.keys(localStorage);

    allKeys.forEach((key) => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (err) {
    console.error("Error clearing localStorage:", err);
  }
}
