export const getGameSessionId = () => {
  try {
    const gameData = localStorage.getItem("game_data");
    if (!gameData) return null;

    try {
      const parsed = JSON.parse(gameData);
      if (typeof parsed === "object" && parsed !== null) {
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
