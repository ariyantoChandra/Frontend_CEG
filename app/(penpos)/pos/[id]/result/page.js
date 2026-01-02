"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/core/store/hooks";
import { penpos } from "@/core/services/api";
import useSWR from "swr";
import { toast } from "sonner";
import {
    extractTeamsData,
    buildSubmitPayload,
    DEFAULT_POS_TYPE,
    DEFAULT_POS_NAME,
    SUBMIT_DELAY,
    REDIRECT_DELAY,
} from "@/components/shared/penpos/utils";
import LoadingState from "@/components/shared/penpos/LoadingState";
import ErrorState from "@/components/shared/penpos/ErrorState";
import HeaderSection from "@/components/shared/penpos/HeaderSection";
import AlertMessages from "@/components/shared/penpos/AlertMessages";
import TeamCardsSection from "@/components/shared/penpos/TeamCardsSection";
import SubmitButtonSection from "@/components/shared/penpos/SubmitButtonSection";


export default function PostResultPage() {
    const router = useRouter();
    const userPenpos = useAppSelector((state) => state.user.userPenpos);

    const { data: currentTeamsData, error: fetchError, isLoading } = useSWR(
        userPenpos ? ["getCurrentTeams", userPenpos] : null,
        () => penpos.setUpdatedTeam({ currentPos: userPenpos })
    );

    const [gameResults, setGameResults] = useState({
        team1: { teamId: null, teamName: "", status: "" },
        team2: { teamId: null, teamName: "", status: "" },
    });
    const [posInfo, setPosInfo] = useState({ type: DEFAULT_POS_TYPE, name: DEFAULT_POS_NAME });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentTeamsData?.data?.data) {
            const teamsArray = currentTeamsData.data.data;
            const { posType, posName, team1, team2 } = extractTeamsData(teamsArray);

            setPosInfo({ type: posType, name: posName });
            setGameResults({ team1, team2 });
        }
    }, [currentTeamsData]);

    const handleTeam1StatusChange = (status) => {
        setGameResults((prev) => ({
            ...prev,
            team1: { ...prev.team1, status },
        }));
    };

    const handleTeam2StatusChange = (status) => {
        setGameResults((prev) => ({
            ...prev,
            team2: { ...prev.team2, status },
        }));
    };

    const isValid = () => {
        if (posInfo.type === "SINGLE") {
            return gameResults.team1.status !== "";
        }
        return gameResults.team1.status !== "" && gameResults.team2?.status !== "";
    };

    const submitResults = async () => {
        try {
            setSubmitting(true);
            setError(null);

            const payload = buildSubmitPayload(userPenpos, posInfo.type, gameResults);
            console.log("Mengirim hasil ke Backend:", payload);

            // TODO: Ganti dengan endpoint submit hasil yang sebenarnya
            // const response = await penpos.submitResults(payload);

            // Mock success
            await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY));

            setSubmitSuccess(true);
            toast.success("Hasil berhasil disimpan!");

            setTimeout(() => {
                router.push("/pos");
            }, REDIRECT_DELAY);
        } catch (err) {
            const errorMsg = err?.response?.data?.message || "Gagal menyimpan hasil. Silakan coba lagi.";
            setError(errorMsg);
            toast.error(errorMsg);
            console.error("Error submitting results:", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) return <LoadingState />;

    if (fetchError || !userPenpos) {
        return <ErrorState fetchError={fetchError} userPenpos={userPenpos} router={router} />;
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-950 px-4 py-12">
            {/* Background Effects */}
            <div className="absolute left-1/3 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]"></div>
            <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]"></div>

            <div className="relative z-10 mx-auto max-w-5xl">
                <HeaderSection posName={posInfo.name} />

                <AlertMessages error={error} submitSuccess={submitSuccess} />

                <div className="space-y-6">
                    <TeamCardsSection
                        posType={posInfo.type}
                        gameResults={gameResults}
                        submitting={submitting}
                        onTeam1StatusChange={handleTeam1StatusChange}
                        onTeam2StatusChange={handleTeam2StatusChange}
                    />

                    <SubmitButtonSection
                        isValid={isValid()}
                        submitting={submitting}
                        onSubmit={submitResults}
                    />
                </div>
            </div>
        </div>
    );
}
