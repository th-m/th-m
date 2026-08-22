import type { Law } from "../types";

export const metcalfesLaw: Law = {
  slug: "metcalfes-law",
  title: "Metcalfe’s Law",
  definition: "The value of a network grows with the square of the number of its users — roughly n² — because each new member connects to every existing one.",
  category: "theory",
  color: "#38a169",
  labels: ["economics", "product", "information"],
  copy: [
    "Metcalfe’s law values a communications network by the number of possible pairwise connections, which grows quadratically with membership, so each additional user adds value for every other user.",
    "The same logic explains network effects in platforms, why the early users matter disproportionately, and why small networks feel empty while large ones feel indispensable — and why the law is really a claim about interaction opportunities, not raw headcount.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Metcalfe%27s_law"],
  related: ["lindy-effect"],
};
