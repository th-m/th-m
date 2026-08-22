import type { Law } from "../types";

export const godwinsLaw: Law = {
  slug: "godwins-law",
  title: "Godwin’s Law",
  definition: "As an online discussion grows longer, the probability of a comparison to Nazis approaches one — and whoever makes it has effectively ended the useful argument.",
  category: "theory",
  color: "#c05621",
  labels: ["epistemology"],
  copy: [
    "Mike Godwin proposed the rule in 1990 as an observation about the trajectory of online debates; it is usually invoked as a warning that extreme comparisons signal the exhaustion of substantive argument.",
    "The law is a practical lesson in discourse hygiene: when a discussion escalates to its most extreme analogy, the exchange has left the territory of evidence and entered the territory of signaling.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Godwin%27s_law"],
  related: ["cunninghams-law"],
};
