import type { Law } from "../types";

export const brandolinisLaw: Law = {
  slug: "brandolinis-law",
  title: "Brandolini’s Law",
  definition: "The amount of energy needed to refute bullshit is an order of magnitude larger than the energy needed to produce it.",
  category: "theory",
  color: "#e53e3e",
  labels: ["ai", "epistemology", "information"],
  copy: [
    "Italian programmer Alberto Brandolini named the asymmetry in 2013: it is dramatically cheaper to make a confident false claim than to debunk it with evidence.",
    "The law is the epistemic version of Sturgeon’s law and a core constraint on the AI era: generation lowers the cost of producing bullshit by orders of magnitude, so verification capacity, not production capacity, becomes the scarce resource.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Brandolini%27s_law"],
  related: ["sturgeons-law", "gigo"],
};
