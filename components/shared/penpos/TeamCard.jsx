import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";

export default function TeamCard({ team, isSelected, onSelect }) {
    return (
        <div
            onClick={() => onSelect(team.id)}
            className={`group relative cursor-pointer rounded-xl border p-6 transition-all duration-300 ${isSelected
                ? "border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                : "border-white/10 bg-zinc-950/50 hover:border-white/20 hover:bg-zinc-900/80"
                }`}
        >
            <div className="mb-4 flex items-start justify-between">
                <Checkbox
                    checked={isSelected}
                    className="h-5 w-5 rounded-md border-white/30 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                />
                {isSelected && <CheckCircle2 className="h-5 w-5 text-cyan-400" />}
            </div>
            <h3 className="mb-1 text-lg font-semibold text-white">{team.name}</h3>
            <p className="text-xs text-zinc-500">{team.name_pos}</p>
        </div>
    );
}
