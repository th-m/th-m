import { defineArticleComponents } from "@th-m/blogs/mdx";
import { AiFactoryMotif } from "@th-m/blogs/components";
import { createLayerDependencyGraph, PropositionGraphFigure } from "@th-m/graph-visualization";
import articleAssets from "./article-assets";

const layerGraph = createLayerDependencyGraph("2026-08-22T00:00:00.000Z");

function OntologyOfTermsMotif() {
  return <AiFactoryMotif variant="ontology-of-terms" />;
}

export default defineArticleComponents(articleAssets, () => ({
  "ontology-terms-motif": OntologyOfTermsMotif,
  "ontology-layer-graph": () => <PropositionGraphFigure document={layerGraph} title="Factory layer dependencies" />,
}));
