import { STORAGE_KEYS } from "../constants/gameConfig";

export const getSavedCountdown = () => {
  const savedCountdown = localStorage.getItem(STORAGE_KEYS.COUNTDOWN);
  const savedTimestamp = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);

  if (!savedCountdown || !savedTimestamp) {
    return 0;
  }

  const now = Date.now();
  const savedTime = parseInt(savedTimestamp);
  const elapsed = Math.floor((now - savedTime) / 1000);
  const remaining = Math.max(0, parseInt(savedCountdown) - elapsed);

  return remaining;
};

export const saveCountdown = (countdown) => {
  localStorage.setItem(STORAGE_KEYS.COUNTDOWN, countdown.toString());
  localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
};

export const clearCountdown = () => {
  localStorage.removeItem(STORAGE_KEYS.COUNTDOWN);
  localStorage.removeItem(STORAGE_KEYS.TIMESTAMP);
};

export const hasVisited = () => {
  return localStorage.getItem(STORAGE_KEYS.VISITED) === "true";
};

export const markAsVisited = () => {
  localStorage.setItem(STORAGE_KEYS.VISITED, "true");
};

export const hasGameStarted = () => {
  return localStorage.getItem(STORAGE_KEYS.GAME_STARTED) === "true";
};

export const markGameAsStarted = () => {
  localStorage.setItem(STORAGE_KEYS.GAME_STARTED, "true");
};

export const clearGameStarted = () => {
  localStorage.removeItem(STORAGE_KEYS.GAME_STARTED);
};

export const saveEquipmentSequence = (sequence) => {
  localStorage.setItem(STORAGE_KEYS.EQUIPMENT_SEQUENCE, JSON.stringify(sequence));
};

export const getEquipmentSequence = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT_SEQUENCE);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
};
