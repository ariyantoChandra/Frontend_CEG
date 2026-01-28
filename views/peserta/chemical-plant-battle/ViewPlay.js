"use client";

import { EQUIPMENT } from "./constants";
import { useCountdown } from "./hooks/useCountdown";
import { useGameState } from "./hooks/useGameState";
import { ERROR_TYPES } from "./constants/gameConfig";
import GameHeader from "./_components/GameHeader";
import EquipmentCard from "./_components/EquipmentCard";
import WelcomeDialog from "./_components/WelcomeDialog";
import ErrorDialog from "./_components/ErrorDialog";
import QuestionDialog from "./_components/QuestionDialog";
import CountdownOverlay from "./_components/CountdownOverlay";
import BackgroundEffects from "./_components/BackgroundEffects";

export default function ViewPlay() {
  const { countdown, startCountdown, isActive: isCountdownActive } = useCountdown();
  
  const {
    selectedEquipment,
    selectedAnswer,
    showResult,
    showWelcomeDialog,
    showErrorDialog,
    errorType,
    completedEquipments,
    nextTargetId,
    isDialogOpen,
    setShowWelcomeDialog,
    setIsDialogOpen,
    handleEquipmentClick,
    handleAnswerSelect,
    handleSubmitAnswer,
    handleAnswerCorrect,
    showError,
    closeErrorDialog,
  } = useGameState();

  const handleCardClick = (equipment) => {
    if (isCountdownActive) return;

    const isValid = handleEquipmentClick(equipment, () => {
      showError(ERROR_TYPES.EQUIPMENT);
    });

    if (!isValid) {
      setIsDialogOpen(false);
    }
  };

  const handleSubmit = () => {
    const isValid = handleSubmitAnswer(() => {
      showError(ERROR_TYPES.ANSWER);
    });

    if (!isValid) {
      setIsDialogOpen(false);
    }
  };

  const handleErrorClose = () => {
    closeErrorDialog(startCountdown);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      <BackgroundEffects />

      <div className="relative z-10 mx-auto max-w-7xl">
        <GameHeader />

        {/* Equipment Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPMENT.map((equipment) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              isCompleted={completedEquipments.includes(equipment.id)}
              isDisabled={isCountdownActive}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <WelcomeDialog
        isOpen={showWelcomeDialog && !isCountdownActive}
        onClose={() => setShowWelcomeDialog(false)}
      />

      <ErrorDialog
        isOpen={showErrorDialog && !isCountdownActive}
        errorType={errorType}
        onClose={handleErrorClose}
      />

      <QuestionDialog
        isOpen={isDialogOpen && !isCountdownActive}
        equipment={selectedEquipment}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        onClose={handleDialogClose}
        onAnswerSelect={handleAnswerSelect}
        onSubmit={handleSubmit}
        onNext={handleAnswerCorrect}
      />

      {/* Countdown Overlay */}
      <CountdownOverlay countdown={countdown} />
    </div>
  );
}
