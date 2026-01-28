import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Factory } from "lucide-react";

import { Loader2 } from "lucide-react";

export default function QuestionDialog({
  isOpen,
  equipment,
  selectedAnswer,
  showResult,
  question,
  options,
  isLoadingQuestion,
  onClose,
  onAnswerSelect,
  onSubmit,
  onNext,
}) {
  if (!equipment) return null;

  const isCorrect = showResult && selectedAnswer !== null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-white/10 bg-zinc-900/95 backdrop-blur-xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl text-white">
            <Factory className="h-6 w-6 text-orange-400" />
            <span>{equipment.name}</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Jawab pertanyaan berikut dengan benar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question */}
          {isLoadingQuestion ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-white/10 bg-zinc-950/50 p-4">
                <p className="text-lg leading-relaxed text-white">
                  {question || "Memuat pertanyaan..."}
                </p>
              </div>

              {/* Options */}
              {!showResult && options.length > 0 && (
                <div className="space-y-3">
                  {options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const optionText = typeof option === "string" ? option : option.text || option;

                    return (
                      <button
                        key={index}
                        onClick={() => onAnswerSelect(index, optionText)}
                        className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                          isSelected
                            ? "border-cyan-500 bg-cyan-500/10"
                            : "border-white/10 bg-zinc-950/50 hover:border-cyan-500/50 hover:bg-zinc-900/50"
                        }`}
                      >
                        <span className="text-white">{optionText}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Result Display (only for correct answer) */}
          {showResult && isCorrect && (
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-emerald-500 bg-emerald-500/10 p-4">
                <p className="text-center text-lg font-semibold text-emerald-400">
                  Jawaban yang dipilih benar
                </p>
              </div>
              <Button
                onClick={onNext}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 py-6 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
              >
                Next
              </Button>
            </div>
          )}

          {/* Submit Button */}
          {!showResult && !isLoadingQuestion && (
            <Button
              onClick={onSubmit}
              disabled={selectedAnswer === null || options.length === 0}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-6 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 disabled:opacity-50"
            >
              Submit Jawaban
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
