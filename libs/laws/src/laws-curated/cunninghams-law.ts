import type { Law } from "../types";

export const cunninghamsLaw: Law = {
  slug: "cunninghams-law",
  title: "Cunningham’s Law",
  definition: "The best way to get the right answer on the internet is not to ask a question, but to post the wrong answer.",
  category: "theory",
  color: "#b83280",
  labels: ["epistemology", "software-engineering", "product"],
  copy: [
    "Named after Ward Cunningham, the wiki pioneer: confident wrongness attracts corrections far more reliably than honest questions attract answers.",
    "The law is an observation about incentives and social dynamics — people correct errors more eagerly than they answer requests — and a reminder that the shape of a question determines the quality of the response it evokes.",
  ],
  sources: ["https://meta.wikimedia.org/wiki/Cunningham%27s_Law"],
  related: ["brandolinis-law"],
};
