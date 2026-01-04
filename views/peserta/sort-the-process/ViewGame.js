"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Trophy, CheckCircle2, ArrowRight, ArrowDown, ArrowLeft } from "lucide-react";
import useSWR from "swr";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import * as API from "@/core/services/api";

// Helper function to get game_session_id
const getGameSessionId = () => {
  try {
    const gameData = localStorage.getItem("game_data");
    if (!gameData) return null;

    try {
      const parsed = JSON.parse(gameData);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed.game_session_id || null;
      }
      return null;
    } catch {
      return null;
    }
  } catch (err) {
    console.error("Error reading game_data:", err);
    return null;
  }
};

// Memoized Process Box Component
const ProcessBox = memo(({ slotId, label, placedItem, items, onItemClick, isWide = false, disabled = false }) => {
  if (disabled) {
    return (
      <button 
        disabled={true}
        className={`relative flex min-h-[100px] sm:min-h-[120px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-zinc-900/20 cursor-not-allowed opacity-60 p-3 sm:p-4 ${isWide ? 'w-full max-w-[600px] sm:w-[600px] sm:min-w-[600px]' : 'w-full max-w-[300px] sm:w-[300px] sm:min-w-[300px]'}`}
      >
        {/* Slot Label */}
        <div className="absolute -top-2 sm:-top-3 left-2 sm:left-3 rounded-full border border-white/10 bg-zinc-900 px-2 sm:px-3 py-0.5 sm:py-1">
          <span className="text-[10px] sm:text-xs font-medium text-cyan-400">
            {label}
          </span>
        </div>

        {/* Content */}
        {placedItem ? (
          <div className="flex flex-col items-center space-y-1 sm:space-y-2">
            <div className="rounded-full bg-cyan-500/20 p-2 sm:p-3">
              <span className="text-xl sm:text-2xl">🔧</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white text-center px-2">
              {placedItem.name}
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-400">Tidak dapat diubah</span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-1 sm:space-y-2 text-zinc-500">
            <div className="rounded-full border-2 border-dashed border-zinc-700 p-2 sm:p-3">
              <div className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <span className="text-[10px] sm:text-xs">Tidak dapat dipilih</span>
          </div>
        )}
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className={`relative flex min-h-[100px] sm:min-h-[120px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-zinc-900/30 p-3 sm:p-4 transition-all hover:border-cyan-500/50 hover:bg-zinc-900/50 ${isWide ? 'w-full max-w-[600px] sm:w-[600px] sm:min-w-[600px]' : 'w-full max-w-[300px] sm:w-[300px] sm:min-w-[300px]'}`}
        >
          {/* Slot Label */}
          <div className="absolute -top-2 sm:-top-3 left-2 sm:left-3 rounded-full border border-white/10 bg-zinc-900 px-2 sm:px-3 py-0.5 sm:py-1">
            <span className="text-[10px] sm:text-xs font-medium text-cyan-400">
              {label}
            </span>
          </div>

          {/* Content */}
          {placedItem ? (
            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
              <div className="rounded-full bg-cyan-500/20 p-2 sm:p-3">
                <span className="text-xl sm:text-2xl">🔧</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white text-center px-2">
                {placedItem.name}
              </span>
              <span className="text-[10px] sm:text-xs text-zinc-400">{disabled ? 'Tidak dapat diubah' : 'Klik untuk mengganti'}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 text-zinc-500">
              <div className="rounded-full border-2 border-dashed border-zinc-700 p-2 sm:p-3">
                <div className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <span className="text-[10px] sm:text-xs">{disabled ? 'Tidak dapat dipilih' : 'Klik untuk memilih'}</span>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 max-h-[300px] overflow-y-auto">
        {items?.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => onItemClick(item.id, slotId)}
          >
            {item.name}
            {placedItem?.id === item.id && (
              <CheckCircle2 className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

ProcessBox.displayName = "ProcessBox";

export default function ViewGame() {
  const router = useRouter();
  const gameSessionId = getGameSessionId();

  // State Management
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [placements, setPlacements] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch data from API
  const { data, error, isLoading } = useSWR(
    gameSessionId ? ["sort-the-process-items", gameSessionId] : null,
    async () => {
      if (!gameSessionId) return null;
      try {
        const response = await API.sortTheProcess.getItemsQuestion({
          game_session_id: gameSessionId,
        });
        return response?.data?.data || null;
      } catch (err) {
        console.error("Error fetching items:", err);
        throw err;
      }
    }
  );

  // Random select question (id 1 or 2) on first load only
  useEffect(() => {
    if (data?.questions && !selectedQuestion) {
      const questions = data.questions;
      // Random select between id 1 or 2
      const randomQuestion = questions.find(q => q.id === 1 || q.id === 2);
      if (randomQuestion) {
        setSelectedQuestion(randomQuestion);
      } else if (questions.length > 0) {
        // Fallback to first question if id 1 or 2 not found
        setSelectedQuestion(questions[0]);
      }
    }
  }, [data, selectedQuestion]);

  // Initialize placements based on selected question
  useEffect(() => {
    if (selectedQuestion) {
      const initialPlacements = {};
      for (let i = 1; i <= selectedQuestion.kotak; i++) {
        initialPlacements[`slot${i}`] = null;
      }
      setPlacements(initialPlacements);
      setShowResults(false);
      setScore(null);
      setIsSubmitted(false);
    }
  }, [selectedQuestion]);

  // Get processes configuration based on question
  const processesConfig = useMemo(() => {
    if (!selectedQuestion) return null;

    // Create processes based on kotak count
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
    if (isSubmitted) return; // Prevent changes after submission
    setPlacements((prev) => ({ ...prev, [slotId]: itemId }));
  }, [isSubmitted]);

  const handleBack = useCallback(() => {
    // Remove localStorage
    localStorage.removeItem("gameStatus");
    localStorage.removeItem("game_data");
    // Navigate back
    router.push("/rally");
  }, [router]);

  const handleSubmit = useCallback(async () => {
    if (!selectedQuestion || !gameSessionId) return;

    // Build answer array based on placements - all slots from 1 to kotak
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
        const resultData = response.data.data;
        setScore(resultData.total_poin || 0);
        setShowResults(true);
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

  // Get item by ID
  const getItemById = useCallback((itemId) => {
    return data?.items?.find((item) => item.id === itemId);
  }, [data]);

  // Check if all slots filled
  const allSlotsFilled = useMemo(() => {
    if (!selectedQuestion) return false;
    for (let i = 1; i <= selectedQuestion.kotak; i++) {
      if (!placements[`slot${i}`]) return false;
    }
    return true;
  }, [selectedQuestion, placements]);

  if (!gameSessionId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert className="border-red-500/50 bg-red-500/10 text-red-400">
          <AlertDescription>
            Game session tidak ditemukan. Silakan kembali ke waiting list.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto h-12 w-12 animate-pulse text-cyan-400" />
          <p className="mt-4 text-zinc-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert className="border-red-500/50 bg-red-500/10 text-red-400">
          <AlertDescription>
            Gagal memuat data. Silakan coba lagi.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render Vertical Layout with all processes
  const renderVerticalLayout = () => {
    if (!processesConfig || processesConfig.length === 0) return null;
    if (!selectedQuestion) return null;

    // Define input/output labels for each process based on question ID
    const getProcessLabels = (processId, questionId) => {
      if (questionId === 1) {
        // Cake production process
        const labels = {
          1: {
            inputs: ["Krim", "Gula"],
            outputs: ["Krim kocok"],
          },
          2: {
            inputs: ["60% Tepung", "30% Air", "Gula", "Telur"],
            outputs: ["Adonan kue"],
          },
          3: {
            inputs: ["Adonan kue"],
            outputs: ["Kue"],
          },
          4: {
            inputs: ["Stroberi", "Air"],
            outputs: ["55% Stroberi", "45% Air"],
          },
          5: {
            inputs: ["55% Stroberi", "45% Air"],
            outputs: ["Selai stroberi"],
            waste: ["Air"],
          },
          6: {
            inputs: ["Krim kocok", "Kue", "Selai stroberi"],
            outputs: [],
          },
        };
        return labels[processId] || { inputs: [], outputs: [] };
      } else if (questionId === 2) {
        // Glucose-Fructose production process
        const labels = {
          1: {
            inputs: ["65% Gula pasir", "35% Air"],
            outputs: ["65% Gula pasir", "35% Air"],
          },
          2: {
            inputs: ["65% Gula pasir", "35% Air"],
            inputTop: "HCl 1%",
            outputs: ["32.5% Glukosa", "32.5% Fruktosa", "34% Air", "1% HCl"],
          },
          3: {
            inputs: ["32.5% Glukosa", "32.5% Fruktosa", "34% Air", "1% HCl"],
            inputTop: "NaOH 2%",
            outputs: ["32.5% Glukosa", "32.5% Fruktosa", "35% Air"],
          },
          4: {
            inputs: ["32.5% Glukosa", "32.5% Fruktosa", "35% Air"],
            outputs: ["32.5% Glukosa", "32.5% Fruktosa", "35% Air"],
          },
          5: {
            inputs: ["32.5% Glukosa", "32.5% Fruktosa", "35% Air"],
            outputs: ["35% Glukosa", "35% Fruktosa", "30% Air"],
            waste: ["Air"],
          },
          6: {
            inputs: ["35% Glukosa", "35% Fruktosa", "30% Air"],
            outputs: [],
          },
        };
        return labels[processId] || { inputs: [], outputs: [] };
      }
      return { inputs: [], outputs: [] };
    };

    // Helper function to render a single process
    const renderProcess = (process, labels, placedItem, hideRightOutput = false, hideLeftInput = false, isWide = false, disabled = false) => (
      <div className="flex flex-col items-center gap-4">
        {/* Top Input (if exists) */}
        {labels.inputTop && (
          <div className="mb-2">
            <span className="text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">
              {labels.inputTop}
            </span>
          </div>
        )}

        {/* Process Row */}
        <div className="flex items-center gap-2 sm:gap-4 w-full justify-center flex-wrap">
          {/* Left Inputs */}
          {!hideLeftInput && labels.inputs && labels.inputs.length > 0 && (
            <div className="flex flex-col gap-1 sm:gap-2">
              {labels.inputs.map((input, idx) => (
                <span
                  key={idx}
                  className="text-[10px] sm:text-xs text-zinc-400 bg-zinc-800/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap"
                >
                  {input}
                </span>
              ))}
            </div>
          )}

          {/* Arrow to Process Box */}
          {!hideLeftInput && labels.inputs && labels.inputs.length > 0 && (
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
          )}

          {/* Process Box */}
          <ProcessBox
            slotId={process.slotId}
            label={process.label}
            placedItem={placedItem}
            items={data?.items}
            onItemClick={handleItemClick}
            isWide={isWide}
            disabled={disabled}
          />

          {/* Arrow from Process Box */}
          {!hideRightOutput && labels.outputs && labels.outputs.length > 0 && (
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
          )}

          {/* Right Outputs */}
          {!hideRightOutput && labels.outputs && labels.outputs.length > 0 && (
            <div className="flex flex-col gap-1 sm:gap-2">
              {labels.outputs.map((output, idx) => (
                <span
                  key={idx}
                  className="text-[10px] sm:text-xs text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap"
                >
                  {output}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Waste Output (if exists) */}
        {labels.waste && labels.waste.length > 0 && (
          <div className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2">
            <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
            {labels.waste.map((waste, idx) => (
              <span
                key={idx}
                className="text-[10px] sm:text-xs text-red-400 bg-red-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap"
              >
                {waste}
              </span>
            ))}
          </div>
        )}
      </div>
    );

    return (
      <div className="space-y-4 sm:space-y-8">
        {processesConfig.map((process, index) => {
          const labels = getProcessLabels(process.id, selectedQuestion.id);
          const placedItem = placements[process.slotId] ? getItemById(placements[process.slotId]) : null;
          const isLast = index === processesConfig.length - 1;
          const isProcess2 = process.id === 2;
          const isProcess3 = process.id === 3;
          const isProcess4 = process.id === 4;
          const isProcess5 = process.id === 5;
          const nextProcess = processesConfig[index + 1];
          const isNextProcess3 = nextProcess?.id === 3;
          const isNextProcess5 = nextProcess?.id === 5;

          // Special handling for process 2 and 3 - render them side by side
          if (isProcess2) {
            const process3 = processesConfig.find(p => p.id === 3);
            const labels3 = process3 ? getProcessLabels(3, selectedQuestion.id) : null;
            const placedItem3 = process3 && placements[process3.slotId] ? getItemById(placements[process3.slotId]) : null;
            
            // Get connecting label (output from process 2 = input to process 3)
            const connectingLabel = labels.outputs && labels.outputs.length > 0 ? labels.outputs[0] : null;

            return (
              <div key={`process-2-3`} className="flex flex-col items-center gap-2 sm:gap-4 w-full">
                {/* Process 2 and 3 side by side */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full justify-center">
                  {/* Process 2 */}
                  <div className="w-full sm:flex-1 flex justify-center">
                    {renderProcess(process, labels, placedItem, true, false, false, isSubmitted)} {/* hide right output */}
                  </div>

                  {/* Arrow to Connecting Label - horizontal on desktop, vertical on mobile */}
                  {connectingLabel && (
                    <>
                      <ArrowRight className="hidden sm:flex h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
                      <ArrowDown className="flex sm:hidden h-4 w-4 text-cyan-400 shrink-0" />
                    </>
                  )}

                  {/* Connecting Label in the middle */}
                  {connectingLabel && (
                    <div className="flex items-center">
                      <span className="text-[10px] sm:text-xs text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap">
                        {connectingLabel}
                      </span>
                    </div>
                  )}

                  {/* Arrow from Connecting Label to Process 3 - horizontal on desktop, vertical on mobile */}
                  {connectingLabel && (
                    <>
                      <ArrowRight className="hidden sm:flex h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
                      <ArrowDown className="flex sm:hidden h-4 w-4 text-cyan-400 shrink-0" />
                    </>
                  )}

                  {/* Process 3 */}
                  {process3 && (
                    <div className="w-full sm:flex-1 flex justify-center">
                      {renderProcess(process3, labels3, placedItem3, false, true, false, isSubmitted)} {/* hide left input */}
                    </div>
                  )}
                </div>

                {/* Arrow Down to Next Process (only if next is not process 3) */}
                {!isLast && !isNextProcess3 && (
                  <ArrowDown className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
                )}
              </div>
            );
          }

          // Skip process 3 as it's already rendered with process 2
          if (isProcess3) {
            return null;
          }

          // Special handling for process 4 and 5 - render them side by side
          if (isProcess4) {
            const process5 = processesConfig.find(p => p.id === 5);
            const labels5 = process5 ? getProcessLabels(5, selectedQuestion.id) : null;
            const placedItem5 = process5 && placements[process5.slotId] ? getItemById(placements[process5.slotId]) : null;
            
            // Get connecting labels (outputs from process 4 = inputs to process 5)
            const connectingLabels = labels.outputs && labels.outputs.length > 0 ? labels.outputs : null;

            return (
              <div key={`process-4-5`} className="flex flex-col items-center gap-2 sm:gap-4 w-full">
                {/* Process 4 and 5 side by side */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full justify-center">
                  {/* Process 4 */}
                  <div className="w-full sm:flex-1 flex justify-center">
                    {renderProcess(process, labels, placedItem, true, false, false, isSubmitted)} {/* hide right output */}
                  </div>

                  {/* Arrow to Connecting Labels - horizontal on desktop, vertical on mobile */}
                  {connectingLabels && connectingLabels.length > 0 && (
                    <>
                      <ArrowRight className="hidden sm:flex h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
                      <ArrowDown className="flex sm:hidden h-4 w-4 text-cyan-400 shrink-0" />
                    </>
                  )}

                  {/* Connecting Labels in the middle */}
                  {connectingLabels && connectingLabels.length > 0 && (
                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                      {connectingLabels.map((label, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] sm:text-xs text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Arrow from Connecting Labels to Process 5 - horizontal on desktop, vertical on mobile */}
                  {connectingLabels && connectingLabels.length > 0 && (
                    <>
                      <ArrowRight className="hidden sm:flex h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
                      <ArrowDown className="flex sm:hidden h-4 w-4 text-cyan-400 shrink-0" />
                    </>
                  )}

                  {/* Process 5 */}
                  {process5 && (
                    <div className="w-full sm:flex-1 flex justify-center">
                      {renderProcess(process5, labels5, placedItem5, false, true, false, isSubmitted)} {/* hide left input */}
                    </div>
                  )}
                </div>

                {/* Arrow Down to Next Process (only if next is not process 5) */}
                {!isLast && !isNextProcess5 && (
                  <ArrowDown className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
                )}
              </div>
            );
          }

          // Skip process 5 as it's already rendered with process 4
          if (isProcess5) {
            return null;
          }

          // Regular rendering for other processes
          const isProcess1 = process.id === 1;
          const isProcess6 = process.id === 6;
          const isWideProcess = isProcess1 || isProcess6;
          
          return (
            <div key={process.id} className="flex flex-col items-center gap-2 sm:gap-4 w-full">
              {renderProcess(process, labels, placedItem, false, false, isWideProcess, isSubmitted)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-2 sm:px-4 py-6 sm:py-12">
      {/* Background & Header */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header Content */}
        <div className="mb-4 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-white">Sort the Process</h1>
          <p className="text-sm sm:text-base text-zinc-400">Susun proses produksi dengan benar</p>
        </div>

          {/* Scenario */}
        {selectedQuestion && (
          <Card className="mb-4 sm:mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <p className="text-sm sm:text-base text-white">{selectedQuestion.name}</p>
            </CardContent>
          </Card>
        )}

        {/* Score Alert */}
        {showResults && score !== null && (
          <Alert className="mb-4 sm:mb-6 border-emerald-500/50 bg-emerald-500/10 text-emerald-400">
            <Trophy className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">Skor Anda: {score}</AlertDescription>
          </Alert>
        )}

        {/* Main Game Area */}
        {selectedQuestion && processesConfig && (
          <Card className="mb-4 sm:mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              {renderVerticalLayout()}
            </CardContent>
          </Card>
        )}

        {/* Buttons */}
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
