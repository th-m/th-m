import type { Law } from "../types";

export const sunkCostFallacy: Law = {
  slug: "sunk-cost-fallacy",
  title: "Sunk Cost Fallacy",
  definition: "Continuing an endeavor because of resources already spent, even when the rational choice is to abandon it — the past costs cannot be recovered either way.",
  category: "psychology",
  color: "#fc8181",
  labels: ["psychology", "economics", "management", "product"],
  copy: [
    "The sunk cost fallacy treats unrecoverable past investment as a reason to keep investing, confusing what has been spent with what will be gained.",
    "It is the economic engine of escalation: dead projects, doomed rewrites, and loyalty to outdated tools all feed on it. The decision rule is to compare only the future costs and benefits from here forward.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Sunk_cost"],
  related: ["loss-aversion", "chestertons-fence"],
};
