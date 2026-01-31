"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/core/store/hooks";
import { penpos } from "@/core/services/api";
import useSWR from "swr";
import { toast } from "sonner";
import {
    extractTeamsData,
    DEFAULT_POS_TYPE,
    DEFAULT_POS_NAME,
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
    const navigationBlockedRef = useRef(false);

    const { data: currentTeamsData, error: fetchError, isLoading } = useSWR(
        userPenpos ? ["getCurrentTeams", userPenpos] : null,
        () => penpos.setUpdatedTeam({ currentPos: userPenpos })
    );

    const [gameResults, setGameResults] = useState({
        team1: { teamId: null, teamName: "", status: "" },
        team2: { teamId: null, teamName: "", status: "" },
    });
    const getInitialPosType = () => {
        const storedPosType = localStorage.getItem("pos_type");
        return storedPosType || DEFAULT_POS_TYPE;
    };

    const [posInfo, setPosInfo] = useState({ type: getInitialPosType(), name: DEFAULT_POS_NAME });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [validationWarning, setValidationWarning] = useState(null);
    const [canNavigate, setCanNavigate] = useState(false);

    useEffect(() => {
        const storedPosType = localStorage.getItem("pos_type");

        if (currentTeamsData?.data?.data) {
            const teamsArray = currentTeamsData.data.data;
            const { posType, posName, team1, team2 } = extractTeamsData(teamsArray);

            const finalPosType = storedPosType || posType || DEFAULT_POS_TYPE;

            setPosInfo({ type: finalPosType, name: posName });
            setGameResults({ team1, team2 });
        } else {
            if (storedPosType) {
                setPosInfo((prev) => ({ ...prev, type: storedPosType }));
            }
        }
    }, [currentTeamsData]);

    const isValid = useCallback(() => {
        const posType = localStorage.getItem("pos_type") || posInfo.type || DEFAULT_POS_TYPE;

        if (posType === "SINGLE") {
            return gameResults.team1.status !== "";
        }
        
        if (gameResults.team1.status === "" || gameResults.team2?.status === "") {
            return false;
        }
        
        const winCount = [gameResults.team1.status, gameResults.team2?.status].filter(s => s === "WIN").length;
        return winCount <= 1;
    }, [gameResults, posInfo.type]);

    useEffect(() => {
        if (submitSuccess || canNavigate) {
            navigationBlockedRef.current = false;
            return;
        }

        navigationBlockedRef.current = !isValid();

        const handlePopState = (e) => {
            if (navigationBlockedRef.current) {
                window.history.pushState(null, "", window.location.href);
                toast.warning("Silakan pilih status menang/kalah untuk semua tim terlebih dahulu sebelum kembali.");
            }
        };

        const handleBeforeUnload = (e) => {
            if (navigationBlockedRef.current) {
                e.preventDefault();
                e.returnValue = "Anda harus memilih status menang/kalah untuk semua tim terlebih dahulu. Apakah Anda yakin ingin meninggalkan halaman ini?";
                return e.returnValue;
            }
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [submitSuccess, canNavigate, isValid]);


    const handleTeam1StatusChange = (status) => {
        setGameResults((prev) => {
            const newResults = {
                ...prev,
                team1: { ...prev.team1, status },
            };
            
            checkValidation(newResults);
            
            return newResults;
        });
    };

    const handleTeam2StatusChange = (status) => {
        setGameResults((prev) => {
            const newResults = {
                ...prev,
                team2: { ...prev.team2, status },
            };
            
            checkValidation(newResults);
            
            return newResults;
        });
    };

    const checkValidation = (results) => {
        const posType = localStorage.getItem("pos_type") || posInfo.type || DEFAULT_POS_TYPE;
        
        if (posType === "BATTLE" && results.team1.status && results.team2?.status) {
            if (results.team1.status === "WIN" && results.team2.status === "WIN") {
                setValidationWarning("Hanya satu tim yang boleh menang. Tidak boleh kedua tim menang bersamaan.");
            } else {
                setValidationWarning(null);
            }
        } else {
            setValidationWarning(null);
        }
    };

    const submitResults = async () => {
        try {
            setSubmitting(true);
            setError(null);

            const gameSessionId = localStorage.getItem("game_sessions_id");
            if (!gameSessionId) {
                throw new Error("Game session ID tidak ditemukan. Silakan mulai game terlebih dahulu.");
            }

            let resultPayload;

            const storedPosType = localStorage.getItem("pos_type");
            const posType = storedPosType || posInfo.type || "BATTLE";

            if (posType === "SINGLE") {
                if (gameResults.team1.status === "") {
                    throw new Error("Status tim harus diisi");
                }

                const result = gameResults.team1.status === "WIN";
                resultPayload = {
                    game_session_id: parseInt(gameSessionId),
                    result: result,
                    tim_id: gameResults.team1.teamId,
                };
            } else {
                const team1Status = gameResults.team1.status;
                const team2Status = gameResults.team2?.status;

                if (team1Status === "" || team2Status === "") {
                    throw new Error("Status kedua tim harus diisi");
                }

                if (team1Status === "WIN" && team2Status === "WIN") {
                    throw new Error("Hanya satu tim yang boleh menang. Tidak boleh kedua tim menang bersamaan.");
                }

                let tim_menang, tim_kalah;

                if (team1Status === "WIN" && team2Status === "LOSE") {
                    tim_menang = gameResults.team1.teamId;
                    tim_kalah = gameResults.team2.teamId;
                } else if (team1Status === "LOSE" && team2Status === "WIN") {
                    tim_menang = gameResults.team2.teamId;
                    tim_kalah = gameResults.team1.teamId;
                } else if (team1Status === "LOSE" && team2Status === "LOSE") {
                    tim_menang = null;
                    tim_kalah = null;
                } else {
                    throw new Error("Status tidak valid");
                }

                resultPayload = {
                    game_session_id: parseInt(gameSessionId),
                    tim_menang: tim_menang,
                    tim_kalah: tim_kalah,
                };
            }

            const response = await penpos.resultMatch(resultPayload);

            if (!response?.data) {
                throw new Error("Gagal menyimpan hasil");
            }

            setSubmitSuccess(true);
            setCanNavigate(true);
            toast.success(response?.data?.message || "Hasil berhasil disimpan!");

            localStorage.removeItem("game_sessions_id");
            localStorage.removeItem("pos_type");
            localStorage.removeItem("selectedTeams")

            setTimeout(() => {
                router.push("/pos");
            }, REDIRECT_DELAY);
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || "Gagal menyimpan hasil. Silakan coba lagi.";
            setError(errorMsg);
            toast.error(errorMsg);
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
            <div className="absolute left-1/3 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]"></div>
            <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]"></div>

            <div className="relative z-10 mx-auto max-w-5xl">
                <HeaderSection posName={posInfo.name} />

                <AlertMessages error={error} submitSuccess={submitSuccess} validationWarning={validationWarning} />

                <div className="space-y-6">
                    <TeamCardsSection
                        posType={localStorage.getItem("pos_type") || posInfo.type || DEFAULT_POS_TYPE}
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
