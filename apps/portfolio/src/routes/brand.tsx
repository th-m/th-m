import { Link, createFileRoute } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/brand")({
  head: () => ({
    meta: [
      { title: "THOM Brand — Thomas Valadez" },
      { name: "description", content: "The principles, geometry, typography, and applications behind the THOM identity." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "THOM Brand — Thomas Valadez" },
      { property: "og:description", content: "Start with what remains true. Balance constraints. Let relationships create structure. Compose the result." },
      { property: "og:url", content: "https://th-m.netlify.app/brand" },
      { name: "twitter:title", content: "THOM Brand — Thomas Valadez" },
      { name: "twitter:description", content: "The principles, geometry, typography, and applications behind the THOM identity." },
    ],
    links: [{ rel: "canonical", href: "https://th-m.netlify.app/brand" }],
  }),
  component: BrandPage,
});

function BrandPage() {
  return <App systemLink={<Link to="/design-system">System</Link>} writingLink={<Link to="/writing">Writing</Link>} />;
}
