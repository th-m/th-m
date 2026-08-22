import type { Law } from "../types";

export const haloEffect: Law = {
  slug: "halo-effect",
  title: "Halo Effect",
  definition: "A single positive impression of a person or thing spreads to color judgments of all its other attributes.",
  category: "psychology",
  color: "#a3bffa",
  labels: ["psychology", "product", "design"],
  copy: [
    "The halo effect is the tendency to let one salient trait — attractiveness, success, brand polish — dominate the evaluation of unrelated qualities like competence or reliability.",
    "In products it explains why visual polish inflates perceived usefulness and why a famous logo or a confident demo carries evaluation; it is a reminder to separate the signal being measured from the impressions around it.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Halo_effect"],
  related: ["framing-effect", "anchoring-effect"],
};
