import { createFileRoute } from "@tanstack/react-router";
import { EmbeddingSpaceVisualization } from "@th-m/embedding-space";

export const Route = createFileRoute("/embedding-space")({
  head: () => ({
    meta: [
      { title: "Embedding Space Atlas — Thomas Valadez" },
      { name: "description", content: "Explore static GPT-2 token embeddings, then replay a small deterministic skip-gram teaching model as its neighborhoods form." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Embedding Space Atlas" },
      { property: "og:description", content: "Explore token neighborhoods and source-space transformations, then watch a compact co-occurrence teaching model learn." },
      { property: "og:url", content: "https://th-m.netlify.app/embedding-space" },
    ],
    links: [{ rel: "canonical", href: "https://th-m.netlify.app/embedding-space" }],
  }),
  component: EmbeddingSpacePage,
});

function EmbeddingSpacePage() {
  return <EmbeddingSpaceVisualization initialSelection="king" />;
}
