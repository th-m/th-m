import type { Law } from "../types";

export const hanlonsRazor: Law = {
  slug: "hanlons-razor",
  title: "Hanlon’s Razor",
  definition: "Never attribute to malice what can be adequately explained by stupidity — or, more gently, by ignorance and error.",
  category: "theory",
  color: "#6b46c1",
  labels: ["epistemology", "management", "psychology"],
  copy: [
    "Hanlon’s razor is a reasoning heuristic for interpreting other people’s behavior: before assuming bad intent, exhaust the explanations that involve mistakes, miscommunication, and missing context.",
    "As an attribution habit it reduces conflict and improves diagnosis — in code, in teams, and in reading the behavior of systems, the error hypothesis is cheaper and usually truer than the malice hypothesis.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Hanlon%27s_razor"],
  related: ["occams-razor", "chestertons-fence"],
};
