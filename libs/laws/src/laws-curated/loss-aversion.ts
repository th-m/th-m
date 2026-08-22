import type { Law } from "../types";

export const lossAversion: Law = {
  slug: "loss-aversion",
  title: "Loss Aversion",
  definition: "Losses hurt about twice as much as equivalent gains please, so people avoid losses more eagerly than they seek gains.",
  category: "psychology",
  color: "#f56565",
  labels: ["psychology", "economics", "product"],
  copy: [
    "Kahneman and Tversky’s prospect theory found that the disutility of losing a sum is roughly double the utility of gaining it, making the status quo a powerful reference point.",
    "Loss aversion drives defaults, retention mechanics, and resistance to change; it explains why ’you will lose X’ persuades more than ’you will gain X’, and why products that protect existing value win against products that promise new value.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Loss_aversion"],
  related: ["framing-effect", "sunk-cost-fallacy"],
};
