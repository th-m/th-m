import type { Law } from "../types";

export const curseOfKnowledge: Law = {
  slug: "curse-of-knowledge",
  title: "Curse of Knowledge",
  definition: "Once you know something, it becomes nearly impossible to imagine not knowing it — so experts misjudge what novices can understand.",
  category: "psychology",
  color: "#ed64a6",
  labels: ["psychology", "epistemology", "product", "ai"],
  copy: [
    "The curse of knowledge is the failure of perspective-taking: after learning a fact or skill, adults reliably overestimate how obvious it is to others, and even children who know a secret assume others share it.",
    "It explains jargon-blind documentation, unteachable interfaces, and the persistent gap between what an expert’s prompt means to the expert and what it conveys — a central hazard for anyone writing for models or for people.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Curse_of_knowledge"],
  related: ["dunning-kruger-effect", "hanlons-razor"],
};
