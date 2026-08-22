import type { Law } from "../types";

export const secondLawOfThermodynamics: Law = {
  slug: "second-law-of-thermodynamics",
  title: "Second Law of Thermodynamics",
  definition: "In an isolated system, entropy never decreases — disorder tends to grow, and useful work is what it costs to push against that tendency.",
  category: "theory",
  color: "#63b3ed",
  labels: ["physics", "information", "epistemology"],
  copy: [
    "The second law states that the total entropy of an isolated system cannot decrease: energy spontaneously disperses, order degrades, and processes have an arrow of time.",
    "Information theory borrows the same word deliberately: Shannon entropy measures the uncertainty of a distribution, and any act of compression, prediction, or organization is local work performed against the ambient tendency toward disorder — the reason maintenance, not creation, is the constant cost of every knowledge system.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Second_law_of_thermodynamics"],
  related: ["shannons-theorem"],
};
