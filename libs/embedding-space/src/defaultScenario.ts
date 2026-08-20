import dataset from "./data/gpt2-embedding-space.json";
import type { EmbeddingDataset } from "./types";

export const defaultEmbeddingDataset = dataset as unknown as EmbeddingDataset;
