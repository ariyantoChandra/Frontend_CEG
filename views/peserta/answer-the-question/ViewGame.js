"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, CheckCircle2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useSWR from "swr";
import * as API from "@/core/services/api";

const getGameSessionId = () => {
  try {
    const gameData = localStorage.getItem("game_data");
    if (!gameData) return null;
    try {
      const parsed = JSON.parse(gameData);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed.game_session_id || null;
      }
      return null;
    } catch {
      return null;
    }
  } catch (err) {
    console.error("Error reading game_data:", err);
    return null;
  }
};

const getCurrentPage = () => {
  try {
    const page = localStorage.getItem("answer_the_question_page");
    return page ? parseInt(page, 10) : 1;
  } catch {
    return 1;
  }
};

const setCurrentPage = (page) => {
  try {
    localStorage.setItem("answer_the_question_page", page.toString());
  } catch (err) {
    console.error("Error setting page:", err);
  }
};

export default function ViewGame() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameSessionId, setGameSessionId] = useState(null);
  const [currentPage, setCurrentPageState] = useState(1);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const sessionId = getGameSessionId();
    const page = getCurrentPage();
    setGameSessionId(sessionId);
    setCurrentPageState(page);
  }, []);

  const isQuizCompleted = currentPage > 20;

  const { data: questionData, error, isLoading } = useSWR(
    gameSessionId && currentPage && !isQuizCompleted
      ? ["answer-the-question", gameSessionId, currentPage]
      : null,
    async () => {
      if (!gameSessionId || isQuizCompleted) return null;
      try {
        const response = await API.answerTheQuestion.getItemsQuestion({
          game_session_id: gameSessionId,
          page: currentPage,
        });

        if (response?.data?.success) {
          return response.data.data;
        } else {
          toast.error("Gagal memuat soal");
          throw new Error(response?.data?.message || "Gagal memuat soal");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error?.response?.data?.message || "Gagal memuat soal");
        throw error;
      }
    }
  );

  const question = questionData?.questions && questionData.questions.length > 0
    ? questionData.questions[0]
    : null;

  useEffect(() => {
    setSelectedAnswer(null);
    setTextAnswer("");
    setAnswered(false);
  }, [question?.id, currentPage]);

  const isIsianType = question?.tipe === "ISIAN";

  const options = question && !isIsianType
    ? [
      { id: 1, text: question.opsi1, value: question.opsi1 },
      { id: 2, text: question.opsi2, value: question.opsi2 },
      { id: 3, text: question.opsi3, value: question.opsi3 },
      { id: 4, text: question.opsi4, value: question.opsi4 },
    ].filter(opt => opt.text !== null && opt.text !== undefined && opt.text !== "")
    : [];

  const handleSelectAnswer = (answerId) => {
    if (answered) return;
    setSelectedAnswer(answerId);
  };

  const handleTextAnswerChange = (e) => {
    if (answered) return;
    setTextAnswer(e.target.value);
  };

  const handleExit = () => {
    localStorage.removeItem("answer_the_question_page");
    localStorage.removeItem("game_data");
    localStorage.removeItem("gameStatus");

    router.push("/rally");
  };

  const handleSubmit = async () => {
    if (answered || !gameSessionId || !question || isQuizCompleted) return;

    if (isIsianType) {
      if (!textAnswer.trim()) {
        toast.error("Silakan isi jawaban terlebih dahulu");
        return;
      }
    } else {
      if (selectedAnswer === null) {
        toast.error("Silakan pilih jawaban terlebih dahulu");
        return;
      }
    }

    let answerText = "";
    if (isIsianType) {
      answerText = textAnswer.trim();
    } else {
      const selectedOption = options.find(opt => opt.id === selectedAnswer);
      if (!selectedOption) {
        toast.error("Jawaban tidak ditemukan");
        return;
      }
      answerText = selectedOption.value;
    }

    setIsSubmitting(true);
    setAnswered(true);

    try {
      const response = await API.answerTheQuestion.postResult({
        game_session_id: gameSessionId,
        answer: answerText,
        page: currentPage,
      });

      if (response?.data?.success) {
        toast.success("Jawaban berhasil dikirim!");

        const nextPage = currentPage + 1;

        if (nextPage > 20) {
          setCurrentPage(21);
          setCurrentPageState(21);
          toast.success("Selamat! Quiz telah selesai!");
        } else {
          setCurrentPage(nextPage);
          setCurrentPageState(nextPage);
        }

        setSelectedAnswer(null);
        setTextAnswer("");
        setAnswered(false);

      } else {
        toast.error(response?.data?.message || "Gagal mengirim jawaban");
        setAnswered(false);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error(error?.response?.data?.message || "Gagal mengirim jawaban");
      setAnswered(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isQuizCompleted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="text-center max-w-2xl mx-auto p-8">
          <div className="mb-6">
            <CheckCircle2 className="mx-auto h-20 w-20 text-emerald-500 mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Selesai!</h1>
            <p className="text-zinc-400 text-lg">
              Selamat! Anda telah menyelesaikan semua soal quiz.
            </p>
          </div>
          <div className="mt-8 rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-6">
            <p className="text-emerald-400 font-semibold mb-4">
              Sebelum keluar, Jangan lupa lapor ke pos!
            </p>
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

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="text-center">
          <FlaskConical className="mx-auto h-12 w-12 animate-spin text-cyan-500" />
          <p className="mt-4 text-zinc-400">Memuat soal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-400">Gagal memuat soal</p>
          <p className="mt-2 text-sm text-zinc-500">{error?.message || "Terjadi kesalahan"}</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-400">Tidak ada soal tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-cyan-500" />
            <h1 className="text-xl font-semibold text-white">
              Answer The Question
            </h1>
            <span className="text-zinc-500">| Soal {currentPage}/20</span>
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-white/10 bg-zinc-900/50 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-cyan-400">Pertanyaan</h2>
          <p className="text-lg leading-relaxed text-white">
            {question.pertanyaan}
          </p>
          {question.gambar_soal && (
            <div className="mt-4">
              <img
                src={question.gambar_soal}
                alt="Gambar soal"
                className="max-w-full rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {isIsianType ? (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-zinc-300">Jawaban:</h3>
              <textarea
                value={textAnswer}
                onChange={handleTextAnswerChange}
                disabled={answered || isSubmitting}
                placeholder="Ketik jawaban Anda di sini..."
                className="w-full min-h-[150px] rounded-lg border-2 border-white/10 bg-zinc-900/50 p-4 text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>
          ) : (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-zinc-300">Pilih Jawaban:</h3>
              <div className="space-y-3">
                {options.map((option) => {
                  const isSelected = selectedAnswer === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectAnswer(option.id)}
                      disabled={answered || isSubmitting}
                      className={`w-full rounded-lg border-2 p-4 text-left transition-all ${isSelected && !answered
                        ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/25"
                        : answered && isSelected
                          ? "border-cyan-500 bg-cyan-500/20"
                          : "border-white/10 bg-zinc-900/50 hover:border-cyan-500/50 hover:bg-zinc-800/50"
                        } ${answered || isSubmitting ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white">{option.text}</span>
                        {isSelected && !answered && (
                          <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {!answered && (
          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                (isIsianType ? !textAnswer.trim() : selectedAnswer === null)
              }
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-6 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <FlaskConical className="mr-2 h-5 w-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Submit Jawaban
                </>
              )}
            </Button>
          </div>
        )}

        {answered && (
          <div className="mt-6 rounded-lg border border-cyan-500/50 bg-cyan-500/10 p-4 text-center">
            <p className="text-cyan-400">Jawaban telah dikirim!</p>
          </div>
        )}
      </div>
    </div>
  );
}

