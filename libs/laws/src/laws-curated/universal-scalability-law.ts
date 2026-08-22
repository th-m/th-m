import type { Law } from "../types";

export const universalScalabilityLaw: Law = {
  slug: "universal-scalability-law",
  title: "Universal Scalability Law",
  definition: "Throughput under concurrency rises, peaks, and then falls — limited by contention for shared resources and coherence overhead between participants.",
  category: "theory",
  color: "#2f855a",
  labels: ["cs", "software-engineering", "architecture"],
  copy: [
    "Neil Gunther’s Universal Scalability Law models the classic performance curve: adding workers initially helps, then gains flatten as participants contend, then throughput can actually drop as coordination overhead dominates.",
    "The law makes Amdahl’s serial fraction measurable and adds the coherence cost of coordination — the reason adding cores, servers, or people eventually makes things slower unless the architecture reduces shared contention.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Neil_J._Gunther#USL"],
  related: ["amdahls-law"],
};
