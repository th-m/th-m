import type { Law } from "../types";

export const lawOfDiminishingReturns: Law = {
  slug: "law-of-diminishing-returns",
  title: "Law of Diminishing Returns",
  definition: "Beyond some point, each additional unit of input yields less additional output than the unit before it.",
  category: "theory",
  color: "#975a16",
  labels: ["economics", "management"],
  copy: [
    "The classical law holds that with other factors fixed, adding more of one input eventually produces smaller and smaller marginal gains — the tenth hour of work, the tenth engineer, or the tenth GPU hour is worth less than the first.",
    "It is the economic backbone of optimization and of scaling debates: marginal thinking beats average thinking, and the question is never ’is more better’ but ’where is the next marginal unit best spent’.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Diminishing_returns"],
  related: ["littles-law", "neural-scaling-laws"],
};
