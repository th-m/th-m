import type { Law } from "../types";

export const amdahlsLaw: Law = {
  slug: "amdahls-law",
  title: "Amdahl’s Law",
  definition: "The speedup from parallelizing a computation is capped by the fraction of the work that must stay serial — 1/(1 − p + p/n).",
  category: "theory",
  color: "#2b6cb0",
  labels: ["cs", "software-engineering", "architecture"],
  copy: [
    "Amdahl’s law gives the theoretical maximum speedup when only part of a workload can be parallelized: even with infinite processors, the serial portion dominates as n grows.",
    "It is a universal budgeting tool for optimization: find the fraction of time spent in the part you plan to speed up, because everything else is a hard ceiling — the same arithmetic applies to teams, pipelines, and any parallel effort.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Amdahl%27s_law"],
  related: ["universal-scalability-law", "littles-law"],
};
