import type { Law } from "../types";

export const dunningKrugerEffect: Law = {
  slug: "dunning-kruger-effect",
  title: "Dunning–Kruger Effect",
  definition: "People with low ability in a domain overestimate their competence, because the same missing skill prevents them from recognizing their errors.",
  category: "psychology",
  color: "#d53f8c",
  labels: ["psychology", "epistemology", "management"],
  copy: [
    "The Dunning–Kruger effect is the metacognitive gap where the unskilled cannot see their own lack of skill: the knowledge needed to perform well is also the knowledge needed to evaluate performance.",
    "It cuts both ways — experts underestimate how hard their expertise looks to novices — and its practical cure is calibration: external feedback, tests, and comparison against objective standards rather than confidence.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect"],
  related: ["planning-fallacy", "curse-of-knowledge"],
};
