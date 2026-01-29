"use client";

import React, { useState } from "react";
import {
    Search,
    Swords,
    User,
    Circle,
    Gamepad2,
    ArrowRight,
    RefreshCw,
    Coins,
    Trophy,
} from "lucide-react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import * as API from "@/core/services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const getStatusConfig = (status) => {
    switch (status) {
        case "MENUNGGU":
            return {
                color: "text-emerald-400",
                badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                label: "Kosong",
                interactive: true,
            };
        case "BERMAIN":
            return {
                color: "text-red-500",
                badge: "bg-red-500/10 text-red-500 border-red-500/20",
                label: "Full",
                interactive: false,
            };
        default:
            return {
                color: "text-zinc-500",
                badge: "bg-zinc-500/10 text-zinc-400",
                label: "Unknown",
                interactive: false,
            };
    }
};

const getTypeStyles = (type) => {
    const isBattle = type === "BATTLE";
    return {
        isBattle,
        typeGlow: isBattle
            ? "hover:shadow-[0_0_30px_-5px_rgba(129,140,248,0.3)] hover:border-indigo-500/50"
            : "hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)] hover:border-emerald-500/50",
        iconColor: isBattle ? "text-indigo-400" : "text-emerald-400",
        typeBorder: isBattle ? "border-indigo-500/20" : "border-emerald-500/20",
        gradientFrom: isBattle ? "from-indigo-500/5" : "from-emerald-500/5",
        hoverBg: isBattle ? "hover:bg-indigo-600" : "hover:bg-emerald-600",
    };
};

export default function ListGame() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingPostId, setLoadingPostId] = useState(null);
    const router = useRouter();

    const {
        data,
        error,
        isLoading,
    } = useSWR(
        ["listGame"],
        async () => {
            try {
                const response = await API.pos.getListPos();
                return response?.data || null;
            } catch (err) {
                console.error("Fetch error:", err);
                throw err;
            }
        }
    );

    const {
        data: userInfoData,
        error: userInfoError,
        isLoading: isLoadingUserInfo,
    } = useSWR(
        ["userInfo"],
        async () => {
            try {
                const response = await API.user.getUserInfo();
                return response?.data || null;
            } catch (err) {
                console.error("Fetch user info error:", err);
                throw err;
            }
        }
    );

    const userInfo = userInfoData?.data || null;
    const points = userInfo?.points || 0;
    const koin = userInfo?.koin || 0;

    const posts = Array.isArray(data?.data) ? data.data : [];
    const filteredPosts = posts.filter((post) =>
        post.name_pos.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleJoinClick = async (post) => {
        try {
            setLoadingPostId(post.penpos_id);

            const payload = {
                current_pos: post.penpos_id,
            };

            const response = await API.rally.getUpdatedCurrentPost(payload);

            if (response?.data) {
                toast.success("Berhasil bergabung ke pos permainan!");
                router.push(`/rally/${post.penpos_id}/waiting-list`);
            } else {
                toast.error("Response tidak valid dari server");
            }
        } catch (err) {
            toast.error("Gagal bergabung ke pos permainan. Silakan coba lagi.");
        } finally {
            setLoadingPostId(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">
                {!isLoadingUserInfo && userInfo && (
                    <div className="flex items-center gap-4 justify-start">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                            <Trophy className="h-5 w-5 text-yellow-400" />
                            <span className="text-zinc-300 font-medium">Points:</span>
                            <span className="text-yellow-400 font-bold text-lg">{points}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                            <Coins className="h-5 w-5 text-emerald-400" />
                            <span className="text-zinc-300 font-medium">Koin:</span>
                            <span className="text-emerald-400 font-bold text-lg">{koin}</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                            Rally Arena
                        </h1>
                        <p className="text-zinc-400 mt-1">
                            Select a game post to start your challenge.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 z-50 h-4 w-4 text-white" />
                        <Input
                            placeholder="Search game post..."
                            className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 text-zinc-100 placeholder:text-zinc-600 backdrop-blur-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                        <p className="text-zinc-500">Scanning frequency...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                        <Gamepad2 className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-500">
                            Failed to load game posts. Please try again.
                        </p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                        <Gamepad2 className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-500">
                            No game posts found matching your signal.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => {
                            const statusConfig = getStatusConfig(post.status);
                            const typeStyles = getTypeStyles(post.tipe);
                            const { isBattle, typeGlow, iconColor, typeBorder, gradientFrom, hoverBg } =
                                typeStyles;
                            const { interactive: statusInteractive } = statusConfig;
                            const isPlayed = post.isPlayed === true;
                            const interactive = statusInteractive && !isPlayed;

                            return (
                                <Card
                                    key={post.penpos_id}
                                    className={`
                    group relative overflow-hidden transition-all duration-300
                    bg-zinc-900/40 backdroap-blur-md border border-zinc-800
                    ${interactive ? `${typeGlow} cursor-pointer` : "opacity-60 cursor-not-allowed grayscale-[0.5]"}
                  `}
                                >
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                    />

                                    {isPlayed && (
                                        <div className="absolute inset-0 flex items-center justify-center z-30 bg-zinc-900/10 backdrop-blur-sm">
                                            <p className="text-center text-zinc-300 font-medium px-4">
                                                Kamu sudah memainkan game ini
                                            </p>
                                        </div>
                                    )}

                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <Badge
                                            variant="outline"
                                            className={`uppercase text-[10px] tracking-wider font-bold ${typeBorder} ${iconColor} bg-zinc-950/50`}
                                        >
                                            {isBattle ? (
                                                <Swords className="w-3 h-3 mr-1" />
                                            ) : (
                                                <User className="w-3 h-3 mr-1" />
                                            )}
                                            {post.tipe}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                            <Circle
                                                className={`w-2 h-2 fill-current ${statusConfig.color}`}
                                            />
                                            <span
                                                className={`text-xs font-medium ${statusConfig.color}`}
                                            >
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <CardTitle className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                                            {post.name_pos}
                                        </CardTitle>
                                    </CardContent>

                                    <CardFooter className="pt-4">
                                        <Button
                                            onClick={() => handleJoinClick(post)}
                                            className={`w-full group/btn ${hoverBg} relative z-20`}
                                            variant={interactive ? "default" : "secondary"}
                                            disabled={!interactive || loadingPostId === post.penpos_id}
                                        >
                                            {loadingPostId === post.penpos_id ? "Joining..." : interactive ? "Join" : "Playing..."}
                                            {interactive && loadingPostId !== post.penpos_id && (
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
