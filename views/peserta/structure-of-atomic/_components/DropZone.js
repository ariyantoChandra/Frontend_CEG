"use client";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export default function DropZone({
  id,
  style,
  occupiedItem,
  onRemove,
  isCorrectMark,
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const placedContent = occupiedItem ? (
    <div
      onClick={() => onRemove(id)}
      className={cn(
        "flex h-full w-full cursor-pointer items-center justify-center transition-all animate-in fade-in zoom-in duration-200",
        occupiedItem.type === "atom" ? "rounded-full border-2" : "rounded",
        occupiedItem.color,
        isCorrectMark === true && "border-green-500 bg-green-500/20",
        isCorrectMark === false && "border-red-500 bg-red-500/20"
      )}
    >
      {occupiedItem.id === "bond-double" ? "" : occupiedItem.label}
    </div>
  ) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-colors",
        !style.width && "h-14 w-14",
        !style.height && "h-14 w-14",
        !occupiedItem && "rounded-full border-2 border-dashed bg-zinc-900/50",
        !occupiedItem && isOver
          ? "border-cyan-400 bg-cyan-400/20 scale-110"
          : "border-zinc-700"
      )}
    >
      {placedContent}
      {!occupiedItem && (
        <span className="text-[10px] text-zinc-600 font-mono">?</span>
      )}
    </div>
  );
}
