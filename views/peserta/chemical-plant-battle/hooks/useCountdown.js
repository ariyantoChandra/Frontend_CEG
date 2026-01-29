import { useState, useEffect } from "react";
import { COUNTDOWN_DURATION } from "../constants/gameConfig";
import { getSavedCountdown, saveCountdown, clearCountdown } from "../utils/storage";

export const useCountdown = (onCountdownEnd) => {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const saved = getSavedCountdown();
    if (saved > 0) {
      setCountdown(saved);
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newCountdown = prev - 1;
          saveCountdown(newCountdown);

          if (newCountdown <= 0) {
            clearCountdown();
            if (onCountdownEnd) {
              onCountdownEnd();
            }
            return 0;
          }
          return newCountdown;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown, onCountdownEnd]);

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
