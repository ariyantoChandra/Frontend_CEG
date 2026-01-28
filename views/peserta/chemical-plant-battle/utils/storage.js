import { STORAGE_KEYS } from "../constants/gameConfig";

/**
 * Get countdown from localStorage and calculate remaining time
 * @returns {number} Remaining countdown seconds, or 0 if expired
 */
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

/**
 * Save countdown to localStorage
 * @param {number} countdown - Countdown value to save
 */
export const saveCountdown = (countdown) => {
  localStorage.setItem(STORAGE_KEYS.COUNTDOWN, countdown.toString());
  localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
};

/**
 * Clear countdown from localStorage
 */
export const clearCountdown = () => {
  localStorage.removeItem(STORAGE_KEYS.COUNTDOWN);
  localStorage.removeItem(STORAGE_KEYS.TIMESTAMP);
};

/**
 * Check if user has visited before
 * @returns {boolean}
 */
export const hasVisited = () => {
  return localStorage.getItem(STORAGE_KEYS.VISITED) === "true";
};

/**
 * Mark user as visited
 */
export const markAsVisited = () => {
  localStorage.setItem(STORAGE_KEYS.VISITED, "true");
};
