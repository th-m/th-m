import { Link, createFileRoute } from "@tanstack/react-router";
import { AnimatedThomLogo } from "@th-m/thom-brand";
import { loadBlogManifest } from "../content/blog-content";
import { PublicationDate } from "../writing/PublicationDate";

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
        <Link className="home-mark__link" to="/brand">Explore the THOM brand <span aria-hidden="true">→</span></Link>
      </section>

      <section className="home-writings" id="writings" aria-labelledby="writings-title">
        <header className="home-writings__header">
          <p className="eyebrow">Thomas Valadez</p>
          <h2 id="writings-title">Writings</h2>
        </header>

        {manifest.posts.length > 0 ? (
          <ol className="home-writing-list">
            {manifest.posts.map((post, index) => (
              <li key={post.slug}>
                <span className="section-index">{String(index + 1).padStart(2, "0")}</span>
                <article>
                  <PublicationDate value={post.publishedAt} />
                  <h3><Link to="/writing/$slug" params={{ slug: post.slug }}>{post.title}</Link></h3>
                  <p>{post.description}</p>
                </article>
              </li>
            ))}
          </ol>
        ) : null}

        <Link className="home-writings__link" to="/writing">
          <span>{manifest.posts.length > 0 ? "All writings" : "Writings"}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
