import { articleAssetUrl, type PublishedArticle } from "../content/blog-content";
import { blogArticles } from "../generated/blog-pages/registry";
import { LinkPreview, TooltipProvider } from "@th-m/ui";
import { createArticleMdxComponents } from "./ArticleMdx";
import { PublicationDate } from "./PublicationDate";

function titleFromSlug(slug: string): string {
  return slug.split("-").map((word) => {
    if (word === "ai") return "AI";
    if (word === "llm") return "LLM";
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

/**
 * Renders every published article through its generated MDX module and the
 * shared article component vocabulary.
 */
export function ArticleContent({ article }: { article: PublishedArticle }) {
  const entry = blogArticles[article.slug];
  if (!entry) throw new Error(`Published article ${article.slug} is missing its generated MDX module.`);
  const assetUrl = (value: string) => articleAssetUrl(article, value);
  const articleComponents = entry.createComponents?.({ post: article, assetUrl }) ?? {};
  const components = createArticleMdxComponents(article, entry.assets, articleComponents);
  const Content = entry.Content;
  return (
    <TooltipProvider delayDuration={200}>
      <div className="article-outline article-mdx">
        <header className="article-outline__header">
          <p className="eyebrow">
            {article.addendumTo ? "Addendum" : article.slug === "building-an-llm" ? "Technical primer" : "Essay"}
          </p>
          <h1>{article.title}</h1>
          {article.addendumTo ? (
            <LinkPreview url={`/writing/${article.addendumTo}`} asChild>
              <a href={`/writing/${article.addendumTo}`}>{titleFromSlug(article.addendumTo)}</a>
            </LinkPreview>
          ) : null}
          <p className="article-description">{article.description}</p>
          <div className="article-meta">
            <PublicationDate value={article.publishedAt} prefix="Published " />
            {article.updatedAt ? <span>Updated <PublicationDate value={article.updatedAt} /></span> : null}
          </div>
          {article.tags.length > 0 ? (
            <ul className="article-tags" aria-label="Topics">
              {article.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          ) : null}
        </header>
        <Content components={components} post={article} assetUrl={assetUrl} />
      </div>
    </TooltipProvider>
  );
}
