import { defineArticleComponents } from "@th-m/blogs/mdx";
import { NeuralTrainingFigure } from "@th-m/blogs/components/neural-training-figure";
import articleAssets from "../article-assets";
import { PopulationMeanFigure } from "./population-mean-figure";
import { ValueLadder } from "./value-ladder";
import { GoalTreeFigure } from "./goal-tree-figure";
import { StrategyMapFigure } from "./strategy-map-figure";
import { GoverningLoopFigure } from "./governing-loop-figure";

export default defineArticleComponents(articleAssets, () => ({
  "goal-tree-figure": GoalTreeFigure,
  "governing-loop-figure": GoverningLoopFigure,
  "neural-training-figure": NeuralTrainingFigure,
  "population-mean-figure": PopulationMeanFigure,
  "strategy-map-figure": StrategyMapFigure,
  "value-ladder": ValueLadder,
}));
