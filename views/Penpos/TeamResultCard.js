"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, XCircle } from "lucide-react";
import useSWR from "swr";
import * as API from "@/core/services/api";

export default function TeamResultCard({ teamData, onStatusChange, teamNumber = 1 }) {
    const getGameSessionId = () => {
        try {
            return localStorage.getItem("game_sessions_id");
        } catch {
            return null;
        }
    };

    const gameSessionId = getGameSessionId();

    const { data: scoreData } = useSWR(
        gameSessionId ? ["getScore", gameSessionId] : null,
        async () => {
            if (!gameSessionId) return null;
            try {
                const response = await API.penpos.getScore({
                    game_session_id: gameSessionId,
                    role: "PENPOS",
                });
                return response?.data?.data || null;
            } catch (error) {
                console.error("Error fetching score:", error);
                return null;
            }
        }
    );

    const getScoreAndColor = () => {
        if (!scoreData) {
            return { score: 0, color: "text-zinc-400" };
        }

        const currentTeamScore = teamNumber === 1 ? scoreData.total_poin1 : scoreData.total_poin2;
        const otherTeamScore = teamNumber === 1 ? scoreData.total_poin2 : scoreData.total_poin1;

        const color = currentTeamScore >= otherTeamScore 
            ? "text-green-300" 
            : "text-red-400";

        return { score: currentTeamScore || 0, color };
    };

    const { score, color } = getScoreAndColor();

    return (
        <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="text-xl text-white flex items-center justify-between">
                    {teamData.teamName}
                    <span className={color}>{score}</span>
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Tentukan status akhir tim ini
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={teamData.status}
                    onValueChange={onStatusChange}
                    className="grid gap-4 sm:grid-cols-2"
                >
                    <div>
                        <RadioGroupItem
                            value="WIN"
                            id={`win-${teamData.teamId}`}
                            className="peer sr-only"
                        />
                        <Label
                            htmlFor={`win-${teamData.teamId}`}
                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-white/10 bg-zinc-950/50 p-6 transition-all hover:border-emerald-500/50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-500/10"
                        >
                            <CheckCircle2 className="mb-2 h-8 w-8 text-zinc-500 peer-data-[state=checked]:text-emerald-400" />
                            <span className="text-lg font-semibold text-white">Menang</span>
                        </Label>
                    </div>

                    <div>
                        <RadioGroupItem
                            value="LOSE"
                            id={`lose-${teamData.teamId}`}
                            className="peer sr-only"
                        />
                        <Label
                            htmlFor={`lose-${teamData.teamId}`}
                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-white/10 bg-zinc-950/50 p-6 transition-all hover:border-rose-500/50 peer-data-[state=checked]:border-rose-500 peer-data-[state=checked]:bg-rose-500/10"
                        >
                            <XCircle className="mb-2 h-8 w-8 text-zinc-500 peer-data-[state=checked]:text-rose-400" />
                            <span className="text-lg font-semibold text-white">Kalah</span>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}