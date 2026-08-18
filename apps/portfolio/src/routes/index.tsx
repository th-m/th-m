import { Link, createFileRoute } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "THOM — Thomas Valadez" },
      { name: "description", content: "Thomas Valadez explores how software systems become understandable enough to change." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "THOM — Thomas Valadez" },
      { property: "og:description", content: "Start with what remains true. Balance constraints. Let relationships create structure. Compose the result." },
      { property: "og:url", content: "https://th-m.codes" },
      { name: "twitter:title", content: "THOM — Thomas Valadez" },
      { name: "twitter:description", content: "Software systems, product intent, and durable design." },
    ],
    links: [{ rel: "canonical", href: "https://th-m.codes" }],
  }),
  component: HomePage,
});

function HomePage() {
  return <App writingLink={<Link to="/writing">Writing</Link>} />;
}
