"use client";

import React, { useState, useEffect } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Trophy, Atom, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LEVELS, INVENTORY_ITEMS } from "./constants";
import DraggableItem from "./_components/DraggableItem";
import DropZone from "./_components/DropZone";

export default function ViewGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [placements, setPlacements] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isGameActive, setIsGameActive] = useState(true);
  const [validationResult, setValidationResult] = useState(null);

  const currentLevel = LEVELS[levelIndex];

  // Timer
  useEffect(() => {
    if (!isGameActive) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameActive]);

  // Drag Handlers
  const handleDragStart = (event) => {
    const { active } = event;
    setDraggedItem(active.data.current);
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    setDraggedItem(null);

    if (over) {
      const newItem = active.data.current;
      setPlacements((prev) => ({
        ...prev,
        [over.id]: newItem,
      }));
      setValidationResult(null);
    }
  };

  const handleRemoveItem = (zoneId) => {
    if (!isGameActive) return;
    setPlacements((prev) => {
      const copy = { ...prev };
      delete copy[zoneId];
      return copy;
    });
    setValidationResult(null);
  };

  const checkAnswer = () => {
    const zones = currentLevel.dropZones;
    let isAllCorrect = true;
    let filledCount = 0;

    zones.forEach((zone) => {
      const placed = placements[zone.id];
      if (placed) {
        filledCount++;
        if (placed.id !== zone.correctItem) {
          isAllCorrect = false;
        }
      } else {
        isAllCorrect = false;
      }
    });

    if (filledCount < zones.length) {
      setValidationResult("incomplete");
      return;
    }

    if (isAllCorrect) {
      setValidationResult("success");
      const bonus = timeLeft * 2;
      setScore((prev) => prev + 100 + bonus);
      setIsGameActive(false);
    } else {
      setValidationResult("error");
      setTimeLeft((prev) => Math.max(0, prev - 10));
    }
  };

  const handleNextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex((prev) => prev + 1);
      setPlacements({});
      setValidationResult(null);
      setIsGameActive(true);
      setTimeLeft(120);
    } else {
      alert("Selamat! Semua level selesai.");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-950 font-sans text-zinc-100 selection:bg-cyan-500/30">
      {/* 1. TOP BAR */}
      <header className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-8 backdrop-blur-md">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <FlaskConical className="text-cyan-500" />
            Atomic Structure{" "}
            <span className="text-zinc-600 font-light">
              | Level {levelIndex + 1}
            </span>
          </h1>
          <p className="text-xs text-zinc-400">{currentLevel.question}</p>
        </div>

        <div className="flex items-center gap-8">
          {/* Timer */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Waktu
            </span>
            <div
              className={cn(
                "font-mono text-2xl font-bold",
                timeLeft < 30 ? "text-red-500 animate-pulse" : "text-white"
              )}
            >
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Skor
            </span>
            <div className="font-mono text-2xl font-bold text-cyan-400">
              {score}
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN CANVAS AREA */}
      <main className="relative flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
        {/* Grid Background Effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #333 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.1,
          }}
        ></div>

        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {/* The Drop Zones Container */}
          <div className="relative mx-auto h-full max-w-5xl">
            {/* Helper Lines (Visual Skeleton) */}
            <div className="absolute left-1/2 top-1/2 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
              <div className="flex h-full w-full items-center justify-center">
                <Atom className="h-32 w-32 text-zinc-800 opacity-20 animate-spin-slow" />
              </div>
            </div>

            {/* Render Drop Zones */}
            {currentLevel.dropZones.map((zone) => {
              let isCorrectMark = undefined;
              if (
                validationResult === "success" ||
                validationResult === "error"
              ) {
                const placed = placements[zone.id];
                if (placed) {
                  isCorrectMark = placed.id === zone.correctItem;
                }
              }

              return (
                <DropZone
                  key={zone.id}
                  id={zone.id}
                  style={zone.style}
                  occupiedItem={placements[zone.id]}
                  onRemove={handleRemoveItem}
                  isCorrectMark={isCorrectMark}
                />
              );
            })}
          </div>

          {/* 3. BOTTOM INVENTORY */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-2xl border border-zinc-700 bg-zinc-900/80 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-6">
              <div className="flex gap-4 border-r border-zinc-700 pr-6">
                {INVENTORY_ITEMS.map((item) => (
                  <DraggableItem key={item.id} {...item} />
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {validationResult === "success" ? (
                  <Button
                    onClick={handleNextLevel}
                    className="bg-green-600 hover:bg-green-500 w-40"
                  >
                    Level Berikutnya <Trophy className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={checkAnswer}
                    disabled={!isGameActive}
                    className={cn(
                      "w-40",
                      validationResult === "error"
                        ? "bg-red-600 hover:bg-red-500"
                        : "bg-cyan-600 hover:bg-cyan-500"
                    )}
                  >
                    {validationResult === "error"
                      ? "Coba Lagi"
                      : "Cek Struktur"}
                  </Button>
                )}

                {/* Feedback Message */}
                <div className="h-4 text-center text-xs font-medium">
                  {validationResult === "incomplete" && (
                    <span className="text-yellow-500">
                      Lengkapi semua kotak!
                    </span>
                  )}
                  {validationResult === "error" && (
                    <span className="text-red-400">
                      Susunan masih salah. (-10s)
                    </span>
                  )}
                  {validationResult === "success" && (
                    <span className="text-green-400">Sempurna!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {draggedItem ? <DraggableItem {...draggedItem} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
