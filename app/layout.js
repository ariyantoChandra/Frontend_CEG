import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Providers from "@/core/store/Providers";
import Loader from "@/components/shared/Loader";
import GameStatusGuard from "@/components/shared/GameStatusGuard";
import MaskotsplashScreen from "@/components/shared/MaskotsplashScreen";
import AuthSync from "@/components/shared/AuthSync";
import { Suspense } from "react";

export const metadata = {
  title: "CEG - Chemical Engineering Games",
  description: "Website keren buatan Riyan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-zinc-950 text-white antialiased">
        <Providers>
          <AuthSync />
          {/* <MaskotsplashScreen /> */}
          <GameStatusGuard>
            <Suspense fallback={<Loader />}>
              {children}
            </Suspense>
          </GameStatusGuard>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}