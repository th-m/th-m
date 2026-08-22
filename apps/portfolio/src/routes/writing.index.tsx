import { Link, createFileRoute } from "@tanstack/react-router";
import type { BlogManifest } from "@th-m/blogs/publish";
import { loadBlogManifest } from "../content/blog-content";
import { articleBundleNodes } from "../content/article-bundle";
import { PublicationDate } from "../writing/PublicationDate";

export const Route = createFileRoute("/writing/")({
  loader: loadBlogManifest,
  head: () => ({
    meta: [
      { title: "Writing — Thomas Valadez" },
      { name: "description", content: "Essays about AI, ontology, software systems, and the economics of knowledge work." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Writing — Thomas Valadez" },
      { property: "og:description", content: "Essays about AI, ontology, software systems, and the economics of knowledge work." },
      { property: "og:url", content: "https://th-m.netlify.app/writing" },
      { name: "twitter:title", content: "Writing — Thomas Valadez" },
      { name: "twitter:description", content: "Essays about AI, ontology, software systems, and the economics of knowledge work." },
    ],
    links: [{ rel: "canonical", href: "https://th-m.netlify.app/writing" }],
  }),
  component: WritingIndexPage,
});

function WritingIndexPage() {
  const manifest = Route.useLoaderData();
  const bySlug = new Map(manifest.posts.map((post) => [post.slug, post]));
  const factorySeries = articleBundleNodes.flatMap((node) => {
    const post = bySlug.get(node.slug);
    return post ? [post] : [];
  });
  const factorySlugs = new Set(factorySeries.map((post) => post.slug));
  const remainingPosts = manifest.posts.filter((post) => !factorySlugs.has(post.slug));

  return (
    <div className="writing-page">
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
        <>
          {factorySeries.length > 0 ? (
            <section className="writing-collection" aria-labelledby="factory-series-title">
              <header className="writing-collection__header">
                <p className="eyebrow">01 · Six-part sequence</p>
                <div>
                  <h2 id="factory-series-title">AI Factory series</h2>
                  <p>
                    Read the foundations first, follow them into the Knowledge Factory,
                    then continue through its ontology and cognition.
                  </p>
                </div>
              </header>
              <WritingList posts={factorySeries} />
            </section>
          ) : null}

          {remainingPosts.length > 0 ? (
            <section className="writing-collection" aria-labelledby="writing-archive-title">
              <header className="writing-collection__header">
                <p className="eyebrow">02 · Independent essays</p>
                <div>
                  <h2 id="writing-archive-title">Other writing</h2>
                  <p>Arguments and field notes that sit outside the factory sequence.</p>
                </div>
              </header>
              <WritingList posts={remainingPosts} />
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

function WritingList({ posts }: { posts: BlogManifest["posts"] }) {
  return (
    <ol className="writing-list">
      {posts.map((post, index) => (
        <li key={post.slug}>
          <p className="section-index">{String(index + 1).padStart(2, "0")}</p>
          <article>
            <PublicationDate value={post.publishedAt} />
            <h3><Link to="/writing/$slug" params={{ slug: post.slug }}>{post.title}</Link></h3>
            <p>{post.description}</p>
            {post.tags.length > 0 ? <ul className="article-tags" aria-label="Topics">{post.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> : null}
          </article>
        </li>
      ))}
    </ol>
  );
}
