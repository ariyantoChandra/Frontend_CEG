"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, CheckCircle2, XCircle } from "lucide-react";

export default function RepairQuizModal({ tool, isOpen, onClose, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSubmit = () => {
    if (selectedOption !== null && !answered) {
      setAnswered(true);
      const isCorrect = tool.options[selectedOption].correct;
      setTimeout(() => {
        onAnswer(isCorrect);
        setSelectedOption(null);
        setAnswered(false);
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-white/10 bg-zinc-900/95 backdrop-blur-xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl text-white">
            <Settings className="h-6 w-6 text-cyan-400" />
            <span>Perbaikan: {tool?.name}</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Jawab pertanyaan berikut untuk memperbaiki alat ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question */}
          <div className="rounded-lg border border-white/10 bg-zinc-950/50 p-4">
            <p className="text-lg leading-relaxed text-white">
              {tool?.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {tool?.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const showResult = answered;
              const isCorrect = option.correct;

              return (
                <button
                  key={index}
                  onClick={() => !answered && setSelectedOption(index)}
                  disabled={answered}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    showResult && isCorrect
                      ? "border-emerald-500 bg-emerald-500/20"
                      : showResult && isSelected && !isCorrect
                      ? "border-rose-500 bg-rose-500/20"
                      : isSelected
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-white/10 bg-zinc-950/50 hover:border-cyan-500/50 hover:bg-zinc-900/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">{option.text}</span>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-rose-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          {!answered && (
            <Button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-6 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 disabled:opacity-50"
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Submit Jawaban
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
