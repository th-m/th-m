import { createFileRoute } from "@tanstack/react-router";
import { ResumePage } from "../resume/ResumePage";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Résumé & Selected Work — Thomas Valadez" },
      {
        name: "description",
        content:
          "Thomas Valadez is a principal engineer and engineering leader working across product architecture, developer experience, distributed systems, and AI-enabled workflows.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:type", content: "profile" },
      { property: "og:title", content: "Résumé & Selected Work — Thomas Valadez" },
      {
        property: "og:description",
        content: "Experience, selected outcomes, and portfolio work by Thomas Valadez.",
      },
      { property: "og:url", content: "https://th-m.netlify.app/resume" },
      { name: "twitter:title", content: "Résumé & Selected Work — Thomas Valadez" },
      {
        name: "twitter:description",
        content: "Experience, selected outcomes, and portfolio work by Thomas Valadez.",
      },
    ],
    links: [{ rel: "canonical", href: "https://th-m.netlify.app/resume" }],
  }),
  component: ResumePage,
});
