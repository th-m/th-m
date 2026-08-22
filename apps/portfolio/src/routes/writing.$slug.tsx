import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { loadPublishedArticle } from "../content/blog-content";
import { ArticleContent } from "../writing/ArticleContent";

const siteOrigin = "https://th-m.netlify.app";

export const Route = createFileRoute("/writing/$slug")({
  loader: async ({ params }) => {
    const article = await loadPublishedArticle(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const canonical = `${siteOrigin}/writing/${loaderData.slug}`;
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: loaderData.title,
      description: loaderData.description,
      datePublished: loaderData.publishedAt,
      ...(loaderData.updatedAt ? { dateModified: loaderData.updatedAt } : {}),
      author: { "@type": "Person", name: "Thomas Valadez", url: siteOrigin },
      mainEntityOfPage: canonical,
      image: `${siteOrigin}/brand/thom-og.png`,
    };
    return {
      meta: [
        { title: `${loaderData.title} — Thomas Valadez` },
        { name: "description", content: loaderData.description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.description },
        { property: "og:url", content: canonical },
        { property: "article:published_time", content: loaderData.publishedAt },
        ...(loaderData.updatedAt ? [{ property: "article:modified_time", content: loaderData.updatedAt }] : []),
        { name: "twitter:title", content: loaderData.title },
        { name: "twitter:description", content: loaderData.description },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const article = Route.useLoaderData();

  return (
    <div className="writing-page">
      <article className="article-page">
        <Link className="article-back" to="/writing">← All writing</Link>
        <ArticleContent article={article} />
      </article>
    </div>
  );
}
