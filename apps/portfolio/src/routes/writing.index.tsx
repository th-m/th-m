import { Link, createFileRoute } from "@tanstack/react-router";
import { loadBlogManifest } from "../content/blog-content";
import { PublicationDate, WritingChrome } from "../writing/WritingChrome";

export const Route = createFileRoute("/writing/")({
  loader: loadBlogManifest,
  head: () => ({
    meta: [
      { title: "Writing — Thomas Valadez" },
      { name: "description", content: "Essays about AI, ontology, software systems, and the economics of knowledge work." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Writing — Thomas Valadez" },
      { property: "og:description", content: "Essays about AI, ontology, software systems, and the economics of knowledge work." },
      { property: "og:url", content: "https://th-m.codes/writing" },
      { name: "twitter:title", content: "Writing — Thomas Valadez" },
      { name: "twitter:description", content: "Essays about AI, ontology, software systems, and the economics of knowledge work." },
    ],
    links: [{ rel: "canonical", href: "https://th-m.codes/writing" }],
  }),
  component: WritingIndexPage,
});

function WritingIndexPage() {
  const manifest = Route.useLoaderData();
  return (
    <WritingChrome>
      <header className="writing-intro">
        <p className="eyebrow">Writing</p>
        <h1>Ideas with enough structure to navigate.</h1>
        <p>Essays about AI, ontology, software systems, and the economics of knowledge work.</p>
      </header>
      {manifest.posts.length === 0 ? (
        <section className="writing-empty" aria-labelledby="writing-empty-title">
          <p className="section-index">00</p>
          <div>
            <h2 id="writing-empty-title">The drafts are still becoming articles.</h2>
            <p>Published essays will appear here when their research, argument, and language are ready.</p>
          </div>
        </section>
      ) : (
        <ol className="writing-list">
          {manifest.posts.map((post, index) => (
            <li key={post.slug}>
              <p className="section-index">{String(index + 1).padStart(2, "0")}</p>
              <article>
                <PublicationDate value={post.publishedAt} />
                <h2><Link to="/writing/$slug" params={{ slug: post.slug }}>{post.title}</Link></h2>
                <p>{post.description}</p>
                {post.tags.length > 0 ? <ul className="article-tags" aria-label="Topics">{post.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> : null}
              </article>
            </li>
          ))}
        </ol>
      )}
    </WritingChrome>
  );
}
