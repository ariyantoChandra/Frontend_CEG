"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function MaskotSplashScreen() {
    const [showGif, setShowGif] = useState(false);

    useEffect(() => {
        const hasSeenGif = localStorage.getItem("hasSeenMaskoGif");

        if (!hasSeenGif) {
            setShowGif(true);
            localStorage.setItem("hasSeenMaskoGif", "true");

            const timer = setTimeout(() => {
                setShowGif(false);
            }, 6500);

            return () => clearTimeout(timer);
        }
    }, []);

    if (!showGif) return null;

    return (
        <div className="fixed inset-0 z-[99] flex items-center justify-center backdrop-blur-md">
            <Image
                src="/Asset/Maskot.gif"
                alt="Maskot Splash"
                width={400}
                height={400}
                priority
                unoptimized
            />
        </div>
    );
}
