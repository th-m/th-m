import type { Law } from "../types";

export const littlesLaw: Law = {
  slug: "littles-law",
  title: "Little’s Law",
  definition: "In a stable system, the average number of items in the system equals the average arrival rate times the average time each item spends inside: L = λW.",
  category: "theory",
  color: "#718096",
  labels: ["management", "cs", "software-engineering"],
  copy: [
    "Little’s law is a queueing-theory identity: throughput, work-in-progress, and cycle time are locked together, so holding any two fixes the third.",
    "For teams and factories alike it explains why reducing WIP reduces lead time, why throughput cannot be bought by adding work to a saturated system, and why ’just more output’ is usually a confused target — the arithmetic is the same in code review queues, ticket boards, and assembly lines.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Little%27s_law"],
  related: ["amdahls-law", "law-of-diminishing-returns"],
};
