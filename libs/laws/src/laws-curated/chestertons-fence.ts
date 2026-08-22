import type { Law } from "../types";

export const chestertonsFence: Law = {
  slug: "chestertons-fence",
  title: "Chesterton’s Fence",
  definition: "Do not remove a fence until you understand why it was put there — the reason may be invisible but vital.",
  category: "theory",
  color: "#276749",
  labels: ["epistemology", "management", "software-engineering"],
  copy: [
    "G. K. Chesterton’s parable: a reformer sees a fence across a road and wants it gone, but the true reformer first asks why it stands — only then may it be moved.",
    "The fence is a standing rebuke to deletion without comprehension: in code, in processes, and in institutions, the burden of proof lies with the person who wants to remove something, not with the person who wants to keep it.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Wikipedia:Chesterton%27s_fence"],
  related: ["hanlons-razor", "lindy-effect"],
};
