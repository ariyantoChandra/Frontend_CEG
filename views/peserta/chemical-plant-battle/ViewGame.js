"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Factory,
  Target,
  Clock,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Sparkles,
} from "lucide-react";

// Local Imports
import { TOOLS, PENALTY_TIME } from "./constants";
import ToolCard from "./_components/ToolCard";
import RepairQuizModal from "./_components/RepairQuizModal";
import FreezeOverlay from "./_components/FreezeOverlay";

export default function ViewGame() {
  const router = useRouter();

  // Game State
  const [tools, setTools] = useState(TOOLS);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Time & Score
  const [elapsedTime, setElapsedTime] = useState(0);
  const [score, setScore] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);

  // Freeze State
  const [isFrozen, setIsFrozen] = useState(false);
  const [freezeRemaining, setFreezeRemaining] = useState(0);

  // Modal State
  const [selectedTool, setSelectedTool] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // Stats
  const fixedCount = tools.filter((t) => t.status === "FIXED").length;
  const totalTools = tools.length;
  const progress = (fixedCount / totalTools) * 100;

  // Timer Effect
  useEffect(() => {
    if (!gameStarted || gameCompleted) return;
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  // Freeze Timer Effect
  useEffect(() => {
    if (!isFrozen) return;
    const interval = setInterval(() => {
      setFreezeRemaining((prev) => {
        if (prev <= 1) {
          setIsFrozen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFrozen]);

  // Set Initial Target
  useEffect(() => {
    if (gameStarted && !currentTarget) {
      const brokenTools = tools.filter((t) => t.status === "BROKEN");
      if (brokenTools.length > 0) {
        const randomTool =
          brokenTools[Math.floor(Math.random() * brokenTools.length)];
        setCurrentTarget(randomTool);
      }
    }
  }, [gameStarted, currentTarget, tools]);

  // Check Win Condition
  useEffect(() => {
    if (fixedCount === totalTools && gameStarted && !gameCompleted) {
      setGameCompleted(true);
      calculateFinalScore();
    }
  }, [fixedCount, totalTools, gameStarted, gameCompleted]);

  // Start Game
  const startGame = () => {
    setGameStarted(true);
    setElapsedTime(0);
    setScore(0);
    setBonusPoints(0);
    setTools(TOOLS.map((t) => ({ ...t, status: "BROKEN" })));
    setGameCompleted(false);
  };

  // Handle Tool Click
  const handleToolClick = (tool) => {
    if (!currentTarget || isFrozen) return;

    // Wrong tool clicked
    if (tool.id !== currentTarget.id) {
      triggerFreeze();
      return;
    }

    // Correct tool clicked - show quiz
    setSelectedTool(tool);
    setShowQuizModal(true);
  };

  // Handle Quiz Answer
  const handleQuizAnswer = (isCorrect) => {
    setShowQuizModal(false);

    if (!isCorrect) {
      triggerFreeze();
      return;
    }

    // Fix tool
    setTools((prev) =>
      prev.map((t) =>
        t.id === selectedTool.id ? { ...t, status: "FIXED" } : t
      )
    );

    // Add points
    const points = selectedTool.points;
    setScore((prev) => prev + points);

    // Calculate time bonus
    const timeBonus = Math.max(0, 50 - Math.floor(elapsedTime / 10));
    setBonusPoints((prev) => prev + timeBonus);

    // Set next target
    const remainingBroken = tools.filter(
      (t) => t.status === "BROKEN" && t.id !== selectedTool.id
    );

    if (remainingBroken.length > 0) {
      const nextTarget =
        remainingBroken[Math.floor(Math.random() * remainingBroken.length)];
      setCurrentTarget(nextTarget);
    } else {
      setCurrentTarget(null);
    }
  };

  // Trigger Freeze Penalty
  const triggerFreeze = () => {
    setIsFrozen(true);
    setFreezeRemaining(PENALTY_TIME);
  };

  // Calculate Final Score
  const calculateFinalScore = () => {
    console.log("Game Completed!", {
      baseScore: score,
      bonusPoints,
      totalScore: score + bonusPoints,
      time: elapsedTime,
    });
  };

  // Format Time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"></div>
      <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 backdrop-blur-sm">
            <Factory className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-400">
              Industrial Challenge
            </span>
          </div>

          <h1 className="mb-2 text-4xl font-bold text-white">
            Chemical Plant Battle
          </h1>
          <p className="text-zinc-400">
            Perbaiki semua alat yang rusak secepat mungkin!
          </p>
        </div>

        {!gameStarted ? (
          /* Start Screen */
          <Card className="mx-auto max-w-2xl border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Selamat Datang, Field Engineer!
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Pabrik kimia mengalami kerusakan pada 6 alat. Tugasmu adalah
                memperbaiki semuanya.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-cyan-500/50 bg-cyan-500/10">
                <Target className="h-4 w-4 text-cyan-400" />
                <AlertDescription className="text-cyan-400">
                  <strong>Cara Bermain:</strong>
                  <ol className="mt-2 ml-4 space-y-1 list-decimal">
                    <li>
                      Sistem akan menunjukkan TARGET alat yang harus diperbaiki
                    </li>
                    <li>Klik gambar alat yang BENAR sesuai target</li>
                    <li>Jawab pertanyaan perbaikan dengan tepat</li>
                    <li>Kesalahan = FREEZE 15 detik!</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <Alert className="border-rose-500/50 bg-rose-500/10">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                <AlertDescription className="text-rose-400">
                  <strong>Peringatan:</strong> Setiap kesalahan (klik alat salah
                  atau jawaban salah) akan membekukan sistem selama 15 detik!
                </AlertDescription>
              </Alert>

              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-6 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Mulai Permainan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Top Stats Bar */}
            <div className="mb-8 grid gap-4 sm:grid-cols-4">
              {/* Timer */}
              <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                <CardContent className="flex items-center space-x-3 p-4">
                  <Clock className="h-8 w-8 text-cyan-400" />
                  <div>
                    <p className="text-xs text-zinc-400">Waktu</p>
                    <p className="text-2xl font-bold text-white">
                      {formatTime(elapsedTime)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs text-zinc-400">Progress</p>
                    <p className="text-sm font-bold text-white">
                      {fixedCount}/{totalTools}
                    </p>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>

              {/* Score */}
              <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                <CardContent className="flex items-center space-x-3 p-4">
                  <Trophy className="h-8 w-8 text-yellow-400" />
                  <div>
                    <p className="text-xs text-zinc-400">Skor</p>
                    <p className="text-2xl font-bold text-white">{score}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Bonus */}
              <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                <CardContent className="flex items-center space-x-3 p-4">
                  <Zap className="h-8 w-8 text-emerald-400" />
                  <div>
                    <p className="text-xs text-zinc-400">Bonus</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      +{bonusPoints}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Target Display */}
            {currentTarget && !gameCompleted && (
              <Alert className="mb-6 border-cyan-500/50 bg-cyan-500/10 animate-pulse">
                <Target className="h-5 w-5 text-cyan-400" />
                <AlertDescription className="text-cyan-400">
                  <span className="text-lg font-bold">
                    TARGET SAAT INI: {currentTarget.name}
                  </span>
                  <br />
                  Klik gambar alat yang benar untuk memulai perbaikan!
                </AlertDescription>
              </Alert>
            )}

            {/* Game Completed */}
            {gameCompleted && (
              <Alert className="mb-6 border-emerald-500/50 bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <AlertDescription className="text-emerald-400">
                  <span className="text-xl font-bold">
                    🎉 SELAMAT! Semua alat berhasil diperbaiki!
                  </span>
                  <br />
                  Waktu: {formatTime(elapsedTime)} | Total Skor:{" "}
                  {score + bonusPoints}
                </AlertDescription>
              </Alert>
            )}

            {/* Plant Grid - 6 Tools */}
            <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl text-white">
                  <Factory className="h-6 w-6 text-orange-400" />
                  <span>Chemical Plant Floor</span>
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Klik alat yang sesuai dengan target saat ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isTarget={currentTarget?.id === tool.id}
                      isFrozen={isFrozen}
                      onClick={handleToolClick}
                      gameStarted={gameStarted}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Repair Quiz Modal */}
      {selectedTool && (
        <RepairQuizModal
          tool={selectedTool}
          isOpen={showQuizModal}
          onClose={() => setShowQuizModal(false)}
          onAnswer={handleQuizAnswer}
        />
      )}

      {/* Freeze Overlay */}
      {isFrozen && <FreezeOverlay remainingTime={freezeRemaining} />}
    </div>
  );
}
