import { defineArticleAssets } from "@th-m/blogs/mdx";

export default defineArticleAssets({
  "cognitive-control-loop": {
    kind: "image",
    source: "assets/cognitive-control-loop.svg",
    alt: "A control loop in which operational sensors feed an event contract, decision layer, agent graph, coding agent, verification gate, and controlled release, with outcome telemetry returning to the sensors.",
    tags: ["article-figure", "architecture", "feedback-loop"],
  },
  "compounding-loop": { kind: "figure", label: "Compounding Loop", tags: ["article-figure", "mdx-component"] },
  "executable-context-card": { kind: "figure", label: "Executable Context Card", tags: ["article-figure", "mdx-component"] },
  "light-cone-scorecard": { kind: "interactive", label: "Light Cone Scorecard", tags: ["article-interactive", "mdx-component"] },
});
