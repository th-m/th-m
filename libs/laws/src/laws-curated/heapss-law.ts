import type { Law } from "../types";

export const heapssLaw: Law = {
  slug: "heapss-law",
  title: "Heaps’ Law",
  definition: "The size of a corpus’s vocabulary grows sub-linearly as more text is added — roughly as a power of the number of tokens.",
  category: "theory",
  color: "#4fd1c5",
  labels: ["information", "ai"],
  copy: [
    "Heaps’ law (also called Herdan’s law) describes how the number of distinct words in a text grows with the total number of words: the vocabulary expands, but each new word becomes rarer, so the curve flattens.",
    "It explains why tokenizers need fixed vocabularies with fallback handling, why training on more text yields diminishing new vocabulary, and why corpus size and vocabulary size are never proportional.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Heaps%27_law"],
  related: ["zipfs-law"],
};
