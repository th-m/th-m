import { createFileRoute } from "@tanstack/react-router";
import { LawsCatalog } from "../laws/LawsCatalog";

export const Route = createFileRoute("/laws")({
  head: () => ({
    meta: [
      { title: "Laws — Thomas Valadez" },
      { name: "description", content: "A filterable catalog of principles for interfaces, software, reasoning, AI, organizations, and systems." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Laws — Thomas Valadez" },
      { property: "og:description", content: "A working catalog of principles for making interfaces, software, and intelligent systems easier to reason about." },
      { property: "og:url", content: "https://th-m.netlify.app/laws" },
    ],
    links: [{ rel: "canonical", href: "https://th-m.netlify.app/laws" }],
  }),
  component: LawsPage,
});

function LawsPage() {
  return (
    <div className="laws-page">
      <header className="laws-page__intro">
        <p className="eyebrow">Reference library</p>
        <h1>Laws for making systems legible.</h1>
        <p>
          Select any type to focus the catalog. Select more types to widen the
          result; clear the last selection to see everything again.
        </p>
      </header>
      <LawsCatalog />
    </div>
  );
}
