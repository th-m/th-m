import { describe, expect, it } from "vitest";
import {
  defaultEmbeddingDataset,
  projectVector,
  searchEmbeddingDataset,
} from "../src";
import { defaultEmbeddingTrainingDataset } from "../src/training";

describe("default embedding scenario", () => {
  it("ships deterministic full vectors and a fixed PCA basis", () => {
    expect(defaultEmbeddingDataset.points).toHaveLength(72);
    expect(defaultEmbeddingDataset.source.dimensions).toBe(768);
    expect(defaultEmbeddingDataset.projection.fixedBasis).toBe(true);
    expect(defaultEmbeddingDataset.projection.components[0]).toHaveLength(768);
    expect(defaultEmbeddingDataset.projection.components[1]).toHaveLength(768);

    for (const point of defaultEmbeddingDataset.points) {
      const reprojected = projectVector(point.vector, defaultEmbeddingDataset.projection);
      expect(reprojected[0]).toBeCloseTo(point.projection[0], 5);
      expect(reprojected[1]).toBeCloseTo(point.projection[1], 5);
    }
  });

  it("distinguishes learned token rows from pooled multi-token teaching entries", () => {
    const queen = defaultEmbeddingDataset.points.find((point) => point.id === "queen")!;
    const iceCream = defaultEmbeddingDataset.points.find((point) => point.id === "ice-cream")!;
    expect(queen.representation).toBe("token");
    expect(queen.tokenPieces).toEqual(["Ġqueen"]);
    expect(iceCream.representation).toBe("pooled");
    expect(iceCream.tokenPieces).toEqual(["Ġice", "Ġcream"]);
  });

  it("returns curated matches and explains unsupported ordinary words", () => {
    expect(searchEmbeddingDataset(defaultEmbeddingDataset, "ice cream").matches[0]?.id).toBe("ice-cream");
    const unsupported = searchEmbeddingDataset(defaultEmbeddingDataset, "unicorn");
    expect(unsupported.status).toBe("unsupported");
    expect(unsupported.message).toContain("outside this curated offline dataset");
    expect(unsupported.message).toContain("Token boundaries vary");
  });
});

describe("default skip-gram training scenario", () => {
  it("ships deterministic corpus statistics and progressive checkpoints", () => {
    const dataset = defaultEmbeddingTrainingDataset;
    expect(dataset.metadata).toMatchObject({
      algorithm: "skip-gram with negative sampling",
      sentenceCount: 43,
      vocabularySize: 103,
      embeddingDimensions: 16,
      contextWindow: 2,
      trainingPairCount: 602,
      negativeSamples: 4,
      epochs: 120,
      seed: 94721,
      delivery: "precomputed deterministic checkpoints",
    });
    expect(dataset.checkpoints).toHaveLength(25);
    expect(dataset.checkpoints[0]?.epoch).toBe(0);
    expect(dataset.checkpoints.at(-1)?.epoch).toBe(120);
    expect(dataset.checkpoints.at(-1)!.loss).toBeLessThan(dataset.checkpoints[0]!.loss);
  });

  it("projects every checkpoint through the final checkpoint's fixed PCA basis", () => {
    const dataset = defaultEmbeddingTrainingDataset;
    expect(dataset.projection).toMatchObject({ method: "PCA", fittedOn: "final checkpoint", fixedBasis: true });
    for (const checkpoint of dataset.checkpoints) {
      for (const word of ["king", "river", "computer"]) {
        const reprojected = projectVector(checkpoint.vectors[word]!, dataset.projection);
        expect(reprojected[0]).toBeCloseTo(checkpoint.projections[word]![0], 3);
        expect(reprojected[1]).toBeCloseTo(checkpoint.projections[word]![1], 3);
      }
    }
  });
});
