import type { Law } from "../types";

export const jevonsParadox: Law = {
  slug: "jevons-paradox",
  title: "Jevons Paradox",
  definition: "Making a resource more efficient can increase its total consumption, because cheaper use invites more use.",
  category: "theory",
  color: "#234e52",
  labels: ["economics", "ai", "information"],
  copy: [
    "Jevons observed that Watt’s more efficient steam engine led to more coal burned, not less: efficiency lowered the cost of the service, and demand expanded to fill it.",
    "The paradox is the standard caution for every efficiency narrative — including AI: making computation or content generation dramatically cheaper rarely reduces its use, and often multiplies it.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Jevons_paradox"],
  related: ["baumols-cost-disease"],
};
