"use client";
import { Lock } from "lucide-react";

export default function FreezeOverlay({ remainingTime }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center">
        <Lock className="mx-auto mb-4 h-24 w-24 animate-pulse text-rose-400" />
        <h2 className="mb-2 text-3xl font-bold text-rose-400">
          SISTEM TERKUNCI!
        </h2>
        <p className="mb-4 text-xl text-zinc-400">Penalti untuk kesalahan</p>
        <div className="text-6xl font-bold text-white">{remainingTime}s</div>
      </div>
    </div>
  );
}
