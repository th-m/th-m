import type { Law } from "../types";

export const spotlightEffect: Law = {
  slug: "spotlight-effect",
  title: "Spotlight Effect",
  definition: "People overestimate how much others notice their appearance and behavior — the spotlight of attention is mostly in their own head.",
  category: "psychology",
  color: "#fbbf24",
  labels: ["psychology", "design"],
  copy: [
    "The spotlight effect is the exaggerated sense that one is being observed and evaluated: others notice far less than we assume, because they are busy being the center of their own attention.",
    "The bias matters for design and feedback: users will not scrutinize the details the designer fears, and honest evaluation requires making attention explicit rather than assuming it.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Spotlight_effect"],
  related: ["halo-effect"],
};
