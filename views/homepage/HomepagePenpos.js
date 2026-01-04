"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/core/store/hooks";
import { logout, setUserPenpos } from "@/core/feature/user/userSlice";
import { penpos } from "@/core/services/api";
import useSWR from "swr";
import { toast } from "sonner";
import { clearRole } from "@/core/feature/role/roleSlice";
import { clearToken } from "@/core/feature/token/tokenSlice";
import { extractPosData, extractTeamsData, buildGamePayload, REDIRECT_DELAY, SINGLE_MODE, BATTLE_MODE, MAX_TEAMS_BATTLE } from "@/components/shared/penpos/HomepageUtils";
import LoadingSpinner from "@/components/shared/penpos/LoadingSpinner";
import ModeIcon from "@/components/shared/penpos/ModeIcon";
import TeamCard from "@/components/shared/penpos/TeamCard";
import SubmitButton from "@/components/shared/penpos/SubmitButton";

export default function HomePagePenpos() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const userPenpos = useAppSelector((state) => state.user.userPenpos);

    const { data: responseGetPos } = useSWR(["getPos"], () => penpos.getPos());
    const { data: teamsResponse, error: teamsError, isLoading: isLoadingTeams } = useSWR(
        userPenpos ? ["getTeams", userPenpos] : null,
        () => penpos.setUpdatedTeam({ currentPos: userPenpos })
    );

    const [posInfo, setPosInfo] = useState({ name: "", type: BATTLE_MODE, id: null });
    const [teams, setTeams] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearRole());
        dispatch(clearToken());
        localStorage.removeItem("selectedTeams");
        toast.promise(router.push("/login"), {
            loading: "Logout...",
            success: "Berhasil logout.",
            error: "Gagal logout.",
        });
    };

    const handleTeamSelect = (teamId) => {
        const isSingleMode = posInfo.type === SINGLE_MODE;

        setSelectedTeams((prev) => {
            if (prev.includes(teamId)) {
                return prev.filter((id) => id !== teamId);
            }

            if (isSingleMode) {
                return [teamId];
            }

            if (prev.length < MAX_TEAMS_BATTLE) {
                return [...prev, teamId];
            }

            return prev;
        });
    };

    const handleStartGame = async () => {
        try {
            setSubmitting(true);

            const payload = buildGamePayload(posInfo.type, selectedTeams);
            const response = await penpos.startBattle(payload);

            if (!response?.data) {
                throw new Error("Gagal memulai battle");
            }

            localStorage.setItem("selectedTeams", JSON.stringify(selectedTeams));
            localStorage.setItem("game_sessions_id", response?.data?.data?.id);
            localStorage.setItem("pos_type", posInfo.type);
            toast.success("Battle dimulai! Mengarahkan ke halaman result...");

            setTimeout(() => {
                router.push(`/pos/${posInfo.id}/result`);
            }, REDIRECT_DELAY);
        } catch (err) {
            const errorMsg = err?.message || "Gagal memulai battle. Silakan coba lagi.";
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const posData = extractPosData(responseGetPos);
        if (posData) {
            dispatch(setUserPenpos(posData.id));
            setPosInfo({
                id: posData.id,
                name: posData.name,
                type: posData.type,
            });
            localStorage.setItem("pos_type", posData.type);
        }
    }, [responseGetPos, dispatch]);

    useEffect(() => {
        const extractedTeams = extractTeamsData(teamsResponse);
        if (extractedTeams.length > 0) {
            setTeams(extractedTeams);
        }
    }, [teamsResponse]);

    const isValidSelection = () => {
        if (posInfo.type === SINGLE_MODE) {
            return selectedTeams.length === 1;
        }
        return selectedTeams.length === MAX_TEAMS_BATTLE;
    };

    if (isLoadingTeams) {
        return <LoadingSpinner />;
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-950 px-4 py-12 font-sans">
            <div className="absolute right-4 top-4">
                <Button
                    variant="ghost"
                    className="border border-red-500 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                    onClick={handleLogout}
                >
                    Log Out
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            <div className="absolute left-1/3 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]"></div>
            <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]"></div>

            <div className="relative z-10 mx-auto max-w-5xl">
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 backdrop-blur-sm">
                        <ModeIcon type={posInfo.type} />
                        <span className="text-sm font-medium text-cyan-400">
                            Mode: {posInfo.type}
                        </span>
                    </div>

                    <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">
                        {posInfo.name}
                    </h1>
                    <p className="text-zinc-400">
                        Pilih {posInfo.type === SINGLE_MODE ? "1 tim" : "2 tim"} untuk memulai permainan
                    </p>
                </div>

                <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-2xl text-white">
                            <Users className="h-6 w-6 text-cyan-400" />
                            <span>Daftar Tim Tersedia</span>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {teams.map((team) => (
                                <TeamCard
                                    key={team.id}
                                    team={team}
                                    isSelected={selectedTeams.includes(team.id)}
                                    onSelect={handleTeamSelect}
                                />
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <SubmitButton
                            isSubmitting={submitting}
                            isValid={isValidSelection()}
                            posType={posInfo.type}
                            onClick={handleStartGame}
                        />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
