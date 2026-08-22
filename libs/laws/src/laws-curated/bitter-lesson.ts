import type { Law } from "../types";

export const bitterLesson: Law = {
  slug: "bitter-lesson",
  title: "The Bitter Lesson",
  definition: "General-purpose methods that exploit scale keep defeating clever domain-specific tricks — the bitter lesson researchers relearn with every generation of AI.",
  category: "theory",
  color: "#553c9a",
  labels: ["ai"],
  copy: [
    "Rich Sutton’s essay argues that 70 years of AI research show that methods that leverage computation — search, learning — consistently outperform human-crafted knowledge and heuristics in the long run, however bitter that is for the researchers who invested in the clever ideas.",
    "The lesson is a recurring pattern, not a one-time result: the expensive, general approach wins after enough compute is thrown at it, and the field keeps relearning it.",
  ],
  sources: ["http://www.incompleteideas.net/IncIdeas/BitterLesson.html"],
  related: ["no-free-lunch-theorem", "neural-scaling-laws"],
};
