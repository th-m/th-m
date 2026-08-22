import { Link, createFileRoute } from "@tanstack/react-router";
import { AnimatedThomLogo } from "@th-m/thom-brand";
import { loadBlogManifest } from "../content/blog-content";
import { ArticleBundleGraph } from "../home/ArticleBundleGraph";
import { LawsBento } from "../home/LawsBento";

export const Route = createFileRoute("/")({
  loader: loadBlogManifest,
  head: () => ({
    meta: [
      { title: "THOM — Thomas Valadez" },
      { name: "description", content: "Thomas Valadez — the THOM identity and writing about software systems, AI, and ontology." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "THOM — Thomas Valadez" },
      { property: "og:description", content: "The THOM identity and writing by Thomas Valadez." },
      { property: "og:url", content: "https://th-m.netlify.app" },
      { name: "twitter:title", content: "THOM — Thomas Valadez" },
      { name: "twitter:description", content: "The THOM identity and writing by Thomas Valadez." },
    ],
    links: [{ rel: "canonical", href: "https://th-m.netlify.app" }],
  }),
  component: HomePage,
});

function HomePage() {
  const manifest = Route.useLoaderData();

  return (
    <div className="home-page">
      <section className="home-mark" aria-labelledby="home-title">
        <h1 className="sr-only" id="home-title">THOM — Thomas Valadez</h1>
        <div className="home-mark__logo">
          <AnimatedThomLogo />
        </div>
        <Link className="home-mark__link" to="/writing">Explore the writing <span aria-hidden="true">→</span></Link>
      </section>

      <ArticleBundleGraph posts={manifest.posts} />

      <LawsBento />
    </div>
  );
}
