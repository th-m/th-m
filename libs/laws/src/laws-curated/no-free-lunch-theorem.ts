import type { Law } from "../types";

export const noFreeLunchTheorem: Law = {
  slug: "no-free-lunch-theorem",
  title: "No Free Lunch Theorem",
  definition: "No learning algorithm is universally better than any other — averaged over all possible problems, every optimizer performs identically.",
  category: "theory",
  color: "#3182ce",
  labels: ["ai", "cs"],
  copy: [
    "The no-free-lunch theorems show that if an algorithm performs well on some problem classes, it must perform equally poorly on others when performance is averaged across all possible problems.",
    "The practical consequence is that inductive bias is not a weakness but the entire game: a model is only as good as the structure it assumes about the world, and there is no model-free intelligence.",
  ],
  sources: ["https://en.wikipedia.org/wiki/No_free_lunch_theorem"],
  related: ["goodharts-law"],
};
