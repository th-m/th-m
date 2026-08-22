import type { Law } from "../types";

export const zipfsLaw: Law = {
  slug: "zipfs-law",
  title: "Zipf’s Law",
  definition: "The frequency of a word is roughly inversely proportional to its rank — the most common token appears about twice as often as the second most common, and so on.",
  category: "theory",
  color: "#7f9cf5",
  labels: ["information", "psychology", "ai"],
  copy: [
    "In any natural-language corpus, rank the words by frequency and the second-ranked word occurs about half as often as the first, the third about a third as often, and so on: a power-law relationship between rank and frequency.",
    "The law is why a small vocabulary dominates text, why compression works, and why language models can learn so much from the long tail — and why token frequency distributions are a central object in any modeling pipeline.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Zipf%27s_law"],
  related: ["heapss-law", "neural-scaling-laws"],
};
