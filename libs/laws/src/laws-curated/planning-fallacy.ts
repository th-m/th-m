import type { Law } from "../types";

export const planningFallacy: Law = {
  slug: "planning-fallacy",
  title: "Planning Fallacy",
  definition: "Plans are systematically overoptimistic — tasks take longer and cost more than predicted, even when past similar tasks ran late.",
  category: "psychology",
  color: "#f6ad55",
  labels: ["psychology", "management", "software-engineering"],
  copy: [
    "The planning fallacy is the persistent tendency to forecast the best-case scenario for one’s own projects while ignoring the distribution of past outcomes for comparable projects.",
    "Its cure is reference-class forecasting: estimate from the base rate of similar efforts rather than from the internal narrative of this one — the single most effective correction for late software, budgets, and roadmaps.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Planning_fallacy"],
  related: ["dunning-kruger-effect", "littles-law"],
};
