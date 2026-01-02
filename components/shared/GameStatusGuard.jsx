"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function GameStatusGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const gameStatus = localStorage.getItem("gameStatus");

        if (gameStatus) {
            try {
                const parsedStatus = JSON.parse(gameStatus);

                // If user is in waiting status and tries to go to pages other than waiting list or battle
                if (parsedStatus.status === "waiting") {
                    const waitingListPath = `/rally/${parsedStatus.postId}/waiting-list`;
                    const battlePath = `/rally/${parsedStatus.postId}/battle-abn`;

                    // If current path is not waiting list or battle arena, redirect back
                    if (pathname !== waitingListPath && pathname !== battlePath && !pathname.includes("/battle-abn")) {
                        router.push(waitingListPath);
                    }
                }
            } catch (error) {
                console.error("Error parsing game status:", error);
                localStorage.removeItem("gameStatus");
            }
        }
    }, [pathname, router]);

    return children;
}
