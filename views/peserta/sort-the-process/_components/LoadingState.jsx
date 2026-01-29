import { Sparkles } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Sparkles className="mx-auto h-12 w-12 animate-pulse text-cyan-400" />
        <p className="mt-4 text-zinc-400">Memuat data...</p>
      </div>
    </div>
  );
}
