// app/(peserta)/rally/sort-the-process/constants.js
import {
  ChefHat,
  Flame,
  Zap,
  Wind,
  Box,
  Filter,
  Thermometer,
  Hammer,
} from "lucide-react";

export const ITEMS = [
  { id: "mixer", name: "Mixer", icon: ChefHat, color: "cyan" },
  { id: "oven", name: "Oven", icon: Flame, color: "orange" },
  { id: "blender", name: "Blender", icon: Zap, color: "purple" },
  { id: "evaporator", name: "Evaporator", icon: Wind, color: "blue" },
  { id: "packing", name: "Packing Machine", icon: Box, color: "emerald" },
  // Distractors
  { id: "filter", name: "Filter Press", icon: Filter, color: "zinc" },
  { id: "heater", name: "Heater", icon: Thermometer, color: "zinc" },
  { id: "crusher", name: "Crusher", icon: Hammer, color: "zinc" },
];

export const SLOTS = [
  {
    id: "slot1",
    label: "Alat 1",
    correctAnswer: "mixer",
    description: "Membuat krim kocok",
  },
  {
    id: "slot2",
    label: "Alat 2",
    correctAnswer: "mixer",
    description: "Mencampur adonan",
  },
  {
    id: "slot3",
    label: "Alat 3",
    correctAnswer: "oven",
    description: "Memanaskan adonan",
  },
  {
    id: "slot4",
    label: "Alat 4",
    correctAnswer: "blender",
    description: "Mencampur stroberi",
  },
  {
    id: "slot5",
    label: "Alat 5",
    correctAnswer: "evaporator",
    description: "Memperkental selai",
  },
  {
    id: "slot6",
    label: "Alat 6",
    correctAnswer: "packing",
    description: "Mengemas produk",
  },
];

export const SCENARIO_TEXT = `Sebuah pabrik makanan ringan memproduksi kue dengan isian selai stroberi dan topping krim kocok. Proses diawali pembuatan krim kocok (krim cair + gula) menggunakan [ALAT 1]. Adonan kue (tepung 60%, air 30%, gula, telur) dicampur homogen menggunakan [ALAT 2], lalu dipanaskan di [ALAT 3]. Terpisah, stroberi segar dicampur air menggunakan [ALAT 4] hingga komposisi 55% stroberi, lalu diperkental di [ALAT 5]. Akhirnya, kue, selai, dan krim dikemas menggunakan [ALAT 6].`;
