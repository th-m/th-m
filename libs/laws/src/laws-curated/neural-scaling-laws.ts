import type { Law } from "../types";

export const neuralScalingLaws: Law = {
  slug: "neural-scaling-laws",
  title: "Neural Scaling Laws",
  definition: "Language-model loss falls as a smooth power law of compute, data, and parameters — predictable returns from scaling each resource.",
  category: "theory",
  color: "#805ad5",
  labels: ["ai", "information"],
  copy: [
    "Scaling laws (Kaplan et al., 2020; Hoffmann et al., 2022) describe how cross-entropy loss decreases predictably as model size, dataset size, and training compute grow, following power laws with precise exponents.",
    "The laws made frontier training a budget-allocation exercise: for a fixed compute budget, there is an optimal balance of parameters and data, and ’more of everything’ is rarely the efficient frontier — empirical regularities that shape nearly every large-model decision.",
  ],
  sources: ["https://arxiv.org/abs/2001.08361", "https://arxiv.org/abs/2203.15556"],
  related: ["zipfs-law", "bitter-lesson"],
};
