"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Dashboard/navbar";

export default function RegistrationClosed() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full font-sans">
      {/* Background yang sama dengan sebelumnya agar konsisten */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/Asset/Background Landscape.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <Navbar />

      <div className="relative flex flex-col items-center justify-center px-4 pt-10 pb-20 min-h-[80vh]">
        {/* Header Logo/Title */}
        <div className="mb-8 text-center">
          <Image
            src="/Asset/LOGIN.webp"
            alt="Welcome"
            width={400}
            height={150}
            className="drop-shadow-xl"
          />
        </div>

        {/* Card Pengumuman */}
        <div className="w-full max-w-2xl bg-white/20 backdrop-blur-xl border border-white/40 rounded-[40px] shadow-2xl p-10 md:p-16 text-center animate-in zoom-in duration-500">
          <div className="bg-teal-800/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-teal-900" />
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-teal-900 uppercase mb-4 tracking-tight">
            Pendaftaran Ditutup
          </h2>

          <div className="space-y-4">
            <p className="text-teal-900 text-lg font-medium">
              Terima kasih atas antusiasme yang luar biasa! Mohon maaf, masa
              pendaftaran untuk CEG 2026 telah berakhir.
            </p>
            <p className="text-teal-800/80 italic">
              Sampai jumpa di kompetisi berikutnya atau pantau terus media
              sosial kami untuk informasi selanjutnya.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/")}
              className="bg-teal-800 hover:bg-teal-900 text-white px-8 py-6 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <Home size={20} /> Kembali ke Beranda
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-teal-900 font-bold text-lg hover:bg-white/20 px-8 py-6 rounded-2xl"
            >
              <ArrowLeft size={20} className="mr-2" /> Sebelumnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
