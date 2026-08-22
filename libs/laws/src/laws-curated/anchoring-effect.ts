import type { Law } from "../types";

export const anchoringEffect: Law = {
  slug: "anchoring-effect",
  title: "Anchoring Effect",
  definition: "Judgments are biased toward an initial reference value, even when that anchor is arbitrary or irrelevant.",
  category: "psychology",
  color: "#ecc94b",
  labels: ["psychology", "economics", "product", "ai"],
  copy: [
    "Tversky and Kahneman showed that a random starting number shifts subsequent estimates: people adjust from the anchor rather than reasoning from first principles.",
    "Anchoring explains price perception, negotiation, and prompt sensitivity in language models — where an example, a number, or a framing in the context sets the range of plausible continuations the model will produce.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Anchoring_(cognitive_bias)"],
  related: ["framing-effect", "loss-aversion"],
};
