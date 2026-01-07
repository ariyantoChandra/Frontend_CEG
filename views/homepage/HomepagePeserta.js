"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Instagram, Phone } from "lucide-react";
import { SiLine } from "react-icons/si";

// IMPORT REDUX HOOK UNTUK CEK LOGIN
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

    // AMBIL TOKEN DARI REDUX STORE
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
                <Image
                    src="/Asset/Background Landscape.png"
                    alt="Background Landscape"
                    fill
                    className="object-cover"
                    priority
                    draggable={false}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-0">
                {/* ===== SECTION 1: HOME ===== */}
                <section id="home" className="min-h-screen w-full flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center text-center max-w-5xl">
                        <div className="relative w-full max-w-2xl h-[200px] md:h-[180px] mb-8 animate-in fade-in zoom-in duration-700">
                            <Image
                                src="/Asset/CEG HOMEPAGE.png"
                                alt="Chemical Engineering Games 2026"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                                draggable={false}
                            />
                        </div>

                        <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-[30px] p-6 md:p-8 shadow-2xl mb-8">
                            <p className="text-sm md:text-lg font-medium leading-relaxed text-teal-950 text-justify md:text-center">
                                Chemical Engineering Games atau CEG merupakan lomba tahunan yang diselenggarakan oleh Program
                                Studi Teknik Kimia Universitas Surabaya dan ditujukan bagi siswa/i SMA/sederajat dari seluruh Indonesia.
                                Kegiatan ini dikemas dalam bentuk rangkaian games yang seru, edukatif, dan unik, sehingga peserta tidak hanya
                                ditantang secara kompetitif, tetapi juga diajak untuk berpikir kritis, kreatif, dan strategis.
                            </p>
                        </div>

                        {/* LOGIKA TOMBOL: Jika Token Ada (Login) -> Dashboard, Jika Tidak -> Register */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {!token && (
                                <Button asChild className="bg-teal-800 hover:bg-teal-900 text-white px-12 py-7 rounded-full text-xl font-bold shadow-lg transition-transform hover:scale-105">
                                    <Link href="/register">Daftar Sekarang</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                {/* ===== SECTION 2: GALLERY & ABOUT ===== */}
                <section id="gallery" className="w-full flex flex-col items-center pb-14">
                    <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center mb-12">
                        <div
                            onClick={prev}
                            className="absolute left-0 z-20 bg-white text-teal-800 rounded-full w-10 h-10 flex items-center justify-center shadow transition-colors cursor-pointer hover:bg-teal-50"
                        >
                            <ChevronLeft />
                        </div>
                        <div className="flex items-center justify-center gap-6 overflow-hidden w-full">
                            {visibleImages.map(({ idx, src, isActive }) => (
                                <div
                                    key={idx}
                                    className={`relative transition-[transform,opacity] duration-300 will-change-transform ${isMobile
                                        ? "w-full max-w-[90vw] h-[200px] md:h-[280px] scale-100 opacity-100 z-10"
                                        : isActive
                                            ? "w-[500px] h-[280px] scale-100 opacity-100 z-10"
                                            : "w-[380px] h-[220px] scale-90 opacity-40"
                                        }`}
                                >
                                    <Image
                                        src={src}
                                        alt={`Gallery ${idx}`}
                                        fill
                                        className="object-cover rounded-[25px]"
                                        loading={isActive ? "eager" : "lazy"}
                                        sizes="(max-width: 768px) 90vw, 500px"
                                    />
                                </div>
                            ))}
                        </div>
                        <div
                            onClick={next}
                            className="absolute right-0 z-20 bg-white text-teal-800 rounded-full w-10 h-10 flex items-center justify-center shadow transition-colors cursor-pointer hover:bg-teal-50"
                        >
                            <ChevronRight />
                        </div>
                    </div>

                    <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                        <div className="md:col-span-8 flex flex-col items-start">
                            <div className="w-full mb-6">
                                <Image
                                    src="/Asset/CEG 2026.png"
                                    alt="Title"
                                    width={800}
                                    height={200}
                                    className="w-full h-auto object-contain"
                                    draggable={false}
                                    loading="lazy"
                                />
                            </div>
                            <div className="bg-white/40 backdrop-blur-sm rounded-[25px] p-6 md:p-8 shadow-lg w-full border border-white/20">
                                <h3 className="font-black text-teal-800 text-xl mb-1">TEMA</h3>
                                <p className="text-teal-950 font-bold mb-4 text-sm md:text-base uppercase italic">AGRINOVA: Agricultural Innovation for Sustainable Nutrition Advancement</p>
                                <p className="text-teal-950 font-medium text-sm md:text-base leading-relaxed text-justify">
                                    AGRINOVA menggambarkan sebuah ledakan inovasi yang lahir dari dunia
                                    pertanian sebagai respons terhadap tantangan pangan masa kini dan
                                    masa depan. Kata “Nova” berarti bintang baru, yang menjadi simbol
                                    munculnya gagasan, pendekatan, dan terobosan baru dalam menciptakan
                                    sistem pangan yang lebih sehat, efisien, dan ramah lingkungan.
                                    Melalui konsep ini, AGRINOVA merepresentasikan semangat pembaruan
                                    dan kreativitas dalam mengembangkan pertanian modern yang tidak hanya
                                    berorientasi pada hasil, tetapi juga pada keberlanjutan dan kualitas.
                                    AGRINOVA merupakan langkah transformasi dari pertanian tradisional
                                    menuju sistem pangan masa depan yang berbasis pada sains, teknologi,
                                    dan prinsip keberlanjutan, guna mendukung ketahanan pangan serta
                                    kesejahteraan generasi mendatang.
                                </p>
                            </div>
                        </div>
                        <div className="md:col-span-4 flex justify-center items-end">
                            <Image
                                src="/Asset/No Background.png"
                                alt="Mascot"
                                width={500}
                                height={500}
                                className="w-full h-auto drop-shadow-2xl object-contain"
                                draggable={false}
                                loading="lazy"
                            />
                        </div>
                    </div>
                </section>

                {/* ===== SECTION: DETAILS ===== */}
                <section id="competition-details" className="w-full flex flex-col items-center">
                    <div className="flex items-center flex-col gap-3 md:gap-10">
                        <div>
                            <Image
                                src="/Asset/TIMELINE.png"
                                alt="Timeline"
                                width={400}
                                height={100}
                                className="drop-shadow-2xl w-[200px] md:w-[350px] h-auto object-contain"
                                draggable={false}
                                loading="lazy"
                            />
                        </div>
                        <div className="relative w-full mb-10 md:mb-20">
                            <Image
                                src="/Asset/TIMELINE (1).png"
                                alt="Schedule"
                                width={1200}
                                height={600}
                                className="w-full h-auto drop-shadow-2xl"
                                draggable={false}
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <div className="flex items-center flex-col gap-3 md:gap-10">
                        <div>
                            <Image
                                src="/Asset/BABAK PERLOMBAAN (1).png"
                                alt="Babak"
                                width={550}
                                height={150}
                                className="drop-shadow-2xl w-[280px] md:w-[550px] h-auto object-contain"
                                draggable={false}
                                loading="lazy"
                            />
                        </div>
                        <div className="relative w-full">
                            <Image
                                src="/Asset/BABAK PERLOMBAAN.png"
                                alt="Detail"
                                width={1200}
                                height={600}
                                className="w-full h-auto drop-shadow-2xl"
                                draggable={false}
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <div className="flex items-center flex-col gap-0 mt:gap-10">
                        <div>
                            <Image
                                src="/Asset/HADIAH TEXT.png"
                                alt="Babak"
                                width={550}
                                height={150}
                                className="drop-shadow-2xl w-[280px] md:w-[550px] h-auto object-contain"
                                draggable={false}
                                loading="lazy"
                            />
                        </div>
                        <div className="relative w-full">
                            <Image
                                src="/Asset/HADIAH.png"
                                alt="Detail"
                                width={1200}
                                height={600}
                                className="w-full h-auto drop-shadow-2xl"
                                draggable={false}
                                loading="lazy"
                            />
                        </div>
                    </div>
                </section>

                {/* ===== SECTION: PRE-EVENT (DENGAN HARGA) ===== */}
                <section id="pre-event" className="w-full flex flex-col items-center pt-20 md:pt-24">
                    <div>
                        <Image
                            src="/Asset/PRE-EVENT (1) (1).png"
                            alt="Pre-Event"
                            width={400}
                            height={100}
                            className="drop-shadow-2xl w-[220px] md:w-[400px] h-auto object-contain"
                            draggable={false}
                            loading="lazy"
                        />
                    </div>

                    {/* === TAMBAHAN PRICE LIST DI SINI === */}
                    <div className="flex flex-col md:flex-row gap-6 my-8 z-10 px-4 w-full justify-center">
                        <div className="bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-2xl text-center shadow-lg transform hover:scale-105 transition-transform w-full md:w-64">
                            <h3 className="text-teal-900 font-bold text-xl mb-1">EARLY BIRD</h3>
                            <p className="text-teal-800 text-sm mb-3">6 - 22 Januari 2026</p>
                            <p className="text-3xl font-black text-[#d64040]">Rp 150.000</p>
                            <p className="text-teal-900/60 text-xs mt-2">Per Tim</p>
                        </div>
                        <div className="bg-teal-900/10 backdrop-blur-md border border-teal-900/20 p-6 rounded-2xl text-center shadow-lg transform hover:scale-105 transition-transform w-full md:w-64">
                            <h3 className="text-teal-900 font-bold text-xl mb-1">NORMAL</h3>
                            <p className="text-teal-800 text-sm mb-3">23 Januari - 21 Februari 2026</p>
                            <p className="text-3xl font-black text-teal-900">Rp 170.000</p>
                            <p className="text-teal-900/60 text-xs mt-2">Per Tim</p>
                        </div>
                        <div className="bg-gradient-to-b from-yellow-300/40 to-yellow-500/40 backdrop-blur-md border border-yellow-400 p-6 rounded-2xl text-center shadow-xl transform hover:scale-105 transition-transform relative overflow-hidden w-full md:w-64">
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">HEMAT!</div>
                            <h3 className="text-teal-900 font-bold text-xl mb-1">BUNDLE (3 Tim)</h3>
                            <p className="text-teal-800 text-sm mb-3">Early Bird</p>
                            <p className="text-3xl font-black text-[#d64040]">Rp 435.000</p>
                            <p className="text-teal-900/60 text-xs mt-2">Total 3 Tim</p>
                        </div>
                    </div>

                    <div className="relative w-full max-w-4xl px-4">
                        <Image
                            src="/Asset/PRE-EVENT.png"
                            alt="Poster"
                            width={1200}
                            height={600}
                            className="w-full h-auto drop-shadow-2xl"
                            draggable={false}
                            loading="lazy"
                        />
                    </div>
                </section>

                {/* ===== SECTION: RESOURCES ===== */}
                <section id="resources" className="w-full flex flex-col items-center">
                    <div>
                        <Image
                            src="/Asset/RESOURCES.png"
                            alt="Resources"
                            width={400}
                            height={100}
                            className="drop-shadow-2xl w-[260px] md:w-[450px] h-auto object-contain"
                            draggable={false}
                            loading="lazy"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                        <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-[40px] p-8 shadow-2xl flex flex-col items-center group">
                            <Image
                                src="/Asset/RESOURCES BOOKLET.png"
                                alt="Icon"
                                width={150}
                                height={150}
                                className="mb-6 group-hover:scale-105 transition-transform duration-200 will-change-transform"
                                draggable={false}
                                loading="lazy"
                            />
                            <h3 className="text-2xl font-black text-teal-800 mb-2">Booklet Peserta</h3>
                            <p className="text-teal-900/60 text-sm mb-8 text-center leading-relaxed">Informasi mendalam mengenai pendaftaran dan aturan.</p>
                            <Button asChild className="w-full bg-[#58a644] hover:bg-[#4a8c39] py-7 rounded-2xl font-bold text-lg">
                                <Link href="/Asset/GUIDELINE BOOK CEG 2026 (1).pdf">Download Booklet</Link>
                            </Button>
                        </div>
                        <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-[40px] p-8 shadow-2xl flex flex-col items-center group">
                            <Image
                                src="/Asset/RESOURCES SOP.png"
                                alt="Icon"
                                width={150}
                                height={150}
                                className="mb-6 group-hover:scale-105 transition-transform duration-200 will-change-transform"
                                draggable={false}
                                loading="lazy"
                            />
                            <h3 className="text-2xl font-black text-teal-800 mb-2">SOP Lomba</h3>
                            <p className="text-teal-900/60 text-sm mb-8 text-center leading-relaxed">Panduan operasional selama hari-H kompetisi.</p>
                            <Button asChild className="w-full bg-[#1b8a86] hover:bg-[#156e6b] py-7 rounded-2xl font-bold text-lg">
                                <Link href="/Asset/Standart Operational Procedure Chemical Engineering Games 2026.pdf">Download SOP</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* ===== SECTION: FAQ ===== */}
                <section id="faq" className="w-full flex flex-col gap-10 items-center pt-24">
                    <div>
                        <Image
                            src="/Asset/FAQ.png"
                            alt="FAQ"
                            width={400}
                            height={100}
                            className="drop-shadow-2xl w-full md:w-[700px] h-auto object-contain"
                            draggable={false}
                            loading="lazy"
                        />
                    </div>
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

            {/* ===== FOOTER: CONTACT & PARTNERS ===== */}
            <footer id="CP&Partner" className="relative w-full mt-24 bg-white/20 backdrop-blur-md border-t border-white/30">
                <div className="w-full px-4 md:px-6 py-6 md:py-8">
                    <div className="mb-6 md:mb-8">
                        <h3 className="text-xl md:text-2xl font-bold text-teal-800 mb-4 text-center md:text-left">
                            Contact Person
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/40">
                                <Instagram className="w-5 h-5 md:w-6 md:h-6 text-teal-700 shrink-0" />
                                <span className="text-teal-900 font-medium text-sm md:text-base">
                                    @ceg.ubaya
                                </span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/40">
                                <SiLine className="w-5 h-5 md:w-6 md:h-6 text-teal-700 shrink-0" />
                                <span className="text-teal-900 font-medium text-sm md:text-base">
                                    justin_loka (Justin)
                                </span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/40">
                                <SiLine className="w-5 h-5 md:w-6 md:h-6 text-teal-700 shrink-0" />
                                <span className="text-teal-900 font-medium text-sm md:text-base">
                                    01safsafira (Safira)
                                </span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/40">
                                <Phone className="w-5 h-5 md:w-6 md:h-6 text-teal-700 shrink-0" />
                                <span className="text-teal-900 font-medium text-sm md:text-base">
                                    087856913888 (Justin)
                                </span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/40">
                                <Phone className="w-5 h-5 md:w-6 md:h-6 text-teal-700 shrink-0" />
                                <span className="text-teal-900 font-medium text-sm md:text-base">
                                    088803163354 (Safira)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/30 my-6 md:my-8"></div>

                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-teal-800 mb-4 text-center md:text-left">
                            Media Partner
                        </h3>
                        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-3 pb-10 md:gap-4 items-center justify-items-center">
                            <div className="relative w-full aspect-square max-w-24 md:max-w-32 bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/40 flex items-center justify-center hover:bg-white/60 transition-colors">
                                <Image src="/Asset/medpar/logoEJT.png" alt="Event Jawa Timur" fill className="object-contain p-2" draggable={false} loading="lazy" />
                            </div>
                            <div className="relative w-full aspect-square max-w-24 md:max-w-32 bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/40 flex items-center justify-center hover:bg-white/60 transition-colors">
                                <Image src="/Asset/medpar/logolombasma.png" alt="Lomba SMA" fill className="object-contain p-2" draggable={false} loading="lazy" />
                            </div>
                            <div className="relative w-full aspect-square max-w-24 md:max-w-32 bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/40 flex items-center justify-center hover:bg-white/60 transition-colors">
                                <Image src="/Asset/medpar/eventpelajar.jpg" alt="Event Pelajar" fill className="object-contain p-2" draggable={false} loading="lazy" />
                            </div>
                            <div className="relative w-full aspect-square max-w-24 md:max-w-32 bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/40 flex items-center justify-center hover:bg-white/60 transition-colors">
                                <Image src="/Asset/medpar/infolomba.png" alt="Info Lomba" fill className="object-contain p-2" draggable={false} loading="lazy" />
                            </div>
                            <div className="relative w-full aspect-square max-w-24 md:max-w-32 bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/40 flex items-center justify-center hover:bg-white/60 transition-colors">
                                <Image src="/Asset/medpar/pointkampus.png" alt="Point Kampus" fill className="object-contain p-2" draggable={false} loading="lazy" />
                            </div>
                            <div className="relative w-full aspect-square max-w-24 md:max-w-32 bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/40 flex items-center justify-center hover:bg-white/60 transition-colors">
                                <Image src="/Asset/medpar/katalogevent.png" alt="Katalog Event Indonesia" fill className="object-contain p-2" draggable={false} loading="lazy" />
                            </div>
                            <div className="relative w-full aspect-square max-w-24 md:max-w-32 bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/40 flex items-center justify-center hover:bg-white/60 transition-colors">
                                <Image src="/Asset/medpar/partnerevent.png" alt="Partner Event" fill className="object-contain p-2" draggable={false} loading="lazy" />
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}