import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

const GraphEditor = lazy(() =>
  import("@th-m/graph-visualization").then((module) => ({
    default: module.PropositionGraphEditor,
  })),
);

export const Route = createFileRoute("/relationship-graph")({
  head: () => ({
    meta: [
      { title: "Relationship Graph — THOM" },
      { name: "description", content: "Author proposition graphs: state what can be asserted, connect propositions with relationships, and export the graph as a self-contained SVG or poster." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Relationship Graph" },
      { property: "og:description", content: "An interactive proposition graph editor — claims as circles, relationships as cards, balanced with deterministic layout." },
      { property: "og:url", content: "https://th-m.netlify.app/relationship-graph" },
    ],
    links: [{ rel: "canonical", href: "https://th-m.netlify.app/relationship-graph" }],
  }),
  component: RelationshipGraphPage,
});

/**
 * Full proposition-graph authoring route. ReactFlow + the ELK worker are
 * client-only, so the prerendered page shows a placeholder and the editor
 * mounts lazily after hydration.
 */
function RelationshipGraphPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relationship-graph-route">
      {mounted ? (
        <Suspense fallback={<div className="relationship-graph-route__loading">Opening the graph editor…</div>}>
          <GraphEditor />
        </Suspense>
      ) : (
        <div className="relationship-graph-route__loading" aria-label="Loading relationship graph editor">
          Opening the graph editor…
        </div>
      )}
    </div>
  );
}
