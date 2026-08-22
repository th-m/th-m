import type { Law } from "../types";

export const framingEffect: Law = {
  slug: "framing-effect",
  title: "Framing Effect",
  definition: "The same choice presented in different frames — as a gain or a loss, a risk or a certainty — produces different decisions.",
  category: "psychology",
  color: "#ed8936",
  labels: ["psychology", "product", "ai"],
  copy: [
    "The framing effect is a core result of prospect theory: ’90% survival’ and ’10% mortality’ describe the same surgery, but people choose differently because the frame selects the emotional reference point.",
    "For product and prompt design the lesson is that presentation is part of the decision: the same fact can nudge opposite actions, and the responsible designer chooses the frame deliberately.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Framing_(social_sciences)"],
  related: ["anchoring-effect", "loss-aversion"],
};
