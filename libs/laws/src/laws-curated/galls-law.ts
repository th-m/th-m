import type { Law } from "../types";

export const gallsLaw: Law = {
  slug: "galls-law",
  title: "Gall’s Law",
  definition: "A complex system that works is invariably found to have evolved from a simple system that worked — a complex system designed from scratch never works and cannot be patched to work.",
  category: "theory",
  color: "#38a169",
  labels: ["cs", "software-engineering", "architecture", "management"],
  copy: [
    "John Gall’s systems-theory aphorism describes how functioning complexity is grown, not built: it accumulates through successful increments on a working base.",
    "The law argues against big-bang redesigns and for preserving working cores — the practical reason boring, evolvable systems beat ambitious rewrites, and why the first version of a system should be almost embarrassingly simple.",
  ],
  sources: ["https://en.wikipedia.org/wiki/John_Gall_(author)#Gall%27s_law"],
  related: ["chestertons-fence", "lindy-effect"],
};
