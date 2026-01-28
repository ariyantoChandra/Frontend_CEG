import { useState, useEffect } from "react";
import { COUNTDOWN_DURATION } from "../constants/gameConfig";
import { getSavedCountdown, saveCountdown, clearCountdown } from "../utils/storage";

/**
 * Custom hook for managing countdown timer with localStorage persistence
 * @returns {Object} { countdown, startCountdown, isActive }
 */
export const useCountdown = () => {
  const [countdown, setCountdown] = useState(0);

  // Initialize countdown from localStorage on mount
  useEffect(() => {
    const saved = getSavedCountdown();
    if (saved > 0) {
      setCountdown(saved);
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newCountdown = prev - 1;
          saveCountdown(newCountdown);

          if (newCountdown <= 0) {
            clearCountdown();
            return 0;
          }
          return newCountdown;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(COUNTDOWN_DURATION);
    saveCountdown(COUNTDOWN_DURATION);
  };

  return {
    countdown,
    startCountdown,
    isActive: countdown > 0,
  };
};
