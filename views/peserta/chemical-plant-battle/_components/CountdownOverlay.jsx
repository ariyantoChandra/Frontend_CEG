import { Lock } from "lucide-react";

export default function CountdownOverlay({ countdown, errorMessage }) {
  if (countdown === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
      <Lock className="mb-4 h-16 w-16 animate-pulse text-rose-400" />
      {errorMessage && (
        <p className="mb-4 text-2xl font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}
      <div className="mb-2 text-6xl font-bold text-white">{countdown}s</div>
      <p className="text-xl text-zinc-300">
        Anda akan terhenti selama {countdown} detik
      </p>
    </div>
  );
}
