import type { Law } from "../types";

export const benfordsLaw: Law = {
  slug: "benfords-law",
  title: "Benford’s Law",
  definition: "In many real-world datasets, the leading digit 1 appears far more often than 9 — about 30% versus under 5% — following a logarithmic distribution.",
  category: "theory",
  color: "#e53e3e",
  labels: ["information", "economics", "ai"],
  copy: [
    "Benford’s law describes the distribution of leading digits in naturally occurring numbers: smaller digits are much more common, because numbers that span many orders of magnitude spend more of their range with a small leading digit.",
    "It is used to detect fabricated data in accounting and science, because human-made numbers are far more uniform than real ones — a reminder that statistical fingerprints reveal the process that produced the data.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Benford%27s_law"],
  related: [],
};
