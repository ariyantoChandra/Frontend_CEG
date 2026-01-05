import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Instagram, MessageCircle, Phone } from "lucide-react";
import { SiLine } from "react-icons/si";
// IMPORT REDUX HOOK
import { useAppSelector } from "@/core/store/hooks";

const images = [
    "/Asset/DSC00643.JPG",
    "/Asset/FIO01873.JPG",
    "/Asset/DSC00474.JPG",
];

const faqData = [
    { id: 1, question: "Kapan pendaftaran terakhir?", answer: "Pendaftaran ditutup sesuai jadwal yang tertera di timeline." },
    { id: 2, question: "Apakah lomba ini tim atau individu?", answer: "Lomba ini bersifat tim sesuai ketentuan di booklet." },
    { id: 3, question: "Di mana lokasi babak final?", answer: "Babak final akan dilaksanakan di Kampus Universitas Surabaya." },
    { id: 4, question: "Bagaimana cara akses berkas?", answer: "Semua berkas bisa diunduh di bagian Resources di bawah ini." }
];

export default function HomepagePeserta() {
    const [active, setActive] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    // AMBIL TOKEN DARI STORE
    const token = useAppSelector((state) => state.token.token);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const prev = useCallback(() => {
        setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, []);

    const next = useCallback(() => {
        setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, []);

    const visibleImages = useMemo(() => {
        const result = [];
        if (isMobile) {
            result.push({ idx: active, src: images[active], isActive: true });
        } else {
            for (let i = -1; i <= 1; i++) {
                const idx = (active + i + images.length) % images.length;
                result.push({ idx, src: images[idx], isActive: i === 0 });
            }
        }
        return result;
    }, [active, isMobile]);

    return (
        <div className="relative w-full min-h-screen overflow-y-auto">
            {/* ===== BACKGROUND FIXED ===== */}
            <div className="fixed inset-0 -z-10">
                <Image src="/Asset/Background Landscape.png" alt="Background Landscape" fill className="object-cover" priority draggable={false} />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-0">
                {/* ===== SECTION 1: HOME ===== */}
                <section id="home" className="min-h-screen w-full flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center text-center max-w-5xl">
                        <div className="relative w-full max-w-2xl h-[200px] md:h-[180px] mt-24 mb-8 animate-in fade-in zoom-in duration-700">
                            <Image src="/Asset/CEG HOMEPAGE.png" alt="Chemical Engineering Games 2026" fill className="object-contain drop-shadow-2xl" priority draggable={false} />
                        </div>

                        <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-[30px] p-6 md:p-8 shadow-2xl mb-8">
                            <p className="text-sm md:text-lg font-medium leading-relaxed text-teal-950 text-justify md:text-center">
                                Chemical Engineering Games atau CEG merupakan lomba tahunan yang diselenggarakan oleh Program Studi Teknik Kimia Universitas Surabaya...
                            </p>
                        </div>

                        {/* LOGIKA TOMBOL DAFTAR / DASHBOARD */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {!token ? (
                                <Button asChild className="bg-teal-800 hover:bg-teal-900 text-white px-12 py-7 rounded-full text-xl font-bold shadow-lg transition-transform hover:scale-105">
                                    <Link href="/register">Daftar Sekarang</Link>
                                </Button>
                            ) : (
                                <Button asChild className="bg-teal-800 hover:bg-teal-900 text-white px-12 py-7 rounded-full text-xl font-bold shadow-lg transition-transform hover:scale-105">
                                    <Link href="/dashboard">Ke Dashboard Tim</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                {/* ... Bagian Gallery, Pre-event, Resources, FAQ tetap sama ... */}
                {/* Sembunyikan untuk menyingkat jawaban, codingan lain tetap sama */}
                 <section id="gallery" className="w-full flex flex-col items-center pb-14">
                    {/* ... content gallery ... */}
                    <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center mb-12">
                         {/* ... */}
                    </div>
                </section>

                 {/* ===== SECTION: FAQ ===== */}
                 <section id="faq" className="w-full flex flex-col gap-10 items-center pt-24 pb-20">
                    {/* ... content faq ... */}
                     <div className="grid gap-4 w-full">
                        {faqData.map((item) => (
                            <div key={item.id} className="group">
                                <h3 className="text-teal-900 font-black text-sm md:text-xl ml-4 mb-2">{item.id} {item.question}</h3>
                                <div className="bg-white/40 backdrop-blur-sm border border-white/40 rounded-[20px] px-6 py-4 shadow-sm group-hover:bg-white/60 transition-colors duration-200">
                                    <p className="text-teal-950 font-medium text-xs md:text-base leading-relaxed">{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            
             {/* ... Footer tetap sama ... */}
        </div>
    )
}