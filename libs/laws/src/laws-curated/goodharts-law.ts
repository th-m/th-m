import type { Law } from "../types";

export const goodhartsLaw: Law = {
  slug: "goodharts-law",
  title: "Goodhart’s Law",
  definition: "When a measure becomes a target, it ceases to be a good measure.",
  category: "theory",
  color: "#dd6b20",
  labels: ["ai", "economics", "management"],
  copy: [
    "Economist Charles Goodhart observed that any statistical regularity will collapse once pressure is placed on it for control purposes: people optimize for the metric, not the thing the metric was meant to proxy.",
    "The law is central to AI alignment, where reward functions and benchmarks invite gaming, and to management, where KPI pressure distorts behavior — any metric used as a target must be expected to break.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Goodhart%27s_law"],
  related: ["cobra-effect", "brandolinis-law"],
};
