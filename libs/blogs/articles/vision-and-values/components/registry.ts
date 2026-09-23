import { defineArticleComponents } from "@th-m/blogs/mdx";
import { AiFactoryMotif, ArticleBundleGraph } from "@th-m/blogs/components";
import { NeuralTrainingFigure } from "@th-m/blogs/components/neural-training-figure";
import { createElement } from "react";
import articleAssets from "../article-assets";
import { PopulationMeanFigure } from "./population-mean-figure";
import { RelationalKnowingFigure } from "./relational-knowing-figure";
import { ValueLadder } from "./value-ladder";
import { GoalTreeFigure } from "./goal-tree-figure";
import { StrategyMapFigure } from "./strategy-map-figure";
import { GoverningLoopFigure } from "./governing-loop-figure";
import { LanguageCompressionFigure } from "./language-compression-figure";
import { MorphemeGlossary } from "./morpheme-glossary";

function VisionToMorphemeMotif() {
  return createElement(AiFactoryMotif, { variant: "vision-to-morpheme" });
}

function ExperienceButLackingMotif() {
  return createElement(AiFactoryMotif, { variant: "experience-but-lacking" });
}

function ModelPrioritiesAndGoalFitMotif() {
  return createElement(AiFactoryMotif, { variant: "model-priorities-and-goal-fit" });
}

function ArticleBundleGraphFigure() {
  return createElement(ArticleBundleGraph, { className: "home-graph--article", currentSlug: "vision-and-values", nextSlug: "understanding-and-bottlenecks" });
}

export default defineArticleComponents(articleAssets, () => ({
  "article-bundle-graph": ArticleBundleGraphFigure,
  "experience-but-lacking": ExperienceButLackingMotif,
  "goal-tree-figure": GoalTreeFigure,
  "governing-loop-figure": GoverningLoopFigure,
  "language-compression-figure": LanguageCompressionFigure,
  "morpheme-to-token-motif": VisionToMorphemeMotif,
  "morpheme-glossary": MorphemeGlossary,
  "model-priorities-and-goal-fit": ModelPrioritiesAndGoalFitMotif,
  "neural-training-figure": NeuralTrainingFigure,
  "population-mean-figure": PopulationMeanFigure,
  "relational-knowing-figure": RelationalKnowingFigure,
  "strategy-map-figure": StrategyMapFigure,
  "value-ladder": ValueLadder,
}));
