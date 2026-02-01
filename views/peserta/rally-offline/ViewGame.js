"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ViewGame() {
  const router = useRouter();

  const handleExit = () => {
    localStorage.removeItem("game_data");
    localStorage.removeItem("gameStatus");
    router.push("/rally");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            Anda Sedang Bermain Offline
          </h1>
          <p className="text-zinc-400 text-lg">
            Jika sudah selesai bermain dan penpos sudah memberikan nilai, Bisa klik tombol keluar dibawah ini
          </p>
        </div>
        <div className="mt-8">
          <Button
            onClick={handleExit}
            className="bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
      </div>
    </div>
  );
}
