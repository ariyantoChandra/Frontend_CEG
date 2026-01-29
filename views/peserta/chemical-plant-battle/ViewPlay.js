"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import * as API from "@/core/services/api";
import { useCountdown } from "./hooks/useCountdown";
import { useGameState } from "./hooks/useGameState";
import { clearGameStarted, clearAllGameData, getEquipmentSequence } from "./utils/storage";
import { getGameSessionId } from "./utils/getGameSessionId";
import { mapEquipmentData } from "./utils/mapEquipmentData";
import GameHeader from "./_components/GameHeader";
import EquipmentCard from "./_components/EquipmentCard";
import WelcomeDialog from "./_components/WelcomeDialog";
import QuestionDialog from "./_components/QuestionDialog";
import GameCompletionDialog from "./_components/GameCompletionDialog";
import CountdownOverlay from "./_components/CountdownOverlay";
import BackgroundEffects from "./_components/BackgroundEffects";

export default function ViewPlay() {
  const router = useRouter();
  const gameSessionId = getGameSessionId();
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const { data: apiResponse, error, isLoading } = useSWR(
    gameSessionId ? ["chemical-plant-battle-tools-play", gameSessionId] : null,
    async () => {
      if (!gameSessionId) return null;
      try {
        const response = await API.chemicalPlantBattle.getToolCp({
          game_session_id: gameSessionId,
        });
        return response?.data;
      } catch (err) {
        console.error("Error fetching equipment:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      errorRetryCount: 1,
    }
  );

  const equipmentList =
    apiResponse?.success && apiResponse?.data
      ? mapEquipmentData(apiResponse.data)
      : [];

  const {
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
    setShowWelcomeDialog,
    setIsDialogOpen,
    handleEquipmentClick,
    handleAnswerSelect,
    handleSubmitAnswer,
    handleAnswerCorrect,
    clearErrorMessage,
  } = useGameState(equipmentList);

  const { countdown, startCountdown, isActive: isCountdownActive } = useCountdown(() => {
    clearErrorMessage();
  });

  useEffect(() => {
    const sequence = getEquipmentSequence();
    if ((!sequence || sequence.length === 0) && equipmentList.length > 0) {
      clearGameStarted();
      setShowCompletionDialog(true);
    }
  }, [completedEquipments, equipmentList.length]);

  const handleExit = () => {
    clearAllGameData();
    router.push("/rally");
  };

  const handleCardClick = (equipment) => {
    if (isCountdownActive) return;

    const isValid = handleEquipmentClick(equipment, () => {
      startCountdown();
    });

    if (!isValid) {
      setIsDialogOpen(false);
    }
  };

  const handleSubmit = () => {
    const isValid = handleSubmitAnswer(() => {
      startCountdown();
    });

    if (!isValid) {
      setIsDialogOpen(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden px-4 py-12">
        <BackgroundEffects />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-white text-xl">Memuat data peralatan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || equipmentList.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden px-4 py-12">
        <BackgroundEffects />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-rose-400 text-xl">
              Gagal memuat data peralatan. Silakan refresh halaman.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      <BackgroundEffects />

      <div className="relative z-10 mx-auto max-w-7xl">
        <GameHeader />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {equipmentList.map((equipment) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              isDisabled={isCountdownActive}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      <WelcomeDialog
        isOpen={showWelcomeDialog && !isCountdownActive}
        equipmentName={welcomeEquipmentName}
        onClose={() => setShowWelcomeDialog(false)}
      />

      <QuestionDialog
        isOpen={isDialogOpen && !isCountdownActive}
        equipment={selectedEquipment}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        question={question}
        options={options}
        isLoadingQuestion={isLoadingQuestion}
        onClose={handleDialogClose}
        onAnswerSelect={handleAnswerSelect}
        onSubmit={handleSubmit}
        onNext={handleAnswerCorrect}
      />

      <GameCompletionDialog
        isOpen={showCompletionDialog}
        onExit={handleExit}
      />

      <CountdownOverlay countdown={countdown} errorMessage={errorMessage} />
    </div>
  );
}
