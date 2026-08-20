import { createFileRoute } from "@tanstack/react-router";
import { LanguageModelWorkbench } from "@th-m/llm-visualization";

export const Route = createFileRoute("/llm-visualization")({
  head: () => ({
    meta: [
      { title: "Inside a Language Model — THOM" },
      { name: "description", content: "An interactive decoder-only inference trace and deterministic transformer learning lab." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Inside a Language Model" },
      { property: "og:description", content: "Follow a decoder-only forward pass, transform a prompt, and inspect deterministic training and decoding telemetry." },
      { property: "og:url", content: "https://th-m.netlify.app/llm-visualization" },
    ],
    links: [{ rel: "canonical", href: "https://th-m.netlify.app/llm-visualization" }],
  }),
  component: LanguageModelVisualizationPage,
});

function LanguageModelVisualizationPage() {
  return (
    <div className="llm-demo-page">
      <LanguageModelWorkbench />
    </div>
  );
}
