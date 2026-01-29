import { useState, useEffect } from "react";
import { INITIAL_TARGET_ID } from "../constants/gameConfig";
import { hasVisited, markAsVisited, getEquipmentSequence, saveEquipmentSequence } from "../utils/storage";
import { getGameSessionId } from "../utils/getGameSessionId";
import * as API from "@/core/services/api";

export const useGameState = (equipmentList = []) => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswerText, setSelectedAnswerText] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [welcomeEquipmentName, setWelcomeEquipmentName] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [completedEquipments, setCompletedEquipments] = useState([]);
  const [nextTargetId, setNextTargetId] = useState(INITIAL_TARGET_ID);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const gameSessionId = getGameSessionId();

  useEffect(() => {
    if (equipmentList.length > 0) {
      const savedSequence = getEquipmentSequence();
      if (!savedSequence) {
        const sequence = equipmentList.map((eq) => eq.id).sort((a, b) => a - b);
        saveEquipmentSequence(sequence);
        setNextTargetId(sequence[0]);
        
        const firstEquipment = equipmentList.find((eq) => eq.id === sequence[0]);
        if (firstEquipment) {
          setWelcomeEquipmentName(firstEquipment.name);
          setShowWelcomeDialog(true);
          markAsVisited();
        }
      } else {
        if (savedSequence.length > 0) {
          setNextTargetId(savedSequence[0]);
        }
        
        const currentTarget = equipmentList.find((eq) => eq.id === savedSequence[0]);
        if (currentTarget && !hasVisited()) {
          setWelcomeEquipmentName(currentTarget.name);
          setShowWelcomeDialog(true);
          markAsVisited();
        }
      }
    }
  }, [equipmentList]);

  const resetQuestionState = () => {
    setSelectedEquipment(null);
    setSelectedAnswer(null);
    setSelectedAnswerText(null);
    setShowResult(false);
    setIsDialogOpen(false);
    setQuestion(null);
    setOptions([]);
  };

  const handleEquipmentClick = async (equipment, onError) => {
    const sequence = getEquipmentSequence();
    const currentTargetId = sequence && sequence.length > 0 ? sequence[0] : nextTargetId;
    
    if (equipment.id !== currentTargetId) {
      setErrorMessage("Alat yang kamu pilih salah");
      onError();
      return false;
    }

    setSelectedEquipment(equipment);
    setSelectedAnswer(null);
    setSelectedAnswerText(null);
    setShowResult(false);
    setIsLoadingQuestion(true);
    setIsDialogOpen(true);

    try {
      const response = await API.chemicalPlantBattle.getToolQuestion({
        game_session_id: gameSessionId,
        toolId: equipment.id,
      });

      if (response?.data?.success && response?.data?.data) {
        const questionData = Array.isArray(response.data.data) 
          ? response.data.data[0] 
          : response.data.data;
        
        if (questionData) {
          setQuestion(questionData.question_text || "");
          
          const optionsArray = [];
          if (questionData.option_a) optionsArray.push(questionData.option_a);
          if (questionData.option_b) optionsArray.push(questionData.option_b);
          if (questionData.option_c) optionsArray.push(questionData.option_c);
          if (questionData.option_d) optionsArray.push(questionData.option_d);
          
          setOptions(optionsArray);
        }
      }
    } catch (err) {
      console.error("Error fetching question:", err);
    } finally {
      setIsLoadingQuestion(false);
    }

    return true;
  };

  const handleAnswerSelect = (index, answerText) => {
    if (!showResult) {
      setSelectedAnswer(index);
      setSelectedAnswerText(answerText);
    }
  };

  const handleSubmitAnswer = async (onError) => {
    if (!selectedEquipment || selectedAnswerText === null) return;

    try {
      const response = await API.chemicalPlantBattle.getToolAnswer({
        game_session_id: gameSessionId,
        answer: selectedAnswerText,
        toolId: selectedEquipment.id,
      });

      const isCorrect = response?.data?.success && response?.data?.data?.correct === true;

      if (!isCorrect) {
        resetQuestionState();
        setErrorMessage("Jawaban yang kamu pilih salah");
        onError();
        return false;
      }

      setShowResult(true);
      return true;
    } catch (err) {
      console.error("Error submitting answer:", err);
      resetQuestionState();
      setErrorMessage("Jawaban yang kamu pilih salah");
      onError();
      return false;
    }
  };

  const handleAnswerCorrect = () => {
    if (selectedEquipment) {
      setCompletedEquipments((prev) => [...prev, selectedEquipment.id]);
      
      resetQuestionState();
      
      const sequence = getEquipmentSequence();
      if (sequence) {
        const newSequence = sequence.filter((id) => id !== selectedEquipment.id);
        saveEquipmentSequence(newSequence);
        
        if (newSequence.length > 0) {
          setNextTargetId(newSequence[0]);
          
          setTimeout(() => {
            const nextEquipment = equipmentList.find((eq) => eq.id === newSequence[0]);
            if (nextEquipment) {
              setWelcomeEquipmentName(nextEquipment.name);
              setShowWelcomeDialog(true);
            }
          }, 300);
        }
      }
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  return {
    // State
    selectedEquipment,
    selectedAnswer,
    showResult,
    showWelcomeDialog,
    welcomeEquipmentName,
    errorMessage,
    completedEquipments,
    nextTargetId,
    isDialogOpen,
    question,
    options,
    isLoadingQuestion,

    // Setters
    setShowWelcomeDialog,
    setIsDialogOpen,

    // Handlers
    handleEquipmentClick,
    handleAnswerSelect,
    handleSubmitAnswer,
    handleAnswerCorrect,
    clearErrorMessage,
    resetQuestionState,
  };
};
