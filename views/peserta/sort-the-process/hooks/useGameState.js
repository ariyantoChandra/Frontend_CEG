import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import * as API from "@/core/services/api";
import { sortTheProcessQuestionStorageKey } from "../utils/storage";

export const useGameState = (data, gameSessionId) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [placements, setPlacements] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!data?.questions?.length || !gameSessionId || selectedQuestion) return;

    const questions = data.questions;
    const storageKey = sortTheProcessQuestionStorageKey(gameSessionId);
    const raw = localStorage.getItem(storageKey);
    const storedId = raw != null ? Number(raw) : NaN;
    const fromStorage =
      !Number.isNaN(storedId) ? questions.find((q) => q.id === storedId) : null;

    if (fromStorage) {
      setSelectedQuestion(fromStorage);
      return;
    }

    const index = Math.floor(Math.random() * questions.length);
    const picked = questions[index];
    localStorage.setItem(storageKey, String(picked.id));
    setSelectedQuestion(picked);
  }, [data, gameSessionId, selectedQuestion]);

  useEffect(() => {
    if (selectedQuestion) {
      const initialPlacements = {};
      for (let i = 1; i <= selectedQuestion.kotak; i++) {
        initialPlacements[`slot${i}`] = null;
      }
      setPlacements(initialPlacements);
      setIsSubmitted(false);
    }
  }, [selectedQuestion]);

  const processesConfig = useMemo(() => {
    if (!selectedQuestion) return null;

    const processes = [];
    for (let i = 1; i <= selectedQuestion.kotak; i++) {
      processes.push({
        id: i,
        slotId: `slot${i}`,
        label: `Proses ${i}`,
      });
    }
    return processes;
  }, [selectedQuestion]);

  const handleItemClick = useCallback((itemId, slotId) => {
    if (isSubmitted) return;
    setPlacements((prev) => ({ ...prev, [slotId]: itemId }));
  }, [isSubmitted]);

  const handleSubmit = useCallback(async () => {
    if (!selectedQuestion || !gameSessionId) return;

    const answer = [];
    for (let i = 1; i <= selectedQuestion.kotak; i++) {
      answer.push({
        urutan_kotak: i,
        id_barang: placements[`slot${i}`] || null,
      });
    }

    try {
      const response = await API.sortTheProcess.postResult({
        game_session_id: gameSessionId,
        question_id: selectedQuestion.id,
        answer: answer,
      });

      if (response?.data?.success) {
        setIsSubmitted(true);
        toast.success("Jawaban berhasil dikirim!");
      } else {
        throw new Error("Gagal mengirim jawaban");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal mengirim jawaban");
      console.error("Error submitting:", err);
    }
  }, [selectedQuestion, gameSessionId, placements]);

  const getItemById = useCallback((itemId) => {
    return data?.items?.find((item) => item.id === itemId);
  }, [data]);

  const allSlotsFilled = useMemo(() => {
    if (!selectedQuestion) return false;
    for (let i = 1; i <= selectedQuestion.kotak; i++) {
      if (!placements[`slot${i}`]) return false;
    }
    return true;
  }, [selectedQuestion, placements]);

  return {
    selectedQuestion,
    placements,
    isSubmitted,
    processesConfig,
    allSlotsFilled,
    handleItemClick,
    handleSubmit,
    getItemById,
  };
};
