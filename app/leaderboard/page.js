"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Trophy, Medal, Award, ArrowLeft, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as API from "@/core/services/api";

const getRankIcon = (rank) => {
  if (rank === 1) {
    return <Crown className="h-6 w-6 text-yellow-400" />;
  } else if (rank === 2) {
    return <Medal className="h-6 w-6 text-gray-300" />;
  } else if (rank === 3) {
    return <Medal className="h-6 w-6 text-amber-600" />;
  }
  return <Award className="h-5 w-5 text-gray-500" />;
};

const getRankBadgeColor = (rank) => {
  if (rank === 1) {
    return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
  } else if (rank === 2) {
    return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900";
  } else if (rank === 3) {
    return "bg-gradient-to-r from-amber-600 to-amber-700 text-white";
  }
  return "bg-gray-200 text-gray-700";
};

export default function LeaderboardPage() {
  const router = useRouter();

  const { data: apiResponse, error, isLoading } = useSWR(
    ["leaderboard"],
    async () => {
      try {
        const response = await API.admin.getLeaderBoard();
        return response?.data || null;
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      errorRetryCount: 1,
    }
  );

  const leaderboardData = useMemo(() => {
    if (!apiResponse?.success || !apiResponse?.data) return [];

    const data = apiResponse.data
      .map((item) => ({
        teamName: item.nama_tim,
        points: item.points !== null && item.points !== undefined ? item.points : 0,
        hasPoints: item.points !== null && item.points !== undefined,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        return a.teamName.localeCompare(b.teamName);
      })
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    return data;
  }, [apiResponse]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-teal-800 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Memuat data leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Gagal memuat data leaderboard.</p>
          <Button onClick={() => router.push("/admin")} variant="outline">
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin")}
              className="text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Leaderboard
                </h1>
                <p className="text-gray-500 text-sm">
                  Peringkat tim berdasarkan total poin
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent>
            {leaderboardData.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                Belum ada data leaderboard.
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboardData.map((team) => (
                  <div
                    key={team.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-gray-50 border ${team.rank <= 3 ? "bg-yellow-50/50 border-yellow-200" : "bg-white border-gray-100"
                      }`}
                  >
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getRankBadgeColor(
                        team.rank
                      )}`}
                    >
                      {team.rank <= 3 ? (
                        getRankIcon(team.rank)
                      ) : (
                        <span>{team.rank}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {team.teamName}
                        </h3>
                        {team.rank <= 3 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                            Top {team.rank}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {team.hasPoints ? team.points.toLocaleString() : "0"}
                      </div>
                      <div className="text-xs text-gray-500">Poin</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
