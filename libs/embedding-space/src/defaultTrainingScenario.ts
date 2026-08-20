import trainingDataset from "./data/skip-gram-training.json";
import type { EmbeddingTrainingDataset } from "./trainingTypes";

export const defaultEmbeddingTrainingDataset = trainingDataset as unknown as EmbeddingTrainingDataset;
