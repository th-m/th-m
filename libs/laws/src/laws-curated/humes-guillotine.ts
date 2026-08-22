import type { Law } from "../types";

export const humesGuillotine: Law = {
  slug: "humes-guillotine",
  title: "Hume’s Guillotine",
  definition: "You cannot derive an ought from an is — factual descriptions alone never justify value judgments.",
  category: "theory",
  color: "#2c5282",
  labels: ["epistemology", "economics", "ai"],
  copy: [
    "David Hume noted that writers move from statements of fact (’is’) to statements of obligation (’ought’) without explaining the leap — a gap that has come to be called the is–ought problem or Hume’s guillotine.",
    "The distinction is decisive for AI: a model can be fluent about what is the case and what is predicted, but no amount of factual accuracy produces a goal. Values must be supplied from outside the system.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Is%E2%80%93ought_problem"],
  related: ["goodharts-law"],
};
