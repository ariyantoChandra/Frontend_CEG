"use client";

import { useDraggable } from "@dnd-kit/core";

export default function DraggableItem({ item, isDragging }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const Icon = item.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative cursor-grab rounded-xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-sm transition-all hover:border-${
        item.color
      }-500/50 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-${
        item.color
      }-500/20 active:cursor-grabbing ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className={`rounded-full bg-${item.color}-500/20 p-3`}>
          <Icon className={`h-6 w-6 text-${item.color}-400`} />
        </div>
        <span className="text-sm font-medium text-white">{item.name}</span>
      </div>
    </div>
  );
}
