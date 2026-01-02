"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Sparkles, Trophy, RotateCcw, CheckCircle2 } from "lucide-react";

// UI Components (Import path tetap sama karena alias @)
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

// Local Imports (Path relatif aman karena kita pindahkan file-file ini satu folder yang sama)
import { ITEMS, SLOTS, SCENARIO_TEXT } from "./constants";
import DraggableItem from "./_components/DraggableItem";
import DroppableSlot from "./_components/DroppableSlot";
import FlowConnector from "./_components/FlowConnector";

export default function ViewGame() {
  // Ganti nama function jadi ViewGame
  const router = useRouter();

  // State Management
  const [placements, setPlacements] = useState({
    slot1: null,
    slot2: null,
    slot3: null,
    slot4: null,
    slot5: null,
    slot6: null,
  });

  const [availableItems, setAvailableItems] = useState(
    ITEMS.map((item) => item.id)
  );
  const [activeId, setActiveId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- LOGIC HANDLERS (DragStart, DragEnd, Submit, Reset) ---
  // (Paste logic yang sama persis dari codingan sebelumnya di sini)

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    if (over.id.startsWith("slot")) {
      const slotId = over.id;
      const itemId = active.id;

      const currentSlot = Object.keys(placements).find(
        (key) => placements[key] === itemId
      );

      if (currentSlot) {
        setPlacements((prev) => ({ ...prev, [currentSlot]: null }));
      } else {
        setAvailableItems((prev) => prev.filter((id) => id !== itemId));
      }

      if (placements[slotId]) {
        setAvailableItems((prev) => [...prev, placements[slotId]]);
      }

      setPlacements((prev) => ({ ...prev, [slotId]: itemId }));
    }
    setActiveId(null);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    SLOTS.forEach((slot) => {
      if (placements[slot.id] === slot.correctAnswer) correctCount++;
    });
    setScore(Math.round((correctCount / SLOTS.length) * 100));
    setShowResults(true);
  };

  const handleReset = () => {
    setPlacements({
      slot1: null,
      slot2: null,
      slot3: null,
      slot4: null,
      slot5: null,
      slot6: null,
    });
    setAvailableItems(ITEMS.map((item) => item.id));
    setShowResults(false);
    setScore(null);
  };

  const allSlotsFilled = Object.values(placements).every(
    (item) => item !== null
  );

  // --- RETURN JSX ---
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative min-h-screen overflow-hidden px-4 py-12">
        {/* Background & Header */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"></div>

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Header Content */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white">Sort the Process</h1>
            <p className="text-zinc-400">Susun proses produksi dengan benar</p>
          </div>

          {/* Scenario */}
          <Card className="mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="text-white">{SCENARIO_TEXT}</p>
            </CardContent>
          </Card>

          {/* Score Alert */}
          {showResults && (
            <Alert className="mb-6 border-emerald-500/50 bg-emerald-500/10 text-emerald-400">
              <Trophy className="h-4 w-4" />
              <AlertDescription>Skor Anda: {score}/100</AlertDescription>
            </Alert>
          )}

          {/* Main Game Area */}
          <Card className="mb-8 border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Row 1 */}
                <div className="grid gap-4 md:grid-cols-2">
                  <DroppableSlot
                    slot={SLOTS[0]}
                    placedItem={placements.slot1}
                    isCorrect={placements.slot1 === SLOTS[0].correctAnswer}
                    showResults={showResults}
                  />
                  <DroppableSlot
                    slot={SLOTS[1]}
                    placedItem={placements.slot2}
                    isCorrect={placements.slot2 === SLOTS[1].correctAnswer}
                    showResults={showResults}
                  />
                </div>
                <FlowConnector direction="down" />
                {/* Row 2 */}
                <div className="grid gap-4 md:grid-cols-2">
                  <DroppableSlot
                    slot={SLOTS[2]}
                    placedItem={placements.slot3}
                    isCorrect={placements.slot3 === SLOTS[2].correctAnswer}
                    showResults={showResults}
                  />
                  <DroppableSlot
                    slot={SLOTS[3]}
                    placedItem={placements.slot4}
                    isCorrect={placements.slot4 === SLOTS[3].correctAnswer}
                    showResults={showResults}
                  />
                </div>
                <FlowConnector direction="down" />
                {/* Row 3 */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div></div>
                  <DroppableSlot
                    slot={SLOTS[4]}
                    placedItem={placements.slot5}
                    isCorrect={placements.slot5 === SLOTS[4].correctAnswer}
                    showResults={showResults}
                  />
                </div>
                <FlowConnector direction="down" />
                {/* Row 4 */}
                <div className="flex justify-center">
                  <div className="w-full md:w-1/2">
                    <DroppableSlot
                      slot={SLOTS[5]}
                      placedItem={placements.slot6}
                      isCorrect={placements.slot6 === SLOTS[5].correctAnswer}
                      showResults={showResults}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="sticky bottom-4 border-white/10 bg-zinc-900/80 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4">
                {availableItems.map((id) => (
                  <DraggableItem
                    key={id}
                    item={ITEMS.find((i) => i.id === id)}
                    isDragging={activeId === id}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
            <Button onClick={handleSubmit} disabled={!allSlotsFilled}>
              Selesai
            </Button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <DraggableItem
            item={ITEMS.find((i) => i.id === activeId)}
            isDragging={false}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
