import type { Law } from "../types";

export const shannonsTheorem: Law = {
  slug: "shannons-theorem",
  title: "Shannon’s Information Theorem",
  definition: "The information in a message equals the surprise of its outcome — the negative logarithm of its probability — and entropy is the expected surprise of a source.",
  category: "theory",
  color: "#4299e1",
  labels: ["information", "ai", "epistemology"],
  copy: [
    "Shannon’s 1948 theory defined information as a property of a probability distribution: an outcome carrying probability p conveys log(1/p) bits, and the average over all outcomes is the source’s entropy.",
    "Entropy is the theoretical floor for compression and the vocabulary for talking about prediction: a language model is estimating a conditional distribution over continuations, and cross-entropy loss measures how far that estimate is from the observed text.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Claude_Shannon", "https://en.wikipedia.org/wiki/Entropy_(information_theory)"],
  related: ["second-law-of-thermodynamics", "zipfs-law"],
};
