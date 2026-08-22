import type { Law } from "../types";

export const cobraEffect: Law = {
  slug: "cobra-effect",
  title: "Cobra Effect",
  definition: "An incentive designed to solve a problem can make it worse, because people respond to the incentive rather than to the problem.",
  category: "theory",
  color: "#d69e2e",
  labels: ["management", "economics", "ai"],
  copy: [
    "The name comes from a colonial-era bounty on cobras in India: when the reward was offered per dead cobra, breeders started farming cobras — so when the bounty was cancelled, the farmers released them and the cobra population grew.",
    "The effect is the concrete failure mode of Goodhart’s law: any reward structure invites gaming, and the more visible the metric, the faster the gaming arrives.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Cobra_effect"],
  related: ["goodharts-law"],
};
