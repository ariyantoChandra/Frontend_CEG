"use client";
import { CheckCircle2, Lock } from "lucide-react";

export default function ToolCard({
  tool,
  isTarget,
  isFrozen,
  onClick,
  gameStarted,
}) {
  const Icon = tool.icon;
  const isFixed = tool.status === "FIXED";

  return (
    <button
      onClick={() => !isFrozen && !isFixed && gameStarted && onClick(tool)}
      disabled={isFrozen || isFixed || !gameStarted}
      className={`group relative overflow-hidden rounded-xl border-2 p-6 transition-all ${
        isFixed
          ? "border-emerald-500 bg-emerald-500/20 cursor-not-allowed"
          : isTarget
          ? "border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/50 animate-pulse"
          : isFrozen
          ? "border-zinc-700 bg-zinc-900/50 cursor-not-allowed opacity-50"
          : `border-${tool.color}-500/30 bg-zinc-900/40 hover:border-${tool.color}-500 hover:bg-${tool.color}-500/10 hover:shadow-lg hover:shadow-${tool.color}-500/20 cursor-pointer`
      }`}
    >
      {/* Fixed Badge */}
      {isFixed && (
        <div className="absolute right-2 top-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
      )}

      {/* Frozen Lock */}
      {isFrozen && !isFixed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Lock className="h-12 w-12 text-zinc-500" />
        </div>
      )}

      {/* Tool Image */}
      <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg">
        <img
          src={tool.image}
          alt={tool.name}
          className={`h-full w-full object-cover transition-transform ${
            !isFixed && !isFrozen ? "group-hover:scale-110" : ""
          }`}
        />
      </div>

      {/* Tool Icon & Name */}
      <div className="flex items-center space-x-3">
        <div className={`rounded-full bg-${tool.color}-500/20 p-2`}>
          <Icon className={`h-6 w-6 text-${tool.color}-400`} />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-white">{tool.name}</h3>
          <p className="text-xs text-zinc-400">
            {isFixed ? "FIXED" : "BROKEN"}
          </p>
        </div>
      </div>

      {/* Target Indicator */}
      {isTarget && !isFixed && (
        <div className="absolute left-0 top-0 w-full bg-gradient-to-r from-cyan-500 to-blue-500 p-1 text-center">
          <span className="text-xs font-bold text-white">TARGET</span>
        </div>
      )}
    </button>
  );
}
