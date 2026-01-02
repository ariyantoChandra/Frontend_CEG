"use client";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export default function DraggableItem({ id, label, type, color, isOverlay }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `inv-${id}`,
    data: { id, label, type, color },
  });

  const style =
    isOverlay && transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex cursor-grab items-center justify-center rounded transition-all active:cursor-grabbing shadow-lg backdrop-blur-sm",
        type === "atom"
          ? "h-12 w-12 rounded-full border-2 text-lg font-bold"
          : "h-10 w-16 rounded border px-2",
        color,
        isOverlay
          ? "scale-110 z-50 border-white shadow-cyan-500/50"
          : "hover:border-white/50"
      )}
    >
      {id === "bond-double" && !label ? (
        <div className="h-full w-full border-y-2 border-current"></div>
      ) : (
        label
      )}
    </div>
  );
}
