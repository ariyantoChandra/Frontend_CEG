"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getGameSessionId } from "./utils/getGameSessionId";
import { useGameData } from "./hooks/useGameData";
import { useGameState } from "./hooks/useGameState";
import { clearGameStorage } from "./utils/storage";
import ProcessLayout from "./_components/ProcessLayout";
import LoadingState from "./_components/LoadingState";
import ErrorState from "./_components/ErrorState";

export default function ViewGame() {
  const router = useRouter();
  const gameSessionId = getGameSessionId();

  const { data, error, isLoading } = useGameData(gameSessionId);
  const {
    selectedQuestion,
    placements,
    isSubmitted,
    processesConfig,
    allSlotsFilled,
    handleItemClick,
    handleSubmit,
    getItemById,
  } = useGameState(data, gameSessionId);

  const handleBack = () => {
    clearGameStorage();
    router.push("/rally");
  };

  if (!gameSessionId) {
    return <ErrorState message="Game session tidak ditemukan. Silakan kembali ke waiting list." />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-2 sm:px-4 py-6 sm:py-12">

      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-4 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-white">Sort the Process</h1>
          <p className="text-sm sm:text-base text-zinc-400">Susun proses produksi dengan benar</p>
        </div>

        {selectedQuestion && (
          <Card className="mb-4 sm:mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <p className="text-sm sm:text-base text-white">{selectedQuestion.name}</p>
            </CardContent>
          </Card>
        )}


        {selectedQuestion && processesConfig && (
          <Card className="mb-4 sm:mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <ProcessLayout
                processesConfig={processesConfig}
                selectedQuestion={selectedQuestion}
                placements={placements}
                items={data?.items}
                onItemClick={handleItemClick}
                getItemById={getItemById}
                isSubmitted={isSubmitted}
              />
            </CardContent>
          </Card>
        )}

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
          {isSubmitted ? (
            <Button onClick={handleBack} className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!allSlotsFilled || !selectedQuestion} className="w-full sm:w-auto">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Selesai
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
