export const sortTheProcessQuestionStorageKey = (gameSessionId) =>
  `sort_the_process_question_${gameSessionId}`;

export const clearGameStorage = (gameSessionId) => {
  localStorage.removeItem("gameStatus");
  localStorage.removeItem("game_data");
  if (gameSessionId) {
    localStorage.removeItem(sortTheProcessQuestionStorageKey(gameSessionId));
  }
};
