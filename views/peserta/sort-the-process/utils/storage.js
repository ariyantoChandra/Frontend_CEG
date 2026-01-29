export const clearGameStorage = () => {
  localStorage.removeItem("gameStatus");
  localStorage.removeItem("game_data");
};
