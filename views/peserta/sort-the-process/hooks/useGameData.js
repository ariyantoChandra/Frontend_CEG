import useSWR from "swr";
import * as API from "@/core/services/api";

export const useGameData = (gameSessionId) => {
  const { data, error, isLoading } = useSWR(
    gameSessionId ? ["sort-the-process-items", gameSessionId] : null,
    async () => {
      if (!gameSessionId) return null;
      try {
        const response = await API.sortTheProcess.getItemsQuestion({
          game_session_id: gameSessionId,
        });
        return response?.data?.data || null;
      } catch (err) {
        console.error("Error fetching items:", err);
        throw err;
      }
    }
  );

  return { data, error, isLoading };
};
