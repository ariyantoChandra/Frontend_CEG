export const LEVELS = [
  {
    id: 1,
    question: "Lengkapi struktur Etana (C2H6)",
    description: "Etana adalah hidrokarbon alkana dengan dua atom karbon.",
    dropZones: [
      {
        id: "z-c1",
        label: "",
        correctItem: "C",
        style: { top: "50%", left: "35%" },
      },
      {
        id: "z-bond-mid",
        label: "",
        correctItem: "bond-single",
        style: { top: "50%", left: "50%", width: "60px", height: "4px" },
      },
      {
        id: "z-c2",
        label: "",
        correctItem: "C",
        style: { top: "50%", left: "65%" },
      },
      {
        id: "z-h1",
        label: "",
        correctItem: "H",
        style: { top: "25%", left: "35%" },
      },
      {
        id: "z-h2",
        label: "",
        correctItem: "H",
        style: { top: "75%", left: "35%" },
      },
      {
        id: "z-h3",
        label: "",
        correctItem: "H",
        style: { top: "50%", left: "15%" },
      },

      // Atom H di sekitar C2 (Kanan)
      {
        id: "z-h4",
        label: "",
        correctItem: "H",
        style: { top: "25%", left: "65%" },
      },
      {
        id: "z-h5",
        label: "",
        correctItem: "H",
        style: { top: "75%", left: "65%" },
      },
      {
        id: "z-h6",
        label: "",
        correctItem: "H",
        style: { top: "50%", left: "85%" },
      },
    ],
  },
  {
    id: 2,
    question: "Lengkapi struktur Etena (C2H4)",
    description: "Perhatikan ikatan rangkap dua antar atom karbon.",
    dropZones: [
      {
        id: "z-c1",
        label: "",
        correctItem: "C",
        style: { top: "50%", left: "35%" },
      },
      // Ikatan Rangkap
      {
        id: "z-bond-double",
        label: "",
        correctItem: "bond-double",
        style: { top: "50%", left: "50%", width: "60px", height: "8px" },
      },
      {
        id: "z-c2",
        label: "",
        correctItem: "C",
        style: { top: "50%", left: "65%" },
      },

      {
        id: "z-h1",
        label: "",
        correctItem: "H",
        style: { top: "20%", left: "35%" },
      },
      {
        id: "z-h2",
        label: "",
        correctItem: "H",
        style: { top: "80%", left: "35%" },
      },
      {
        id: "z-h3",
        label: "",
        correctItem: "H",
        style: { top: "20%", left: "65%" },
      },
      {
        id: "z-h4",
        label: "",
        correctItem: "H",
        style: { top: "80%", left: "65%" },
      },
    ],
  },
];

export const INVENTORY_ITEMS = [
  {
    id: "C",
    label: "C",
    type: "atom",
    color: "bg-zinc-800 border-zinc-500 text-white",
  },
  {
    id: "H",
    label: "H",
    type: "atom",
    color: "bg-cyan-900/50 border-cyan-500 text-cyan-100",
  },
  {
    id: "O",
    label: "O",
    type: "atom",
    color: "bg-red-900/50 border-red-500 text-red-100",
  },
  {
    id: "bond-single",
    label: "—",
    type: "bond",
    color: "bg-zinc-600 border-zinc-400 text-transparent w-12 h-1",
  },
  {
    id: "bond-double",
    label: "=",
    type: "bond",
    color:
      "bg-zinc-600 border-zinc-400 text-transparent w-12 h-2 border-y-2 bg-transparent",
  },
];
