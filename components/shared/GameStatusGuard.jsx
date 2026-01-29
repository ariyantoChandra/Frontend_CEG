"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function GameStatusGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const isRedirectingRef = useRef(false);
    const lastRedirectPathRef = useRef(null);

    useEffect(() => {
        if (isRedirectingRef.current) return;

        const isAuthPage = pathname === "/login" || pathname === "/register";
        const isPublicPage = pathname === "/" || pathname.startsWith("/#");

        if (isAuthPage || isPublicPage) {
            return;
        }

        const gameStatus = localStorage.getItem("gameStatus");

        if (gameStatus) {
            try {
                const parsedStatus = JSON.parse(gameStatus);

                if (parsedStatus.status === "waiting") {
                    const waitingListPath = `/rally/${parsedStatus.postId}/waiting-list`;

                    const isAllowedPath =
                        pathname === waitingListPath

                    if (!isAllowedPath && lastRedirectPathRef.current !== waitingListPath) {
                        isRedirectingRef.current = true;
                        lastRedirectPathRef.current = waitingListPath;

                        router.replace(waitingListPath);

                        setTimeout(() => {
                            isRedirectingRef.current = false;
                        }, 100);
                    } else if (isAllowedPath) {
                        lastRedirectPathRef.current = null;
                        isRedirectingRef.current = false;
                    }
                } else {
                    lastRedirectPathRef.current = null;
                    isRedirectingRef.current = false;
                }
            } catch (error) {
                console.error("Error parsing game status:", error);
                localStorage.removeItem("gameStatus");
                lastRedirectPathRef.current = null;
                isRedirectingRef.current = false;
            }
        } else {
            lastRedirectPathRef.current = null;
            isRedirectingRef.current = false;
        }
    }, [pathname, router]);

    return children;
}
