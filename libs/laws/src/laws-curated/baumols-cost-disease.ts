import type { Law } from "../types";

export const baumolsCostDisease: Law = {
  slug: "baumols-cost-disease",
  title: "Baumol’s Cost Disease",
  definition: "Wages in labor-intensive sectors rise to match productivity-growing sectors even when their own productivity is stagnant — so their costs keep climbing.",
  category: "theory",
  color: "#9b2c2c",
  labels: ["economics", "management"],
  copy: [
    "Baumol observed that a string quartet plays no faster today than in 1800, yet must compete for musicians with productivity-growing industries, so the relative cost of the stagnant activity rises without bound.",
    "The disease explains why education, healthcare, and other human-labor services keep getting more expensive — and why any technology that genuinely raises productivity in those sectors (including AI-assisted work) is economically significant.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Baumol%27s_cost_disease"],
  related: ["jevons-paradox"],
};
