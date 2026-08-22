import { articleAssetUrl, type PublishedArticle } from "../content/blog-content";
import { blogPages } from "../generated/blog-pages/registry";
import { ArticleMarkdown, type InlineFigures } from "./ArticleMarkdown";
import { PublicationDate } from "./PublicationDate";
import { NeuralNetAnimation } from "@th-m/neural-net-visualization";

/**
 * Inline interactive figures available to article markdown through
 * `<!-- <id> -->` markers. Composition is portfolio-owned; the components
 * themselves live in reusable visualization libraries.
 */
const articleInlineFigures: InlineFigures = {
  "neural-net-lab": () => <NeuralNetAnimation effect="backprop" />,
};

/**
 * Dispatches a published article to its dedicated React page when one exists
 * in the generated registry, otherwise renders the generic Markdown fallback
 * with the standard article header.
 */
export function ArticleContent({ article }: { article: PublishedArticle }) {
  const Page = blogPages[article.slug];
  if (Page) {
    return <Page post={article} assetUrl={(value) => articleAssetUrl(article, value)} />;
  }
  return (
    <>
      <header>
        <p className="eyebrow">Essay</p>
        <h1>{article.title}</h1>
        <p className="article-description">{article.description}</p>
        <div className="article-meta">
          <PublicationDate value={article.publishedAt} />
          {article.updatedAt ? <span>Updated <PublicationDate value={article.updatedAt} /></span> : null}
        </div>
        {article.tags.length > 0 ? <ul className="article-tags" aria-label="Topics">{article.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> : null}
      </header>
      <ArticleMarkdown article={article} inlineFigures={articleInlineFigures} />
    </>
  );
}
