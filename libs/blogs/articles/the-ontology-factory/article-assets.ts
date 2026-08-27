import { defineArticleAssets } from "@th-m/blogs/mdx";

export default defineArticleAssets({
  "layer-strata": { kind: "image", source: "assets/layer-strata.svg", alt: "The four layers", tags: ["article-figure", "ontology"] },
  "ontology-layer-graph": { kind: "figure", label: "Factory layer dependencies", tags: ["article-figure", "ontology"] },
  "revision-loop": { kind: "image", source: "assets/revision-loop.svg", alt: "The revision loop", tags: ["article-figure", "ontology"] },
});
