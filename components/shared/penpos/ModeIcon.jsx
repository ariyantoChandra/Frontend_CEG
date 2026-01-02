import { Trophy, Swords } from "lucide-react";

const BATTLE_MODE = "BATTLE";

export default function ModeIcon({ type }) {
    if (type === BATTLE_MODE) {
        return <Swords className="h-4 w-4 text-cyan-400" />;
    }
    return <Trophy className="h-4 w-4 text-cyan-400" />;
}
