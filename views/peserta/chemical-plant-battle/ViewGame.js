"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Factory, Sparkles, Loader2 } from "lucide-react";
import useSWR from "swr";
import * as API from "@/core/services/api";
import { getGameSessionId } from "./utils/getGameSessionId";
import { mapEquipmentData } from "./utils/mapEquipmentData";
import { hasGameStarted, markGameAsStarted } from "./utils/storage";

export default function ViewGame() {
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const gameSessionId = getGameSessionId();

  useEffect(() => {
    if (hasGameStarted()) {
      router.push("chemical-plant-battle/play");
    }
  }, [router]);

  const { data: apiResponse, error, isLoading } = useSWR(
    gameSessionId ? ["chemical-plant-battle-tools", gameSessionId] : null,
    async () => {
      if (!gameSessionId) return null;
      try {
        const response = await API.chemicalPlantBattle.getToolCp({
          game_session_id: gameSessionId,
        });
        return response?.data;
      } catch (err) {
        console.error("Error fetching equipment:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      errorRetryCount: 1,
    }
  );

  const equipmentList =
    apiResponse?.success && apiResponse?.data
      ? mapEquipmentData(apiResponse.data)
      : [];

  const handleStartGame = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    markGameAsStarted();
    router.push("chemical-plant-battle/play");
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"></div>
      <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 backdrop-blur-sm">
            <Factory className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-400">
              Chemical Plant Battle
            </span>
          </div>

          <h1 className="mb-2 text-4xl font-bold text-white">
            Peralatan Pabrik Kimia
          </h1>
          <p className="text-zinc-400">
            Pelajari berbagai peralatan yang digunakan dalam pabrik kimia
          </p>
        </div>

        {isLoading ? (
          <div className="mb-8 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
          </div>
        ) : error ? (
          <div className="mb-8 rounded-lg border border-rose-500/50 bg-rose-500/10 p-4 text-center">
            <p className="text-rose-400">
              Gagal memuat data peralatan. Silakan refresh halaman.
            </p>
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="mb-8 rounded-lg border border-zinc-500/50 bg-zinc-500/10 p-4 text-center">
            <p className="text-zinc-400">Tidak ada data peralatan.</p>
          </div>
        ) : (
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipmentList.map((equipment) => {
              return (
                <Card
                  key={equipment.id}
                  className="group border-white/10 bg-zinc-900/40 backdrop-blur-xl transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20"
                >
                  <CardHeader>
                    <div className="mb-4 flex items-center space-x-3">
                      {equipment.image && (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={equipment.image}
                            alt={equipment.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      )}
                      <CardTitle className="text-xl text-white">
                        {equipment.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-zinc-300">
                      {equipment.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={handleStartGame}
            className="w-full max-w-md bg-gradient-to-r from-orange-500 to-red-500 py-6 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Mulai Bermain
          </Button>
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="border-white/10 bg-zinc-900/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-white">
              Are You Sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-300">
              Setelah melanjutkan anda tidak bisa kembali ke halaman belajar
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-zinc-800 text-white hover:bg-zinc-700">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
