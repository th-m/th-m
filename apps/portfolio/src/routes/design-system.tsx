import { createFileRoute } from "@tanstack/react-router";
import { ColorSystem } from "../design-system/ColorSystem";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "THOM Design System — Thomas Valadez" },
      { name: "description", content: "The semantic color, surface, interaction, and composition contracts behind THOM interfaces." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "THOM Design System" },
      { property: "og:description", content: "A Tailwind-backed visual foundation for THOM interfaces and artifacts." },
      { property: "og:url", content: "https://th-m.netlify.app/design-system" },
    ],
    links: [{ rel: "canonical", href: "https://th-m.netlify.app/design-system" }],
  }),
  component: ColorSystem,
});
