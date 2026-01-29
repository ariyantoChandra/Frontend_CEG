export const QUESTION_1_LABELS = {
  1: {
    inputs: ["Krim", "Gula"],
    outputs: ["Krim kocok"],
  },
  2: {
    inputs: ["60% Tepung", "30% Air", "Gula", "Telur"],
    outputs: ["Adonan kue"],
  },
  3: {
    inputs: ["Adonan kue"],
    outputs: ["Kue"],
  },
  4: {
    inputs: ["Stroberi", "Air"],
    outputs: ["55% Stroberi", "45% Air"],
  },
  5: {
    inputs: ["55% Stroberi", "45% Air"],
    outputs: ["Selai stroberi"],
    waste: ["Air"],
  },
  6: {
    inputs: ["Krim kocok", "Kue", "Selai stroberi"],
    outputs: [],
  },
};

export const QUESTION_2_LABELS = {
  1: {
    inputs: ["65% Gula pasir", "35% Air"],
    outputs: ["65% Gula pasir", "35% Air"],
  },
  2: {
    inputs: ["65% Gula pasir", "35% Air"],
    inputTop: "HCl 1%",
    outputs: ["32.5% Glukosa", "32.5% Fruktosa", "34% Air", "1% HCl"],
  },
  3: {
    inputs: ["32.5% Glukosa", "32.5% Fruktosa", "34% Air", "1% HCl"],
    inputTop: "NaOH 2%",
    outputs: ["32.5% Glukosa", "32.5% Fruktosa", "35% Air"],
  },
  4: {
    inputs: ["32.5% Glukosa", "32.5% Fruktosa", "35% Air"],
    outputs: ["32.5% Glukosa", "32.5% Fruktosa", "35% Air"],
  },
  5: {
    inputs: ["32.5% Glukosa", "32.5% Fruktosa", "35% Air"],
    outputs: ["35% Glukosa", "35% Fruktosa", "30% Air"],
    waste: ["Air"],
  },
  6: {
    inputs: ["35% Glukosa", "35% Fruktosa", "30% Air"],
    outputs: [],
  },
};
export const getProcessLabels = (processId, questionId) => {
  if (questionId === 1) {
    return QUESTION_1_LABELS[processId] || { inputs: [], outputs: [] };
  } else if (questionId === 2) {
    return QUESTION_2_LABELS[processId] || { inputs: [], outputs: [] };
  }
  return { inputs: [], outputs: [] };
};
