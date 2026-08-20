export { defaultEmbeddingDataset } from "./defaultScenario";
export { EmbeddingSpaceVisualization } from "./EmbeddingSpaceVisualization";
export {
  applyTransformation,
  cosineSimilarity,
  meanVector,
  nearestNeighbors,
  projectVector,
  vectorMagnitude,
} from "./math";
export { searchEmbeddingDataset, type SearchResult } from "./search";
export {
  inspectTrainingQuery,
  trainingAnalogy,
  trainingNeighbors,
  type TrainingAnalogyResult,
  type TrainingNeighbor,
  type TrainingQueryStatus,
} from "./trainingMath";
export type {
  EmbeddingTrainingDataset,
  TrainingCategory,
  TrainingCheckpoint,
  TrainingProjection,
  TrainingWord,
} from "./trainingTypes";
export type {
  EmbeddingCluster,
  EmbeddingDataset,
  EmbeddingPoint,
  EmbeddingSpaceCopy,
  EmbeddingSpaceVisualizationProps,
  NeighborResult,
  ProjectionMetadata,
  RepresentationKind,
  TransformationPreset,
  TransformedVector,
  VectorSourceMetadata,
} from "./types";
