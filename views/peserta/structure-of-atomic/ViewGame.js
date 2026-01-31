"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, CheckCircle2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
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
    const page = localStorage.getItem("structure_of_atomic_page");
    return page ? parseInt(page, 10) : 1;
  } catch {
    return 1;
  }
};

const setCurrentPage = (page) => {
  try {
    localStorage.setItem("structure_of_atomic_page", page.toString());
  } catch (err) {
    console.error("Error setting page:", err);
  }
};

const getImagePaths = (page) => {
  return [
    `/Asset/image-soal-atom/page${page}-atom.webp`,
    `/Asset/image-soal-atom/page${page}-atom.webp`,
    `/Asset/image-soal-atom/page${page}-atom.webp`,
    `/Asset/image-soal-atom/page${page}-atom.webp`,
    `/Asset/image-soal-atom/page${page}-atom.webp`,
  ];
};

const ImageWithFallback = ({ page }) => {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const imagePaths = getImagePaths(page);

  const handleError = () => {
    if (currentSrcIndex < imagePaths.length - 1) {
      setCurrentSrcIndex(currentSrcIndex + 1);
    } else {
      const img = document.querySelector(`[data-page-image="${page}"]`);
      if (img) img.style.display = 'none';
    }
  };

  return (
    <img
      data-page-image={page}
      src={imagePaths[currentSrcIndex]}
      alt={`Struktur atom halaman ${page}`}
      className="max-w-full sm:max-w-xl md:max-w-2xl w-full h-auto"
      onError={handleError}
    />
  );
};

const StructureBox = ({ boxNumber, selectedItem, items, onSelectItem, disabled = false }) => {
  const getItemDisplay = (itemId) => {
    const item = items?.find((i) => i.id === itemId);
    if (!item) return "";
    if (item.name.includes("Karbon") || item.name.includes("Carbon")) return "C";
    if (item.name.includes("Hidrogen") || item.name.includes("Hydrogen")) return "H";
    if (item.name.includes("Oksigen") || item.name.includes("Oxygen")) return "O";
    if (item.name.includes("Tunggal") || item.name.includes("Single")) return "-";
    if (item.name.includes("Rangkap") || item.name.includes("Double")) return "=";
    return item.name;
  };

  const selectedItemName = selectedItem ? getItemDisplay(selectedItem) : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-md border-2 border-dashed transition-all",
            selectedItem
              ? "border-zinc-600 bg-zinc-800/50 text-white"
              : "border-zinc-700 bg-zinc-900/30 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-800/50",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {selectedItemName ? (
            <span className="text-lg sm:text-xl font-semibold">{selectedItemName}</span>
          ) : (
            <span className="text-xs sm:text-sm text-zinc-500">{boxNumber}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 max-h-[300px] overflow-y-auto bg-zinc-900 border-zinc-600 text-white">
        {items?.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => onSelectItem(boxNumber, item.id)}
            className="cursor-pointer hover:bg-zinc-700 text-white focus:bg-zinc-700 focus:text-white"
          >
            {item.name}
            {selectedItem === item.id && (
              <CheckCircle2 className="ml-auto h-4 w-4 text-cyan-400" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function ViewGame() {
  const router = useRouter();
  const [currentPage, setCurrentPageState] = useState(1);
  const [question, setQuestion] = useState(null);
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameSessionId, setGameSessionId] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    const sessionId = getGameSessionId();
    const page = getCurrentPage();
    setGameSessionId(sessionId);
    setCurrentPageState(page);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!gameSessionId) return;

      setIsLoading(true);
      try {
        const response = await API.structureOfAtomic.getItemsQuestion({
          game_session_id: gameSessionId,
          page: currentPage,
        });

        if (response?.data?.success) {
          const data = response.data.data;
          if (data.questions && data.questions.length > 0) {
            setQuestion(data.questions[0]);
          }
          if (data.items) {
            setItems(data.items);
          }
        } else {
          toast.error("Gagal memuat soal");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error?.response?.data?.message || "Gagal memuat soal");
      } finally {
        setIsLoading(false);
      }
    };

    if (gameSessionId && currentPage) {
      fetchData();
    }
  }, [gameSessionId, currentPage]);

  const handleSelectItem = (boxNumber, itemId) => {
    setAnswers((prev) => ({
      ...prev,
      [boxNumber]: itemId,
    }));
  };

  const handleSubmit = async () => {
    if (!gameSessionId || !question) return;

    const totalBoxes = question.kotak || 0;
    const filledBoxes = Object.keys(answers).length;
    
    if (filledBoxes < totalBoxes) {
      toast.error("Lengkapi semua kotak terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);
    try {
      const answerPayload = Object.entries(answers).map(([boxNumber, itemId]) => ({
        urutan_kotak: parseInt(boxNumber, 10),
        id_barang: itemId,
      }));

      const response = await API.structureOfAtomic.postResult({
        game_session_id: gameSessionId,
        page: currentPage,
        answer: answerPayload,
      });

      if (response?.data?.success) {
        toast.success("Jawaban berhasil dikirim!");
        
        if (currentPage === 5) {
          const score = response?.data?.data?.score || response?.data?.score || 0;
          setFinalScore(score);
          setShowResult(true);
          
          localStorage.removeItem("structure_of_atomic_page");
          localStorage.removeItem("game_data");
        } else {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage); 
          setCurrentPageState(nextPage);
          
          setAnswers({});
          setQuestion(null);
          setIsLoading(true);
          
          try {
            const nextPageResponse = await API.structureOfAtomic.getItemsQuestion({
              game_session_id: gameSessionId,
              page: nextPage,
            });

            if (nextPageResponse?.data?.success) {
              const data = nextPageResponse.data.data;
              if (data.questions && data.questions.length > 0) {
                setQuestion(data.questions[0]);
              }
              if (data.items) {
                setItems(data.items);
              }
            }
          } catch (error) {
            console.error("Error fetching next page data:", error);
            toast.error("Gagal memuat soal halaman berikutnya");
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        toast.error(response?.data?.message || "Gagal mengirim jawaban");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error(error?.response?.data?.message || "Gagal mengirim jawaban");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalBoxes = question?.kotak || 0;
  const columnsPerRow = 10;

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

  if (!question) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-400">Tidak ada soal tersedia</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-8 sm:p-12 shadow-2xl">
              {/* Trophy Icon */}
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6">
                  <Trophy className="h-16 w-16 text-yellow-500" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Permainan Selesai!
              </h1>

              {/* Completion Message */}
              <p className="text-lg sm:text-xl text-zinc-300 mb-8">
                Kamu sudah menyelesaikan permainan
              </p>

              {/* Score Display */}
              <div className="mb-8">
                <div className="inline-block bg-zinc-800/50 border border-zinc-700 rounded-xl px-8 py-6">
                  <p className="text-sm text-zinc-400 mb-2">Skor Akhir</p>
                  <p className="text-4xl sm:text-5xl font-bold text-cyan-400">
                    {finalScore}
                  </p>
                </div>
              </div>

              {/* Exit Button */}
              <Button
                onClick={() => {
                  localStorage.removeItem("structure_of_atomic_page");
                  localStorage.removeItem("game_data");
                  localStorage.removeItem("gameStatus");
                  
                  router.push("/rally");
                }}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-6 text-lg font-semibold"
              >
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-950 font-sans text-zinc-100 selection:bg-cyan-500/30">
      {/* TOP BAR */}
      <header className="flex flex-col sm:flex-row h-auto sm:h-20 items-start sm:items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 sm:px-8 py-3 sm:py-0 backdrop-blur-md">
        <div className="w-full sm:w-auto">
          <h1 className="flex items-center gap-2 text-base sm:text-xl font-bold tracking-tight text-white">
            <FlaskConical className="text-cyan-500 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Structure of Atomic </span>
            <span className="sm:hidden">Atomic</span>
            <span className="text-zinc-600 font-light">| Soal {currentPage}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 sm:mt-0 line-clamp-2 sm:line-clamp-none">{question.pertanyaan}</p>
        </div>
      </header>

      {/* MAIN CANVAS AREA */}
      <main className="relative flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
        <div className="container mx-auto px-4 py-6">
          {/* Question Section */}
          <div className="mb-4 sm:mb-6 text-center px-2">
            <h2 className="text-base sm:text-xl font-semibold text-white mb-2">
              {question?.pertanyaan}
            </h2>
          </div>

          {/* Structure Boxes Grid - Top Section */}
          <div className="mb-4 sm:mb-6 px-2">
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3 justify-items-center max-w-5xl mx-auto">
              {Array.from({ length: totalBoxes }, (_, i) => i + 1).map((boxNumber) => (
                <StructureBox
                  key={boxNumber}
                  boxNumber={boxNumber}
                  selectedItem={answers[boxNumber]}
                  items={items}
                  onSelectItem={handleSelectItem}
                />
              ))}
            </div>
          </div>

          {/* Divider Line */}
          <div className="my-4 sm:my-6 border-t-2 border-zinc-700"></div>

          {/* Image Section - Bottom */}
          <div className="flex justify-center items-center mb-4 sm:mb-6 px-2">
            <ImageWithFallback page={currentPage} />
          </div>

          {/* BOTTOM SUBMIT BUTTON */}
          <div className="flex justify-center mb-4 sm:mb-8 px-2">
            <div className="rounded-xl sm:rounded-2xl border border-zinc-700 bg-zinc-900/80 p-3 sm:p-4 shadow-2xl backdrop-blur-xl w-full sm:w-auto">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(answers).length < question.kotak}
                className={cn(
                  "w-full sm:w-40 text-sm sm:text-base",
                  isSubmitting
                    ? "bg-zinc-600 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-500"
                )}
              >
                {isSubmitting ? "Mengirim..." : "Kirim Jawaban"}
              </Button>
              {Object.keys(answers).length < question.kotak && (
                <p className="mt-2 text-center text-xs text-yellow-500">
                  Lengkapi semua kotak! ({Object.keys(answers).length}/{question.kotak})
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
