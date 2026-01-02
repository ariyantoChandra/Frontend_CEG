import { useState } from "react";
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

const images = [
  "/Asset/DSC00643.JPG",
  "/Asset/FIO01873.JPG",
  "/Asset/DSC00474.JPG",
];

export default function HomepagePeserta() {
    const [active, setActive] = useState(1);
    const prev = () => setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const next = () => setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    const faqData = [
        { id: 1, question: "Kapan pendaftaran terakhir?", answer: "Pendaftaran ditutup sesuai jadwal yang tertera di timeline." },
        { id: 2, question: "Apakah lomba ini tim atau individu?", answer: "Lomba ini bersifat tim sesuai ketentuan di booklet." },
        { id: 3, question: "Di mana lokasi babak final?", answer: "Babak final akan dilaksanakan di Kampus Universitas Surabaya." },
        { id: 4, question: "Bagaimana cara akses berkas?", answer: "Semua berkas bisa diunduh di bagian Resources di bawah ini." }
    ];

    const sectionTitleStyle = `
        drop-shadow-2xl 
        w-[260px] 
        md:w-[520px] 
        h-auto 
        object-contain
        `;

    const sectionWrapper = `
        w-full 
        flex 
        flex-col 
        items-center 
        snap-start 
        pt-14 
        pb-14 
        px-4
        `;


    return (
        <div className="relative h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth">

            {/* ===== BACKGROUND FIXED ===== */}
            <div className="fixed inset-0 -z-10">
                <Image
                    src="/Asset/Background Landscape.png"
                    alt="Background Landscape"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* ===== SECTION 1: HOME ===== */}
            <section id="home" className="h-screen w-full flex flex-col items-center justify-center snap-start px-4">
                <div className="flex flex-col items-center text-center max-w-5xl">
                    <div className="relative w-full max-w-2xl h-[120px] md:h-[180px] mb-8 animate-in fade-in zoom-in duration-700">
                        <Image
                            src="/Asset/CEG HOMEPAGE.png"
                            alt="Chemical Engineering Games 2026"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>

                    <div className="bg-white/30 backdrop-blur-lg border border-white/40 rounded-[30px] p-6 md:p-8 shadow-2xl mb-8">
                        <p className="text-sm md:text-lg font-medium leading-relaxed text-teal-950 text-justify md:text-center">
                            Chemical Engineering Games atau CEG  merupakan lomba tahunan yang diselenggarakan oleh Program 
                            Studi Teknik Kimia Universitas Surabaya dan ditujukan bagi siswa/i SMA/sederajat dari seluruh Indonesia. 
                            Kegiatan ini dikemas dalam bentuk rangkaian games yang seru, edukatif, dan unik, sehingga peserta tidak hanya 
                            ditantang secara kompetitif, tetapi juga diajak untuk berpikir kritis, kreatif, dan strategis. Melalui Chemical 
                            Engineering Games, peserta diperkenalkan pada konsep dasar Teknik Kimia dengan cara yang menyenangkan dan aplikatif, 
                            sekaligus melatih kemampuan kerja sama tim, problem solving, serta sportivitas. Ajang ini diharapkan dapat menumbuhkan 
                            minat terhadap dunia sains dan rekayasa, serta mengenal lebih dekat Program Studi Teknik Kimia Universitas Surabaya.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild className="bg-teal-800 hover:bg-teal-900 text-white px-12 py-7 rounded-full text-xl font-bold shadow-lg transition-transform hover:scale-105">
                            {/* Diarahkan ke halaman register sesuai request */}
                            <Link href="/register">Daftar Sekarang</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 2: GALLERY & ABOUT ===== */}
            <section id="gallery" className={sectionWrapper}>
                <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center mb-12">
                    <button onClick={prev} className="absolute left-0 z-20 bg-white/70 hover:bg-white text-teal-800 rounded-full w-10 h-10 flex items-center justify-center shadow">‹</button>
                    <div className="flex items-center justify-center gap-6 overflow-hidden w-full">
                        {images.map((src, i) => (
                            <div key={i} className={`relative transition-all duration-500 ${i === active ? "w-[500px] h-[280px] scale-100 opacity-100 z-10" : "w-[380px] h-[220px] scale-90 opacity-40"}`}>
                                <Image src={src} alt={`Gallery ${i}`} fill className="object-cover rounded-[25px]" />
                            </div>
                        ))}
                    </div>
                    <button onClick={next} className="absolute right-0 z-20 bg-white/70 hover:bg-white text-teal-800 rounded-full w-10 h-10 flex items-center justify-center shadow">›</button>
                </div>

                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                    <div className="md:col-span-8 flex flex-col items-start">
                        <div className="w-full mb-6">
                            <Image src="/Asset/CEG 2026.png" alt="Title" width={800} height={200} className="drop-shadow-xl w-full max-w-[500px] h-auto object-contain object-left" />
                        </div>
                        <div className="bg-white/40 backdrop-blur-md rounded-[25px] p-6 md:p-8 shadow-lg w-full border border-white/20">
                            <h3 className="font-black text-teal-800 text-xl mb-1">TEMA</h3>
                            <p className="text-teal-950 font-bold mb-4 text-sm md:text-base uppercase italic">AGRINOVA: Agricultural Innovation for Sustainable Nutrition Advancement</p>
                            <h3 className="font-black text-teal-800 text-xl mb-1">MASKOT</h3>
                            <p className="text-teal-950 font-medium text-sm md:text-base leading-relaxed text-justify">
                                AGRINOVA menggambarkan sebuah ledakan inovasi yang lahir dari dunia pertanian sebagai respons 
                                terhadap tantangan pangan masa kini dan masa depan. Kata “Nova” berarti bintang baru, yang menjadi simbol 
                                munculnya gagasan, pendekatan, dan terobosan baru dalam menciptakan sistem pangan yang lebih sehat, efisien, 
                                dan ramah lingkungan. Melalui konsep ini, AGRINOVA merepresentasikan semangat pembaruan dan kreativitas dalam 
                                mengembangkan pertanian modern yang tidak hanya berorientasi pada hasil, tetapi juga pada keberlanjutan dan 
                                kualitas. AGRINOVA merupakan langkah transformasi dari pertanian tradisional menuju sistem pangan masa depan 
                                yang berbasis pada sains, teknologi, dan prinsip keberlanjutan, guna mendukung ketahanan pangan serta 
                                kesejahteraan generasi mendatang.
                            </p>
                        </div>
                    </div>
                    <div className="md:col-span-4 flex justify-center items-end">
                        <Image src="/Asset/No Background.png" alt="Mascot" width={500} height={500} className="w-full h-auto drop-shadow-2xl animate-bounce-slow object-contain" />
                    </div>
                </div>
            </section>

            {/* ===== SECTION: DETAILS ===== */}
            <section id="competition-details" className={sectionWrapper}>
                <div className="mb-10">
                    <Image src="/Asset/TIMELINE.png" alt="Timeline" width={400} height={100} className={sectionTitleStyle} />
                </div>
                <div className="relative w-full max-w-4xl mb-20"> 
                    <Image src="/Asset/TIMELINE (1).png" alt="Schedule" width={1200} height={600} className="w-full h-auto drop-shadow-2xl scale-110" />
                </div>
                <div>
                    <Image src="/Asset/BABAK PERLOMBAAN (1).png" alt="Babak" width={550} height={150} className={`${sectionTitleStyle} scale-125`} />
                </div>
                <div className="relative w-full max-w-4xl"> 
                    <Image src="/Asset/BABAK PERLOMBAAN.png" alt="Detail" width={1200} height={600} className="w-full h-auto drop-shadow-2xl scale-110" />
                </div>
            </section>

            {/* ===== SECTION: PRE-EVENT ===== */}
            <section id="pre-event" className={sectionWrapper}>
                <div className="mt-10">
                    <Image src="/Asset/PRE-EVENT (1) (1).png" alt="Pre-Event" width={400} height={100} className={sectionTitleStyle} />
                </div>
                <div className="relative w-full max-w-4xl -mt-5"> 
                    <Image src="/Asset/PRE-EVENT.png" alt="Poster" width={1200} height={600} className="w-full h-auto drop-shadow-2xl" />
                </div>
            </section>

            {/* ===== SECTION: RESOURCES ===== */}
            <section id="resources" className={sectionWrapper}>
                <div className="-mt-10">
                    <Image src="/Asset/RESOURCES.png" alt="Resources" width={400} height={100} className={sectionTitleStyle} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                    <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[40px] p-8 shadow-2xl flex flex-col items-center group">
                        <Image src="/Asset/RESOURCES BOOKLET.png" alt="Icon" width={150} height={150} className="mb-6 group-hover:scale-105 transition-transform" />
                        <h3 className="text-2xl font-black text-teal-950 mb-2">Booklet Peserta</h3>
                        <p className="text-teal-900/60 text-sm mb-8 text-center leading-relaxed">Informasi mendalam mengenai pendaftaran dan aturan.</p>
                        <Button asChild className="w-full bg-[#58a644] hover:bg-[#4a8c39] py-7 rounded-2xl font-bold text-lg">
                            <Link href="/Asset/GUIDELINE.pdf">Download Booklet</Link>
                        </Button>
                    </div>
                    <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[40px] p-8 shadow-2xl flex flex-col items-center group">
                        <Image src="/Asset/RESOURCES SOP.png" alt="Icon" width={150} height={150} className="mb-6 group-hover:scale-105 transition-transform" />
                        <h3 className="text-2xl font-black text-teal-950 mb-2">SOP Lomba</h3>
                        <p className="text-teal-900/60 text-sm mb-8 text-center leading-relaxed">Panduan operasional selama hari-H kompetisi.</p>
                        <Button asChild className="w-full bg-[#1b8a86] hover:bg-[#156e6b] py-7 rounded-2xl font-bold text-lg">
                            <Link href="/Asset/SOP.pdf">Download SOP</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* ===== SECTION: FAQ ===== */}
            <section id="faq" className={sectionWrapper}>
                <div className="mb-6">
                    <Image src="/Asset/FAQ.png" alt="FAQ" width={400} height={100} className={sectionTitleStyle} />
                </div>
                <div className="grid gap-4 w-full max-w-3xl">
                    {faqData.map((item) => (
                        <div key={item.id} className="group">
                            <h3 className="text-teal-900 font-black text-sm md:text-base ml-4 mb-2">{item.id}) {item.question}</h3>
                            <div className="bg-white/40 backdrop-blur-md border border-white/40 rounded-[20px] px-6 py-4 shadow-sm group-hover:bg-white/60 transition-colors">
                                <p className="text-teal-950 font-medium text-xs md:text-sm leading-relaxed">{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== SECTION: CONTACT & PARTNERS ===== */}
            <section id="CP&Partner" className="relative w-full h-fit snap-start bg-transparent p-0 m-0">
                <div className="w-full flex flex-col p-0 m-0">
                    <img src="/Asset/CONTACT PERSON.png" alt="Contact" className="w-full h-auto block" />
                    <img src="/Asset/MEDIA PARTNER (1).png" alt="Media" className="w-full h-auto block -mt-1" />
                </div>
            </section>
        </div>
    )
}