import type { EmbeddingTrainingDataset } from "./trainingTypes";

export type EmbeddingCluster =
  | "people"
  | "nature"
  | "animals"
  | "technology"
  | "places"
  | "emotion"
  | "food"
  | "polysemy";

export type RepresentationKind = "token" | "pooled";

export interface EmbeddingPoint {
  id: string;
  label: string;
  cluster: EmbeddingCluster;
  description: string;
  representation: RepresentationKind;
  tokenIds: number[];
  tokenPieces: string[];
  vector: number[];
  projection: [number, number];
  polysemyNote?: string;
}

export interface ProjectionMetadata {
  method: "PCA";
  dimensions: 2;
  sourceDimensions: number;
  fittedOn: string;
  fixedBasis: true;
  mean: number[];
  components: [number[], number[]];
  explainedVarianceRatio: [number, number];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export interface VectorSourceMetadata {
  model: string;
  tensor: string;
  vocabulary: string;
  dimensions: number;
  license: string;
  sourceUrl: string;
  licenseUrl: string;
  generatedAt: string;
  precision: string;
  caveat: string;
}

export interface TransformationPreset {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  formula: string;
  subtract: string[];
  add: string[];
  scale?: number;
  applicableClusters?: EmbeddingCluster[];
  illustrative: true;
}

export interface EmbeddingDataset {
  id: string;
  title: string;
  source: VectorSourceMetadata;
  projection: ProjectionMetadata;
  points: EmbeddingPoint[];
  transformations: TransformationPreset[];
}

export interface EmbeddingSpaceCopy {
  eyebrow?: string;
  title?: string;
  introduction?: string;
}

export interface EmbeddingSpaceVisualizationProps {
  dataset?: EmbeddingDataset;
  trainingDataset?: EmbeddingTrainingDataset;
  initialMode?: "explore" | "train";
  initialSelection?: string;
  projectionMetadata?: ProjectionMetadata;
  transformationPresets?: TransformationPreset[];
  copy?: EmbeddingSpaceCopy;
  className?: string;
}

export interface NeighborResult {
  point: EmbeddingPoint;
  similarity: number;
}

export interface TransformedVector {
  vector: number[];
  projection: [number, number];
  operation: TransformationPreset;
}
