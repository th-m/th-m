export type TrainingCategory = "roles" | "places" | "animals" | "nature" | "food" | "technology";

export interface TrainingWord {
  word: string;
  count: number;
  category: TrainingCategory;
}

export interface TrainingCheckpoint {
  epoch: number;
  loss: number;
  vectors: Record<string, number[]>;
  projections: Record<string, [number, number]>;
}

export interface TrainingProjection {
  method: "PCA";
  fittedOn: "final checkpoint";
  fixedBasis: true;
  mean: number[];
  components: [number[], number[]];
  explainedVarianceRatio: [number, number];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export interface EmbeddingTrainingDataset {
  id: string;
  title: string;
  metadata: {
    algorithm: "skip-gram with negative sampling";
    sentenceCount: number;
    vocabularySize: number;
    embeddingDimensions: number;
    contextWindow: number;
    trainingPairCount: number;
    negativeSamples: number;
    epochs: number;
    seed: number;
    checkpointInterval: number;
    delivery: "precomputed deterministic checkpoints";
  };
  corpus: string[];
  vocabulary: TrainingWord[];
  projection: TrainingProjection;
  checkpoints: TrainingCheckpoint[];
  disclosure: string;
}

