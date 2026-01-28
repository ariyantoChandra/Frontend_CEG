import { Flame, Zap, Wind, Droplets, Settings, Radio } from "lucide-react";

export const EQUIPMENT = [
  {
    id: 1,
    name: "Absorber",
    icon: Droplets,
    color: "blue",
    description:
      "Absorber adalah alat yang digunakan untuk memisahkan komponen gas dari campuran gas dengan cara menyerap komponen tertentu ke dalam cairan pelarut. Alat ini bekerja berdasarkan prinsip perbedaan kelarutan komponen dalam fase cair.",
    image: "https://via.placeholder.com/300x200/1e293b/06b6d4?text=Absorber",
    question: "Absorber mengalami flooding, apa yang harus dilakukan?",
    options: [
      { text: "Kurangi laju alir gas", correct: true },
      { text: "Mematikan absorber sementara", correct: false },
      { text: "Menambah pipa", correct: false },
      { text: "Mengganti alat baru", correct: false },
    ],
  },
  {
    id: 2,
    name: "Distillation Column",
    icon: Flame,
    color: "orange",
    description:
      "Kolom distilasi adalah alat pemisahan yang menggunakan perbedaan titik didih komponen untuk memisahkan campuran cairan. Proses ini melibatkan penguapan dan kondensasi berulang untuk mendapatkan produk dengan kemurnian tinggi.",
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
  },
  {
    id: 3,
    name: "Reactor",
    icon: Zap,
    color: "purple",
    description:
      "Reaktor adalah tempat terjadinya reaksi kimia terkontrol. Alat ini dirancang untuk mengoptimalkan kondisi reaksi seperti suhu, tekanan, dan waktu tinggal untuk menghasilkan produk yang diinginkan dengan efisiensi maksimal.",
    image: "https://via.placeholder.com/300x200/1e293b/a855f7?text=Reactor",
    question:
      "Suhu reaktor meningkat drastis. Langkah pertama yang harus dilakukan?",
    options: [
      { text: "Aktifkan sistem pendingin darurat", correct: true },
      { text: "Tambah katalis", correct: false },
      { text: "Naikkan tekanan", correct: false },
      { text: "Matikan agitator", correct: false },
    ],
  },
  {
    id: 4,
    name: "Heat Exchanger",
    icon: Wind,
    color: "cyan",
    description:
      "Heat exchanger adalah alat untuk mentransfer panas antara dua atau lebih fluida tanpa mencampurkannya. Alat ini digunakan untuk memanaskan atau mendinginkan aliran proses dengan efisien menggunakan energi yang tersedia.",
    image:
      "https://via.placeholder.com/300x200/1e293b/06b6d4?text=Heat+Exchanger",
    question: "Heat exchanger mengalami fouling. Apa solusi terbaik?",
    options: [
      { text: "Lakukan cleaning dengan chemical wash", correct: true },
      { text: "Naikkan laju alir", correct: false },
      { text: "Ganti dengan model baru", correct: false },
      { text: "Tambah pressure", correct: false },
    ],
  },
  {
    id: 5,
    name: "Compressor",
    icon: Settings,
    color: "emerald",
    description:
      "Kompresor adalah alat yang digunakan untuk meningkatkan tekanan gas dengan mengurangi volumenya. Alat ini penting dalam proses industri untuk mengalirkan gas melalui sistem pipa dan meningkatkan efisiensi proses kimia.",
    image: "https://via.placeholder.com/300x200/1e293b/10b981?text=Compressor",
    question:
      "Kompresor mengalami vibration berlebihan. Apa penyebab paling mungkin?",
    options: [
      { text: "Misalignment atau bearing aus", correct: true },
      { text: "Tekanan inlet terlalu rendah", correct: false },
      { text: "Filter tersumbat", correct: false },
      { text: "Suhu terlalu tinggi", correct: false },
    ],
  },
  {
    id: 6,
    name: "Pump",
    icon: Radio,
    color: "rose",
    description:
      "Pompa adalah alat mekanik yang digunakan untuk memindahkan cairan dari satu tempat ke tempat lain dengan meningkatkan tekanan. Pompa sangat penting dalam sirkulasi fluida proses di seluruh pabrik kimia.",
    image: "https://via.placeholder.com/300x200/1e293b/f43f5e?text=Pump",
    question: "Pompa mengalami kavitasi. Apa tindakan yang benar?",
    options: [
      { text: "Tingkatkan NPSH available", correct: true },
      { text: "Turunkan kecepatan pompa drastis", correct: false },
      { text: "Ganti impeller dengan yang lebih besar", correct: false },
      { text: "Tambah bypass valve", correct: false },
    ],
  },
];
