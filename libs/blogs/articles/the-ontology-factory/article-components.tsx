import { defineArticleComponents } from "@th-m/blogs/mdx";
import { createLayerDependencyGraph, PropositionGraphFigure } from "@th-m/graph-visualization";
import articleAssets from "./article-assets";

const layerGraph = createLayerDependencyGraph("2026-08-22T00:00:00.000Z");

export default defineArticleComponents(articleAssets, () => ({
  "ontology-layer-graph": () => <PropositionGraphFigure document={layerGraph} title="Factory layer dependencies" />,
}));
