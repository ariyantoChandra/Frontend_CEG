import { Flame, Zap, Wind, Droplets, Settings, Radio } from "lucide-react";

export const PENALTY_TIME = 15;

export const TOOLS = [
  {
    id: 1,
    name: "Absorber",
    icon: Droplets,
    color: "blue",
    status: "BROKEN",
    image: "https://via.placeholder.com/300x200/1e293b/06b6d4?text=Absorber",
    question: "Absorber mengalami flooding, apa yang harus dilakukan?",
    options: [
      { text: "Kurangi laju alir gas", correct: true },
      { text: "Mematikan absorber sementara", correct: false },
      { text: "Menambah pipa", correct: false },
      { text: "Mengganti alat baru", correct: false },
    ],
    points: 100,
  },
  {
    id: 2,
    name: "Distillation Column",
    icon: Flame,
    color: "orange",
    status: "BROKEN",
    image:
      "https://via.placeholder.com/300x200/1e293b/f97316?text=Distillation",
    question:
      "Tekanan pada kolom distilasi terlalu tinggi. Apa tindakan yang tepat?",
    options: [
      { text: "Buka pressure relief valve", correct: true },
      { text: "Tambah steam", correct: false },
      { text: "Turunkan feed rate drastis", correct: false },
      { text: "Matikan reboiler", correct: false },
    ],
    points: 100,
  },
  {
    id: 3,
    name: "Reactor",
    icon: Zap,
    color: "purple",
    status: "BROKEN",
    image: "https://via.placeholder.com/300x200/1e293b/a855f7?text=Reactor",
    question:
      "Suhu reaktor meningkat drastis. Langkah pertama yang harus dilakukan?",
    options: [
      { text: "Aktifkan sistem pendingin darurat", correct: true },
      { text: "Tambah katalis", correct: false },
      { text: "Naikkan tekanan", correct: false },
      { text: "Matikan agitator", correct: false },
    ],
    points: 100,
  },
  {
    id: 4,
    name: "Heat Exchanger",
    icon: Wind,
    color: "cyan",
    status: "BROKEN",
    image:
      "https://via.placeholder.com/300x200/1e293b/06b6d4?text=Heat+Exchanger",
    question: "Heat exchanger mengalami fouling. Apa solusi terbaik?",
    options: [
      { text: "Lakukan cleaning dengan chemical wash", correct: true },
      { text: "Naikkan laju alir", correct: false },
      { text: "Ganti dengan model baru", correct: false },
      { text: "Tambah pressure", correct: false },
    ],
    points: 100,
  },
  {
    id: 5,
    name: "Compressor",
    icon: Settings,
    color: "emerald",
    status: "BROKEN",
    image: "https://via.placeholder.com/300x200/1e293b/10b981?text=Compressor",
    question:
      "Kompresor mengalami vibration berlebihan. Apa penyebab paling mungkin?",
    options: [
      { text: "Misalignment atau bearing aus", correct: true },
      { text: "Tekanan inlet terlalu rendah", correct: false },
      { text: "Filter tersumbat", correct: false },
      { text: "Suhu terlalu tinggi", correct: false },
    ],
    points: 100,
  },
  {
    id: 6,
    name: "Pump",
    icon: Radio,
    color: "rose",
    status: "BROKEN",
    image: "https://via.placeholder.com/300x200/1e293b/f43f5e?text=Pump",
    question: "Pompa mengalami kavitasi. Apa tindakan yang benar?",
    options: [
      { text: "Tingkatkan NPSH available", correct: true },
      { text: "Turunkan kecepatan pompa drastis", correct: false },
      { text: "Ganti impeller dengan yang lebih besar", correct: false },
      { text: "Tambah bypass valve", correct: false },
    ],
    points: 100,
  },
];
