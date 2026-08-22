import type { Law } from "../types";

export const lindyEffect: Law = {
  slug: "lindy-effect",
  title: "Lindy Effect",
  definition: "The future life expectancy of a non-perishable thing is proportional to its current age — what has survived longer is likely to survive longer still.",
  category: "theory",
  color: "#d69e2e",
  labels: ["epistemology", "product", "economics"],
  copy: [
    "Named after the Lindy delicatessen in New York where comedians gathered, the effect holds that for durable ideas, technologies, and institutions, every additional year of existence extends the expected remaining lifetime.",
    "As a heuristic it rewards boring, long-lived tools and penalizes novelty for its own sake: standards, formats, and practices that have already weathered change are better bets than whatever is newest.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Lindy_effect"],
  related: ["sturgeons-law"],
};
