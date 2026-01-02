"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import {
    Zap,
    Shield,
    Droplets,
    Wind,
    Heart,
    Clock,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import * as API from "@/core/services/api";

// ==================== CONSTANTS ====================
const GAME_PHASES = {
    LOADING: "loading",
    PLAY: "play",
    WAITING: "waiting",
    ENDED: "ended",
};

const BATTLE_RESULTS = {
    WIN: "win",
    LOSE: "lose",
    DRAW: "draw",
};

const INITIAL_HEALTH = 100;
const INITIAL_SCORE = 0;

const BATTLE_DELAYS = {
    OPPONENT_PLAY: 1500,
    BATTLE_RESOLVE: 800,
    NEXT_ROUND: 2000,
};

const CARD_TYPES = {
    STRONG_ACID: {
        id: "asam_kuat",
        name: "Asam Kuat",
        color: "bg-red-600",
        icon: Zap,
        power: 8,
        effectiveness: { weak_acid: 1.5, strong_base: 0.5, weak_base: 1.2, neutral: 1 },
    },
    WEAK_ACID: {
        id: "asam_lemah",
        name: "Asam Lemah",
        color: "bg-orange-500",
        icon: Droplets,
        power: 5,
        effectiveness: { strong_acid: 0.7, strong_base: 0.3, weak_base: 1.5, neutral: 1 },
    },
    STRONG_BASE: {
        id: "basa_kuat",
        name: "Basa Kuat",
        color: "bg-blue-600",
        icon: Shield,
        power: 8,
        effectiveness: { strong_acid: 0.5, weak_acid: 1.5, weak_base: 1.2, neutral: 1 },
    },
    WEAK_BASE: {
        id: "basa_lemah",
        name: "Basa Lemah",
        color: "bg-cyan-500",
        icon: Wind,
        power: 5,
        effectiveness: { strong_acid: 1.5, weak_acid: 0.3, strong_base: 0.7, neutral: 1 },
    },
    NEUTRAL: {
        id: "netral",
        name: "Netral",
        color: "bg-gray-500",
        icon: Heart,
        power: 6,
        effectiveness: { strong_acid: 1, weak_acid: 1, strong_base: 1, weak_base: 1 },
    },
};

const CARD_TYPE_MAPPING = {
    asam_kuat: CARD_TYPES.STRONG_ACID,
    asam_lemah: CARD_TYPES.WEAK_ACID,
    netral: CARD_TYPES.NEUTRAL,
    basa_kuat: CARD_TYPES.STRONG_BASE,
    basa_lemah: CARD_TYPES.WEAK_BASE,
};

// Helper function to get card object from card type string
const getCardFromType = (cardType) => {
    const cardConfig = CARD_TYPE_MAPPING[cardType];
    if (!cardConfig) return null;

    return {
        ...cardConfig,
        id: cardType,
        type: cardConfig.id,
    };
};

// ==================== UTILITY FUNCTIONS ====================
const getGameSessionId = () => {
    try {
        const stored = localStorage.getItem("game_sessions");
        if (!stored) return null;

        try {
            const parsed = JSON.parse(stored);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed.game_session_id || parsed.id || parsed;
            }
            return parsed;
        } catch {
            return stored;
        }
    } catch (err) {
        console.error("Error reading game_sessions:", err);
        return null;
    }
};

const initializeHandFromAPI = (cardData) => {
    if (!cardData) return [];

    const hand = [];
    let id = 0;

    Object.entries(cardData).forEach(([cardType, quantity]) => {
        const cardConfig = CARD_TYPE_MAPPING[cardType];
        if (cardConfig && quantity > 0) {
            for (let i = 0; i < quantity; i++) {
                hand.push({
                    ...cardConfig,
                    id: `card_${id++}`,
                    type: cardConfig.id,
                });
            }
        }
    });

    return hand;
};

const determinePlayerTeam = (cardsData) => {
    let gameSessions = null;
    let userTeamId = null;

    try {
        const stored = localStorage.getItem("game_sessions");
        if (stored) {
            try {
                gameSessions = JSON.parse(stored);
            } catch {
                gameSessions = stored;
            }
        }

        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                userTeamId = parsedUser?.id_tim || parsedUser?.team_id || null;
            } catch {
                // Skip if not JSON
            }
        }
    } catch (err) {
        console.error("Error reading localStorage:", err);
    }

    let isPlayerTim1 = true;

    if (userTeamId) {
        if (cardsData.tim1 && userTeamId === cardsData.tim1) {
            isPlayerTim1 = true;
        } else if (cardsData.tim2 && userTeamId === cardsData.tim2) {
            isPlayerTim1 = false;
        }
    } else if (gameSessions) {
        if (typeof gameSessions === 'object') {
            if (gameSessions.tim1 || gameSessions.team1) {
                isPlayerTim1 = true;
            } else if (gameSessions.tim2 || gameSessions.team2) {
                isPlayerTim1 = false;
            }
        } else if (typeof gameSessions === 'string') {
            if (gameSessions.includes('tim2') || gameSessions.includes('team2')) {
                isPlayerTim1 = false;
            }
        }
    }

    return {
        isPlayerTim1,
        playerCards: isPlayerTim1 ? cardsData.card_tim1 : cardsData.card_tim2,
        opponentCards: isPlayerTim1 ? cardsData.card_tim2 : cardsData.card_tim1,
        playerTeamId: isPlayerTim1 ? cardsData.tim1 : cardsData.tim2,
    };
};

// ==================== SUB-COMPONENTS ====================
const GameCard = ({ card, isSelected, onClick, disabled = false }) => {
    const IconComponent = card.icon;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                relative w-20 h-28 rounded-lg transition-all duration-200
                ${card.color} p-2 flex flex-col items-center justify-center
                text-white font-bold text-center text-xs
                ${isSelected ? "ring-4 ring-yellow-400 scale-110" : ""}
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 cursor-pointer"}
                border-2 border-white/30 shadow-lg
            `}
        >
            <IconComponent className="w-6 h-6 mb-1" />
            <span className="text-[10px] leading-tight">{card.name}</span>
        </button>
    );
};

const BattleArena = ({ playerCard, opponentCard, battleResult, isWaiting, playerResult, opponentResult, onContinue }) => {
    const getResultMessage = () => {
        switch (battleResult) {
            case BATTLE_RESULTS.WIN:
                return "Anda Menang!";
            case BATTLE_RESULTS.LOSE:
                return "Anda Kalah!";
            case BATTLE_RESULTS.DRAW:
                return "Seri";
            default:
                return "";
        }
    };

    const getResultStyles = () => {
        switch (battleResult) {
            case BATTLE_RESULTS.WIN:
                return "bg-green-600/50 text-green-100";
            case BATTLE_RESULTS.LOSE:
                return "bg-red-600/50 text-red-100";
            case BATTLE_RESULTS.DRAW:
                return "bg-gray-600/50 text-gray-100";
            default:
                return "";
        }
    };

    const getResultBadgeStyles = (result) => {
        switch (result) {
            case "menang":
                return "bg-green-600/80 text-green-100";
            case "kalah":
                return "bg-red-600/80 text-red-100";
            case "seri":
                return "bg-gray-600/80 text-gray-100";
            default:
                return "bg-blue-600/50 text-white";
        }
    };

    return (
        <div className="flex-1 bg-gradient-to-b from-green-900/30 to-green-950/50 rounded-lg p-8 flex flex-col items-center justify-center border-2 border-green-600/30">
            <h2 className="text-white text-xl font-bold mb-8">Arena Pertarungan</h2>

            <div className="flex items-center justify-between w-full max-w-xs gap-4 mb-8">
                <div className="flex flex-col items-center">
                    <div className="text-white text-sm font-bold mb-2">Kartu Anda</div>
                    {playerCard ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className={`${playerCard.color} p-4 rounded-lg border-2 border-white/50 flex flex-col items-center`}>
                                <playerCard.icon className="w-8 h-8 text-white mb-2" />
                                <span className="text-white text-xs font-bold text-center">{playerCard.name}</span>
                            </div>
                            {playerResult && (
                                <div className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${getResultBadgeStyles(playerResult)}`}>
                                    {playerResult === "menang" ? "Menang" : playerResult === "kalah" ? "Kalah" : "Seri"}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-20 h-24 bg-gray-700 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center">
                            <span className="text-white/50 text-xs">Pilih Kartu</span>
                        </div>
                    )}
                </div>

                <div className="text-white text-2xl font-bold">VS</div>

                <div className="flex flex-col items-center">
                    <div className="text-white text-sm font-bold mb-2">Kartu Lawan</div>
                    {opponentCard ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className={`${opponentCard.color} p-4 rounded-lg border-2 border-white/50 opacity-75 flex flex-col items-center`}>
                                <opponentCard.icon className="w-8 h-8 text-white mb-2" />
                                <span className="text-white text-xs font-bold text-center">{opponentCard.name}</span>
                            </div>
                            {opponentResult && (
                                <div className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${getResultBadgeStyles(opponentResult)}`}>
                                    {opponentResult === "menang" ? "Menang" : opponentResult === "kalah" ? "Kalah" : "Seri"}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-20 h-24 bg-gray-700 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center">
                            {isWaiting ? (
                                <Clock className="w-6 h-6 text-white/50 animate-spin" />
                            ) : (
                                <span className="text-white/50 text-xs">Menunggu...</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {battleResult && (
                <div className={`text-center p-4 rounded-lg font-bold ${getResultStyles()}`}>
                    <div>{getResultMessage()}</div>
                </div>
            )}

            {/* Continue Button - Show when both results are available */}
            {playerResult && opponentResult && onContinue && (
                <div className="mt-6">
                    <Button
                        onClick={onContinue}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-bold shadow-lg transition-transform hover:scale-105"
                    >
                        Lanjutkan
                    </Button>
                </div>
            )}
        </div>
    );
};

const LoadingState = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-12 h-12 text-blue-400 animate-spin" />
            <p className="text-gray-400">Memuat kartu...</p>
        </div>
    </div>
);

const ErrorState = ({ onRetry }) => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <p className="text-red-400">Gagal memuat kartu. Silakan coba lagi.</p>
            <Button onClick={onRetry}>Muat Ulang</Button>
        </div>
    </div>
);

const MissingSessionState = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <p className="text-red-400">Game session tidak ditemukan. Silakan kembali ke waiting list.</p>
            <Button onClick={() => window.history.back()}>Kembali</Button>
        </div>
    </div>
);

const GameEnded = () => {
    const router = useRouter();

    const handleExit = useCallback(() => {
        // Remove game-related items from localStorage
        localStorage.removeItem("gameStatus");
        localStorage.removeItem("game_session_id");
        localStorage.removeItem("game_sessions");

        // Redirect to /rally
        router.push("/rally");
    }, [router]);

    return (
        <div className="mt-6 bg-gradient-to-r from-yellow-600/50 to-purple-600/50 border-2 border-yellow-500 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Permainan Selesai!</h2>
            <Button onClick={handleExit} className="mt-4">
                Keluar
            </Button>
        </div>
    );
};

// ==================== MAIN COMPONENT ====================
export default function ViewGame() {
    const params = useParams();
    const postId = params?.id;
    const gameSessionId = useMemo(() => getGameSessionId(), []);

    // Game state
    const [playerHand, setPlayerHand] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [playerCard, setPlayerCard] = useState(null);
    const [opponentCard, setOpponentCard] = useState(null);
    const [battleResult, setBattleResult] = useState(null);
    const [playerHealth, setPlayerHealth] = useState(INITIAL_HEALTH);
    const [opponentHealth, setOpponentHealth] = useState(INITIAL_HEALTH);
    const [playerScore, setPlayerScore] = useState(INITIAL_SCORE);
    const [opponentScore, setOpponentScore] = useState(INITIAL_SCORE);
    const [gamePhase, setGamePhase] = useState(GAME_PHASES.LOADING);
    const [roundCount, setRoundCount] = useState(0);
    const [playerTeamId, setPlayerTeamId] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCardForDialog, setSelectedCardForDialog] = useState(null);
    const [playerResult, setPlayerResult] = useState(null);
    const [opponentResult, setOpponentResult] = useState(null);
    const pollingTimeoutRef = useRef(null);

    // Fetch cards from API
    const { data: cardsData, error: cardsError, isLoading: isLoadingCards, mutate: mutateCards } = useSWR(
        postId && gameSessionId ? ["battle-abn-getCard", postId, gameSessionId] : null,
        async () => {
            if (!postId || !gameSessionId) return null;
            try {
                const response = await API.battleAbn.getCard({
                    game_session_id: String(gameSessionId),
                    penpos_id: parseInt(postId),
                });

                if (response?.data?.success && response?.data?.data) {
                    return response.data.data;
                }
                return null;
            } catch (err) {
                console.error("Error fetching cards:", err);
                throw err;
            }
        },
        {
            revalidateOnFocus: false,
            errorRetryCount: 1,
        }
    );

    // Initialize player hand from API data
    useEffect(() => {
        if (!cardsData) {
            // If cardsData is null or empty, set game phase to ENDED
            if (!isLoadingCards && cardsData === null) {
                setGamePhase(GAME_PHASES.ENDED);
            }
            return;
        }

        const { playerCards, playerTeamId: teamId } = determinePlayerTeam(cardsData);
        setPlayerTeamId(teamId);

        const hand = initializeHandFromAPI(playerCards);
        setPlayerHand(hand);
        setGamePhase(hand.length > 0 ? GAME_PHASES.PLAY : GAME_PHASES.ENDED);
    }, [cardsData, isLoadingCards]);

    // Battle logic
    const opponentPlayCard = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * playerHand.length);
        const card = playerHand[randomIndex];
        return {
            ...card,
            power: card.power + Math.floor(Math.random() * 4) - 2,
        };
    }, [playerHand]);

    const resolveBattle = useCallback((pCard, oCard) => {
        const effectiveness = pCard.effectiveness?.[oCard.type] || 1;
        const playerFinalPower = pCard.power * effectiveness;
        const opponentFinalPower = oCard.power;

        let result, playerDamage, opponentDamage;

        if (playerFinalPower > opponentFinalPower) {
            result = BATTLE_RESULTS.WIN;
            opponentDamage = Math.ceil(playerFinalPower - opponentFinalPower);
            playerDamage = 0;
            setPlayerScore((prev) => prev + 1);
        } else if (playerFinalPower < opponentFinalPower) {
            result = BATTLE_RESULTS.LOSE;
            playerDamage = Math.ceil(opponentFinalPower - playerFinalPower);
            opponentDamage = 0;
            setOpponentScore((prev) => prev + 1);
        } else {
            result = BATTLE_RESULTS.DRAW;
            playerDamage = 0;
            opponentDamage = 0;
        }

        setBattleResult(result);
        setPlayerHealth((prev) => Math.max(0, prev - playerDamage));
        setOpponentHealth((prev) => Math.max(0, prev - opponentDamage));

        const newHand = playerHand.filter((c) => c.id !== pCard.id);
        setPlayerHand(newHand);

        setTimeout(() => {
            setRoundCount((prev) => prev + 1);
            setPlayerCard(null);
            setOpponentCard(null);
            setBattleResult(null);
            setSelectedCard(null);
            setGamePhase(newHand.length > 0 ? GAME_PHASES.PLAY : GAME_PHASES.ENDED);
        }, BATTLE_DELAYS.NEXT_ROUND);
    }, [playerHand]);

    const handleCardClick = useCallback((card) => {
        if (gamePhase !== GAME_PHASES.PLAY) return;

        // Show confirmation dialog
        setSelectedCardForDialog(card);
        setIsDialogOpen(true);
    }, [gamePhase]);

    // Polling function to check if both cards are ready
    const pollCheckReadyCard = useCallback(async () => {
        if (!gameSessionId || !postId || !cardsData) return;

        try {
            const response = await API.battleAbn.checkReadyCard({
                game_session_id: String(gameSessionId),
                penpos_id: parseInt(postId),
            });

            if (response?.data?.success && response?.data?.data) {
                const { card_tim1, card_tim2, result1, result2, tim1, tim2 } = response.data.data;

                // Update results if available from checkReadyCard
                if (result1 !== undefined || result2 !== undefined) {
                    // Determine which result belongs to player
                    const isPlayerTim1 = (playerTeamId === tim1) || (cardsData?.tim1 && playerTeamId === cardsData.tim1);

                    // Update results based on player's team
                    if (isPlayerTim1) {
                        if (result1 !== undefined) setPlayerResult(result1);
                        if (result2 !== undefined) setOpponentResult(result2);
                    } else {
                        if (result1 !== undefined) setOpponentResult(result1);
                        if (result2 !== undefined) setPlayerResult(result2);
                    }
                }

                // If card_tim2 is available, set opponent card immediately
                if (card_tim2) {
                    const opponentCardObj = getCardFromType(card_tim2);
                    if (opponentCardObj) {
                        setOpponentCard(opponentCardObj);
                    }
                }

                // If both cards are ready, call resultSelectedCard
                if (card_tim1 && card_tim2) {
                    // Clear polling timeout
                    if (pollingTimeoutRef.current) {
                        clearTimeout(pollingTimeoutRef.current);
                        pollingTimeoutRef.current = null;
                    }

                    // Call resultSelectedCard API
                    try {
                        const resultResponse = await API.battleAbn.resultSelectedCard({
                            game_session_id: String(gameSessionId),
                            card1: card_tim1,
                            card2: card_tim2,
                        });

                        if (resultResponse?.data?.success && resultResponse?.data?.data) {
                            const {
                                result1,
                                result2,
                                card_tim1: cardTim1,
                                card_tim2: cardTim2,
                                tim1,
                                tim2
                            } = resultResponse.data.data;

                            // Determine which result belongs to player
                            const isPlayerTim1 = (playerTeamId === tim1) || (cardsData?.tim1 && playerTeamId === cardsData.tim1);

                            // Set opponent card based on which team is opponent
                            if (isPlayerTim1) {
                                // Player is tim1, opponent is tim2
                                const opponentCardObj = getCardFromType(cardTim2);
                                if (opponentCardObj) {
                                    setOpponentCard(opponentCardObj);
                                }
                                // Set results
                                setPlayerResult(result1);
                                setOpponentResult(result2);
                            } else {
                                // Player is tim2, opponent is tim1
                                const opponentCardObj = getCardFromType(cardTim1);
                                if (opponentCardObj) {
                                    setOpponentCard(opponentCardObj);
                                }
                                // Set results
                                setPlayerResult(result2);
                                setOpponentResult(result1);
                            }

                            // Set battle result based on player result
                            if (result1 && result2) {
                                const playerFinalResult = isPlayerTim1 ? result1 : result2;
                                if (playerFinalResult === "menang") {
                                    setBattleResult(BATTLE_RESULTS.WIN);
                                } else if (playerFinalResult === "kalah") {
                                    setBattleResult(BATTLE_RESULTS.LOSE);
                                } else if (playerFinalResult === "seri") {
                                    setBattleResult(BATTLE_RESULTS.DRAW);
                                }
                            }

                            toast.success("Kedua kartu sudah dipilih! Battle dimulai.");
                        } else {
                            toast.error("Gagal memproses hasil kartu.");
                        }
                    } catch (error) {
                        console.error("Error calling resultSelectedCard:", error);
                        toast.error("Gagal memproses hasil kartu.");
                    }
                } else {
                    // If card_tim2 is still null, continue polling
                    pollingTimeoutRef.current = setTimeout(() => {
                        pollCheckReadyCard();
                    }, 2000); // Poll every 2 seconds
                }
            }
        } catch (error) {
            console.error("Error polling checkReadyCard:", error);
            // Continue polling even on error
            pollingTimeoutRef.current = setTimeout(() => {
                pollCheckReadyCard();
            }, 2000);
        }
    }, [gameSessionId, postId, cardsData, playerTeamId]);

    const handleConfirmCardSelection = useCallback(async () => {
        if (!selectedCardForDialog) return;

        const card = selectedCardForDialog;
        setIsDialogOpen(false);

        try {
            // Call API getReadyCard
            const response = await API.battleAbn.getReadyCard({
                game_session_id: String(gameSessionId),
                card: card.type,
            });

            if (response?.data?.success) {
                // Remove card from hand (card already selected)
                setPlayerHand((prev) => prev.filter((c) => c.id !== card.id));

                // Set player card
                setPlayerCard(card);
                setSelectedCard(card.id);
                setGamePhase(GAME_PHASES.WAITING);

                toast.success("Kartu berhasil dipilih! Menunggu lawan...");

                // Start polling checkReadyCard
                // Wait a bit before starting to poll
                setTimeout(() => {
                    pollCheckReadyCard();
                }, 1000);
            } else {
                toast.error("Gagal memilih kartu. Silakan coba lagi.");
            }
        } catch (error) {
            console.error("Error selecting card:", error);
            toast.error("Gagal memilih kartu. Silakan coba lagi.");
        } finally {
            setSelectedCardForDialog(null);
        }
    }, [selectedCardForDialog, gameSessionId, postId, pollCheckReadyCard]);

    const handleCancelCardSelection = useCallback(() => {
        setIsDialogOpen(false);
        setSelectedCardForDialog(null);
    }, []);

    const handleContinue = useCallback(async () => {
        // Reset battle state for next round
        setPlayerCard(null);
        setOpponentCard(null);
        setPlayerResult(null);
        setOpponentResult(null);
        setBattleResult(null);
        setSelectedCard(null);

        // Mutate getCard to check if cards are empty
        try {
            const updatedCardsData = await mutateCards();
            
            // Check if cardsData is empty or null
            if (!updatedCardsData || (!updatedCardsData.card_tim1 && !updatedCardsData.card_tim2)) {
                setGamePhase(GAME_PHASES.ENDED);
                toast.info("Permainan selesai, tidak ada kartu tersisa");
                return;
            }

            // Check player cards specifically
            const { playerCards } = determinePlayerTeam(updatedCardsData);
            const hand = initializeHandFromAPI(playerCards);
            
            if (hand.length === 0) {
                setGamePhase(GAME_PHASES.ENDED);
                toast.info("Permainan selesai, tidak ada kartu tersisa");
                return;
            }

            // Re-enable card selection
            setGamePhase(GAME_PHASES.PLAY);
            toast.info("Pilih kartu untuk ronde berikutnya");
        } catch (error) {
            console.error("Error mutating cards:", error);
            // Still allow to continue if mutate fails
            setGamePhase(GAME_PHASES.PLAY);
            toast.info("Pilih kartu untuk ronde berikutnya");
        }
    }, [mutateCards]);

    // Cleanup polling on unmount or restart
    useEffect(() => {
        return () => {
            if (pollingTimeoutRef.current) {
                clearTimeout(pollingTimeoutRef.current);
                pollingTimeoutRef.current = null;
            }
        };
    }, []);

    const handleRestart = useCallback(() => {
        // Clear polling timeout
        if (pollingTimeoutRef.current) {
            clearTimeout(pollingTimeoutRef.current);
            pollingTimeoutRef.current = null;
        }

        setPlayerCard(null);
        setOpponentCard(null);
        setPlayerHealth(INITIAL_HEALTH);
        setOpponentHealth(INITIAL_HEALTH);
        setPlayerScore(INITIAL_SCORE);
        setOpponentScore(INITIAL_SCORE);
        setRoundCount(0);
        setBattleResult(null);
        setSelectedCard(null);
        setPlayerResult(null);
        setOpponentResult(null);
        setGamePhase(GAME_PHASES.LOADING);

        if (cardsData) {
            const { playerCards } = determinePlayerTeam(cardsData);
            const hand = initializeHandFromAPI(playerCards);
            setPlayerHand(hand);
            if (hand.length > 0) {
                setGamePhase(GAME_PHASES.PLAY);
            }
        }
    }, [cardsData]);

    // Early returns for different states
    if (!gameSessionId) {
        return <MissingSessionState />;
    }

    if (isLoadingCards || gamePhase === GAME_PHASES.LOADING) {
        return <LoadingState />;
    }

    if (cardsError) {
        return <ErrorState onRetry={() => window.location.reload()} />;
    }

    // If cardsData is null or empty after loading, show GameEnded
    if (!cardsData || (!cardsData.card_tim1 && !cardsData.card_tim2)) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6">
                <div className="max-w-6xl mx-auto">
                    <GameEnded />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Battle of ABN
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-3">
                        <BattleArena
                            playerCard={playerCard}
                            opponentCard={opponentCard}
                            battleResult={battleResult}
                            isWaiting={gamePhase === GAME_PHASES.WAITING}
                            playerResult={playerResult}
                            opponentResult={opponentResult}
                            onContinue={handleContinue}
                        />
                    </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-white font-bold mb-4">Tangan Anda</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {playerHand.length > 0 ? (
                            playerHand.map((card) => (
                                <GameCard
                                    key={card.id}
                                    card={card}
                                    isSelected={selectedCard === card.id}
                                    onClick={() => handleCardClick(card)}
                                    disabled={gamePhase !== GAME_PHASES.PLAY}
                                />
                            ))
                        ) : (
                            <div className="text-gray-400 py-8 col-span-4 text-center">Tidak ada kartu tersisa</div>
                        )}
                    </div>
                </div>

                {gamePhase === GAME_PHASES.ENDED && (
                    <GameEnded />
                )}
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className="bg-slate-900 border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white text-lg">
                            Konfirmasi Pilih Kartu
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Apakah Anda yakin ingin memilih kartu <strong className="text-white">{selectedCardForDialog?.name}</strong>?
                            Setelah dipilih, kartu ini tidak dapat dipilih lagi.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleCancelCardSelection}
                            className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                        >
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmCardSelection}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Ya, Pilih Kartu
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
