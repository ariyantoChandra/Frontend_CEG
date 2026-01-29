"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

export default function GameCompletionDialog({ isOpen, onExit }) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-400" />
          </div>
          <DialogTitle className="text-center text-2xl text-green-500">
            Permainan Selesai!
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Selamat! Anda telah menyelesaikan semua tantangan Chemical Plant Battle.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button
            onClick={onExit}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
          >
            Keluar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
