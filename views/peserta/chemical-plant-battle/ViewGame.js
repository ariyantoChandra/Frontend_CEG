"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Factory, Sparkles } from "lucide-react";
import { EQUIPMENT } from "./constants";

// Color mapping for Tailwind classes
const colorClasses = {
  blue: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
  },
  orange: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
  },
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
  },
  cyan: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
  },
  emerald: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
  },
  rose: {
    bg: "bg-rose-500/20",
    text: "text-rose-400",
  },
};

export default function ViewGame() {
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleStartGame = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    router.push("/rally/chemical-plant-battle/play");
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"></div>
      <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
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

        {/* Equipment Cards Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPMENT.map((equipment) => {
            const Icon = equipment.icon;
            return (
              <Card
                key={equipment.id}
                className="group border-white/10 bg-zinc-900/40 backdrop-blur-xl transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20"
              >
                <CardHeader>
                  <div className="mb-4 flex items-center space-x-3">
                    <div
                      className={`rounded-full ${colorClasses[equipment.color]?.bg || "bg-zinc-500/20"} p-3`}
                    >
                      <Icon
                        className={`h-6 w-6 ${colorClasses[equipment.color]?.text || "text-zinc-400"}`}
                      />
                    </div>
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

        {/* Start Game Button */}
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

      {/* Confirmation Dialog */}
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
