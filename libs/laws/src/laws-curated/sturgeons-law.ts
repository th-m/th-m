import type { Law } from "../types";

export const sturgeonsLaw: Law = {
  slug: "sturgeons-law",
  title: "Sturgeon’s Law",
  definition: "Ninety percent of everything is crap — quality is rare in any sufficiently large field, including science and machine output.",
  category: "theory",
  color: "#9f7aea",
  labels: ["ai", "epistemology", "product"],
  copy: [
    "Science-fiction author Theodore Sturgeon coined the phrase as a defense of his field against its critics: ’Ninety percent of everything is crap.’ The point is not that one field is bad, but that the long tail of any large domain is mostly noise.",
    "The law is a useful prior for evaluating model output, generated content, and large corpora: volume of production says nothing about the rate of quality, and curation is the bottleneck, not generation.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Sturgeon%27s_law"],
  related: ["brandolinis-law", "lindy-effect"],
};
