import { Factory } from "lucide-react";

export default function GameHeader() {
  return (
    <div className="mb-8 text-center">
      <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 backdrop-blur-sm">
        <Factory className="h-4 w-4 text-orange-400" />
        <span className="text-sm font-medium text-orange-400">
          Chemical Plant Battle
        </span>
      </div>

      <h1 className="mb-2 text-4xl font-bold text-white">
        Pilih Peralatan
      </h1>
      <p className="text-zinc-400">
        Klik peralatan untuk menjawab pertanyaan
      </p>
    </div>
  );
}
