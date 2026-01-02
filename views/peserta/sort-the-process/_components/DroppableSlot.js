"use client";

import { useDroppable } from "@dnd-kit/core";
import { CheckCircle2, XCircle } from "lucide-react";
import { ITEMS } from "../constants";

export default function DroppableSlot({
  slot,
  placedItem,
  isCorrect,
  showResults,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: slot.id,
  });

  const item = placedItem ? ITEMS.find((i) => i.id === placedItem) : null;
  const Icon = item?.icon;

  return (
    <div
      ref={setNodeRef}
      className={`group relative flex min-h-[140px] flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${
        isOver
          ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
          : item
          ? showResults
            ? isCorrect
              ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
              : "border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/20"
            : `border-${item.color}-500/50 bg-${item.color}-500/10`
          : "border-dashed border-white/20 bg-zinc-900/30"
      }`}
    >
      {/* Slot Label */}
      <div className="absolute -top-3 left-3 rounded-full border border-white/10 bg-zinc-900 px-3 py-1">
        <span className="text-xs font-medium text-cyan-400">{slot.label}</span>
      </div>

      {/* Result Badge */}
      {showResults && item && (
        <div className="absolute -top-3 right-3">
          {isCorrect ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          ) : (
            <XCircle className="h-6 w-6 text-rose-400" />
          )}
        </div>
      )}

      {/* Content */}
      {item ? (
        <div className="flex flex-col items-center space-y-2">
          <div className={`rounded-full bg-${item.color}-500/20 p-3`}>
            <Icon className={`h-8 w-8 text-${item.color}-400`} />
          </div>
          <span className="text-sm font-semibold text-white">{item.name}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2 text-zinc-500">
          <div className="rounded-full border-2 border-dashed border-zinc-700 p-3">
            <div className="h-8 w-8" />
          </div>
          <span className="text-xs">Taruh alat di sini</span>
        </div>
      )}

      {/* Description */}
      <p className="mt-2 text-center text-xs text-zinc-400">
        {slot.description}
      </p>
    </div>
  );
}
