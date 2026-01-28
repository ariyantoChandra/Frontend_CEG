import { useState, useEffect } from "react";
import { INITIAL_TARGET_ID } from "../constants/gameConfig";
import { hasVisited, markAsVisited } from "../utils/storage";

/**
 * Custom hook for managing game state
 * @returns {Object} Game state and handlers
 */
export const useGameState = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [completedEquipments, setCompletedEquipments] = useState([]);
  const [nextTargetId, setNextTargetId] = useState(INITIAL_TARGET_ID);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check if user has visited before
  useEffect(() => {
    if (!hasVisited()) {
      setShowWelcomeDialog(true);
      markAsVisited();
    }
  }, []);

  const resetQuestionState = () => {
    setSelectedEquipment(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsDialogOpen(false);
  };

  const handleEquipmentClick = (equipment, onError) => {
    if (equipment.id !== nextTargetId) {
      setErrorType("equipment");
      onError();
      return false;
    }

    setSelectedEquipment(equipment);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsDialogOpen(true);
    return true;
  };

  const handleAnswerSelect = (index) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = (onError) => {
    if (!selectedEquipment || selectedAnswer === null) return;

    const isCorrect = selectedEquipment.options[selectedAnswer]?.correct;

    if (!isCorrect) {
      resetQuestionState();
      setErrorType("answer");
      onError();
      return false;
    }

    setShowResult(true);
    return true;
  };

  const handleAnswerCorrect = () => {
    if (selectedEquipment) {
      setCompletedEquipments((prev) => [...prev, selectedEquipment.id]);
      setNextTargetId((prev) => prev + 1);
      resetQuestionState();
    }
  };

  const showError = (type) => {
    setErrorType(type);
    setShowErrorDialog(true);
  };

  const closeErrorDialog = (onCountdownStart) => {
    setShowErrorDialog(false);
    onCountdownStart();
  };

  return {
    // State
    selectedEquipment,
    selectedAnswer,
    showResult,
    showWelcomeDialog,
    showErrorDialog,
    errorType,
    completedEquipments,
    nextTargetId,
    isDialogOpen,

    // Setters
    setShowWelcomeDialog,
    setIsDialogOpen,

    // Handlers
    handleEquipmentClick,
    handleAnswerSelect,
    handleSubmitAnswer,
    handleAnswerCorrect,
    showError,
    closeErrorDialog,
    resetQuestionState,
  };
};
