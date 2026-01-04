"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import {
    Users,
    RefreshCw,
    Clock,
    AlertCircle,
    Play,
    LogOut,
    Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import * as API from "@/core/services/api";

const EmptyState = ({ isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-zinc-400">Memuat daftar menunggu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-zinc-400">Gagal memuat data. Silakan coba lagi.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-20">
            <Users className="w-12 h-12 text-zinc-600 mb-4" />
            <p className="text-zinc-400">Tidak ada data menunggu</p>
        </div>
    );
};

export default function WaitingListView() {
    const params = useParams();
    const router = useRouter();
    const currentPostId = params?.id;
    const [isQuitDialogOpen, setIsQuitDialogOpen] = useState(false);

    const { data, error, isLoading, mutate } = useSWR(
        currentPostId ? ["waiting-list", currentPostId] : null,
        async () => {
            if (!currentPostId) return null;
            try {
                const response = await API.rally.getWaitingList({
                    currentPos: parseInt(currentPostId),
                });
                return response?.data?.data || null;
            } catch (err) {
                throw err;
            }
        },
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    );

    const { data: dataCheck, mutate: mutateAcc } = useSWR(
        currentPostId ? ["checkStatusAcc", currentPostId] : null,
        async () => {
            if (!currentPostId) return null;
            try {
                const response = await API.rally.checkAcc();

                if (response?.data?.success === true && response?.data?.data) {
                    const gameData = response.data.data;

                    localStorage.setItem("game_data", JSON.stringify(gameData));
                    
                    localStorage.setItem("gameStatus", JSON.stringify({
                        status: "battle",
                        postId: currentPostId,
                        timestamp: new Date().getTime()
                    }));

                    router.push(`/rally/${currentPostId}/${gameData.nama_game}`);
                }

                return response?.data?.data || null;
            } catch (err) {
                throw err;
            }
        },
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
            errorRetryCount: 0,
        }
    );

    useEffect(() => {
        if (currentPostId) {
            const currentGameStatus = localStorage.getItem("gameStatus");
            let shouldSetWaiting = true;

            if (currentGameStatus) {
                try {
                    const parsed = JSON.parse(currentGameStatus);
                    if (parsed.status === "battle" && parsed.postId === currentPostId) {
                        shouldSetWaiting = false;
                    }
                } catch (e) {
                    // Jika parsing gagal, lanjutkan set waiting
                }
            }

            if (shouldSetWaiting) {
                localStorage.setItem("gameStatus", JSON.stringify({
                    status: "waiting",
                    postId: currentPostId,
                    timestamp: new Date().getTime()
                }));
            }
        }
    }, [currentPostId]);

    // Auto refresh every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            mutate();
            mutateAcc();
        }, 10000);

        return () => clearInterval(interval);
    }, [mutate, mutateAcc]);

    const handleQuitGame = async () => {
        toast.promise(
            API.rally.quitGame().then((response) => {
                if (response?.data) {
                    localStorage.removeItem("gameStatus");
                    setIsQuitDialogOpen(false);
                    setTimeout(() => router.push("/rally"), 1000);
                } else {
                    throw new Error("Gagal keluar dari permainan");
                }
            }),
            {
                loading: "Sedang keluar dari permainan...",
                success: "Berhasil keluar dari permainan",
                error: "Gagal keluar dari permainan. Silakan coba lagi.",
            }
        );
    };

    const teamsData = Array.isArray(data) ? data : [];
    const posName = teamsData.length > 0 ? teamsData[0]?.name_pos : "Game Post";
    const teamCount = teamsData.length;

    const hasData = teamCount > 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="py-2 text-xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                Daftar Menunggu
                            </h1>
                            <div className="flex items-center gap-2">
                                <Info className="inline w-4 h-4 text-blue-400" />
                                <span className="text-sm text-zinc-400">
                                    Tunggu hingga admin pos mengizinkan Anda masuk ke arena battle.
                                </span>
                            </div>
                        </div>
                        <AlertDialog open={isQuitDialogOpen} onOpenChange={setIsQuitDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 bg-red-600 border-none text-white hover:bg-red-700"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Keluar Permainan
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-900 border-slate-700">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white text-lg">
                                        Keluar Permainan?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-400">
                                        Apakah Anda yakin ingin keluar dari permainan ini?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel
                                        className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                                    >
                                        Batal
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleQuitGame}
                                        className="bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Keluar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Game Info */}
                {hasData && (
                    <div className="mb-6">
                        <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-600/30">
                            <CardHeader>
                                <CardTitle className="text-center text-white text-xl">{posName}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                                        <p className="text-gray-400 text-xs mb-1">Total Tim</p>
                                        <p className="text-white font-bold text-2xl">{teamCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Content */}
                {!hasData && (isLoading || error) ? (
                    <EmptyState isLoading={isLoading} error={error} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {teamsData.map((team, index) => (
                            <Card
                                key={index}
                                className="bg-gray-900/50 border-gray-700 overflow-hidden"
                            >
                                <CardHeader>
                                    <CardTitle className={`flex items-center gap-2 text-blue-300`}>
                                        <Users className="w-5 h-5" />
                                        {team.nama_tim}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        {team.status === "MENUNGGU" ? (
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-yellow-400" />
                                                <span className="text-yellow-400 text-sm font-semibold">{team.status}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Play className="w-4 h-4 text-green-500" />
                                                <span className="text-green-400 text-sm font-semibold">{team.status}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
