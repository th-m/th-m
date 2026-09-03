import { defineArticleComponents } from "@th-m/blogs/mdx";
import { NeuralTrainingFigure } from "@th-m/blogs/components/neural-training-figure";
import articleAssets from "../article-assets";
import { PopulationMeanFigure } from "./population-mean-figure";
import { RelationalKnowingFigure } from "./relational-knowing-figure";
import { ValueLadder } from "./value-ladder";
import { GoalTreeFigure } from "./goal-tree-figure";
import { StrategyMapFigure } from "./strategy-map-figure";
import { GoverningLoopFigure } from "./governing-loop-figure";
import { LanguageCompressionFigure } from "./language-compression-figure";
import { MorphemeGlossary } from "./morpheme-glossary";

export default defineArticleComponents(articleAssets, () => ({
  "goal-tree-figure": GoalTreeFigure,
  "governing-loop-figure": GoverningLoopFigure,
  "language-compression-figure": LanguageCompressionFigure,
  "morpheme-glossary": MorphemeGlossary,
  "neural-training-figure": NeuralTrainingFigure,
  "population-mean-figure": PopulationMeanFigure,
  "relational-knowing-figure": RelationalKnowingFigure,
  "strategy-map-figure": StrategyMapFigure,
  "value-ladder": ValueLadder,
}));
