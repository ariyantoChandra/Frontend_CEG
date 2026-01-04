"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Trophy, RotateCcw, CheckCircle2 } from "lucide-react";
import useSWR from "swr";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import * as API from "@/core/services/api";
import FlowConnector from "./_components/FlowConnector";

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

export default function ViewGame() {
  const router = useRouter();
  const gameSessionId = getGameSessionId();

  // State Management
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [placements, setPlacements] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [randomizedQuestions, setRandomizedQuestions] = useState(null);

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

  // Randomize questions on first load only
  useEffect(() => {
    if (data?.questions && !randomizedQuestions) {
      const shuffled = [...data.questions].sort(() => Math.random() - 0.5);
      setRandomizedQuestions(shuffled);
      // Set first question as default
      if (shuffled.length > 0) {
        setSelectedQuestion(shuffled[0]);
      }
    }
  }, [data, randomizedQuestions]);

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
    }
  }, [selectedQuestion]);

  // Get slots based on selected question
  const slots = useMemo(() => {
    if (!selectedQuestion) return [];
    const slotsArray = [];
    for (let i = 1; i <= selectedQuestion.kotak; i++) {
      slotsArray.push({
        id: `slot${i}`,
        label: `Alat ${i}`,
      });
    }
    return slotsArray;
  }, [selectedQuestion]);

  const handleItemClick = (itemId, slotId) => {
    // Place item in selected slot (item can be used in multiple slots)
    setPlacements((prev) => ({ ...prev, [slotId]: itemId }));
  };

  const handleRemoveItem = (slotId) => {
    setPlacements((prev) => ({ ...prev, [slotId]: null }));
  };

  const handleSubmit = async () => {
    if (!selectedQuestion || !gameSessionId) return;

    // Build answer array based on placements
    const answers = slots.map((slot, index) => ({
      slot: index + 1,
      item_id: placements[slot.id] || null,
    }));

    try {
      const response = await API.sortTheProcess.postResult({
        game_session_id: gameSessionId,
        question_id: selectedQuestion.id,
        answers: answers,
      });

      if (response?.data?.success) {
        const resultData = response.data.data;
        setScore(resultData.score || 0);
        setShowResults(true);
        toast.success("Jawaban berhasil dikirim!");
      } else {
        throw new Error("Gagal mengirim jawaban");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal mengirim jawaban");
      console.error("Error submitting:", err);
    }
  };

  const handleReset = () => {
    if (selectedQuestion) {
      const initialPlacements = {};
      for (let i = 1; i <= selectedQuestion.kotak; i++) {
        initialPlacements[`slot${i}`] = null;
      }
      setPlacements(initialPlacements);
      setShowResults(false);
      setScore(null);
    }
  };

  const allSlotsFilled = slots.every((slot) => placements[slot.id] !== null);

  // Get item by ID
  const getItemById = (itemId) => {
    return data?.items?.find((item) => item.id === itemId);
  };

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

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      {/* Background & Header */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header Content */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">Sort the Process</h1>
          <p className="text-zinc-400">Susun proses produksi dengan benar</p>
        </div>

        {/* Question Selector */}
        {randomizedQuestions && randomizedQuestions.length > 1 && (
          <Card className="mb-6 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {randomizedQuestions.map((question, index) => (
                  <Button
                    key={question.id}
                    variant={selectedQuestion?.id === question.id ? "default" : "outline"}
                    onClick={() => setSelectedQuestion(question)}
                    className="text-sm"
                  >
                    Soal {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scenario */}
        {selectedQuestion && (
          <Card className="mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="text-white">{selectedQuestion.name}</p>
            </CardContent>
          </Card>
        )}

        {/* Score Alert */}
        {showResults && score !== null && (
          <Alert className="mb-6 border-emerald-500/50 bg-emerald-500/10 text-emerald-400">
            <Trophy className="h-4 w-4" />
            <AlertDescription>Skor Anda: {score}/100</AlertDescription>
          </Alert>
        )}

        {/* Main Game Area */}
        {selectedQuestion && (
          <Card className="mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Render slots based on kotak value */}
                {slots.map((slot, index) => {
                  const isLast = index === slots.length - 1;
                  const placedItemId = placements[slot.id];
                  const placedItem = placedItemId ? getItemById(placedItemId) : null;

                  return (
                    <div key={slot.id}>
                      <div className="flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="relative flex min-h-[140px] w-full max-w-md flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-zinc-900/30 p-4 transition-all hover:border-cyan-500/50 hover:bg-zinc-900/50">
                              {/* Slot Label */}
                              <div className="absolute -top-3 left-3 rounded-full border border-white/10 bg-zinc-900 px-3 py-1">
                                <span className="text-xs font-medium text-cyan-400">
                                  {slot.label}
                                </span>
                              </div>

                              {/* Remove Button */}
                              {placedItem && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveItem(slot.id);
                                  }}
                                  className="absolute -top-3 right-3 rounded-full bg-red-500/20 p-1 text-red-400 hover:bg-red-500/30"
                                >
                                  <span className="text-xs">×</span>
                                </button>
                              )}

                              {/* Content */}
                              {placedItem ? (
                                <div className="flex flex-col items-center space-y-2">
                                  <div className="rounded-full bg-cyan-500/20 p-3">
                                    <span className="text-2xl">🔧</span>
                                  </div>
                                  <span className="text-sm font-semibold text-white">
                                    {placedItem.name}
                                  </span>
                                  <span className="text-xs text-zinc-400">Klik untuk mengganti</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center space-y-2 text-zinc-500">
                                  <div className="rounded-full border-2 border-dashed border-zinc-700 p-3">
                                    <div className="h-8 w-8" />
                                  </div>
                                  <span className="text-xs">Klik untuk memilih alat</span>
                                </div>
                              )}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center" className="w-56">
                            {data?.items?.map((item) => (
                              <DropdownMenuItem
                                key={item.id}
                                onClick={() => handleItemClick(item.id, slot.id)}
                              >
                                {item.name}
                                {placedItemId === item.id && (
                                  <CheckCircle2 className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {!isLast && <FlowConnector direction="down" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSubmit} disabled={!allSlotsFilled || !selectedQuestion}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Selesai
          </Button>
        </div>
      </div>
    </div>
  );
}
