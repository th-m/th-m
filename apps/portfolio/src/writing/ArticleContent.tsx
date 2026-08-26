import { articleAssetUrl, type PublishedArticle } from "../content/blog-content";
import { blogPages } from "../generated/blog-pages/registry";
import { ArticleMarkdown, type InlineFigures } from "./ArticleMarkdown";
import { PublicationDate } from "./PublicationDate";
import {
  createLayerDependencyGraph,
  createUnderstandingLoopGraph,
  createUnderstandingPipelineGraph,
  PropositionGraphFigure,
} from "@th-m/graph-visualization";

const pipelineGraph = createUnderstandingPipelineGraph("2026-08-22T00:00:00.000Z");
const loopGraph = createUnderstandingLoopGraph("2026-08-22T00:00:00.000Z");
const layerGraph = createLayerDependencyGraph("2026-08-22T00:00:00.000Z");

/**
 * Inline interactive figures available to article markdown through
 * `<!-- <id> -->` markers. Composition is portfolio-owned; the components
 * themselves live in reusable visualization libraries.
 */
const articleInlineFigures: InlineFigures = {
  "understanding-pipeline": () => <PropositionGraphFigure document={pipelineGraph} title="Proof abundance pipeline" />,
  "understanding-loop": () => <PropositionGraphFigure document={loopGraph} title="The understanding loop" />,
  "ontology-layer-graph": () => <PropositionGraphFigure document={layerGraph} title="Factory layer dependencies" />,
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
