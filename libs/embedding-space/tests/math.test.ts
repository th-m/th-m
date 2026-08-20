import { describe, expect, it } from "vitest";
import {
  applyTransformation,
  cosineSimilarity,
  defaultEmbeddingDataset,
  inspectTrainingQuery,
  meanVector,
  nearestNeighbors,
  projectVector,
  trainingAnalogy,
  trainingNeighbors,
  vectorMagnitude,
} from "../src";
import { defaultEmbeddingTrainingDataset } from "../src/training";

describe("embedding vector math", () => {
  it("keeps cosine calculations in source dimensions", () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBe(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
    expect(cosineSimilarity([1, 0], [-1, 0])).toBe(-1);
    expect(vectorMagnitude([3, 4])).toBe(5);
  });

  it("sorts deterministic source-space neighbors", () => {
    const king = defaultEmbeddingDataset.points.find((point) => point.id === "king");
    expect(king).toBeDefined();
    const neighbors = nearestNeighbors(king!.vector, defaultEmbeddingDataset.points, 3, ["king"]);
    expect(neighbors.map((neighbor) => neighbor.point.id)).toEqual(["queen", "prince", "princess"]);
    expect(neighbors[0]!.similarity).toBeCloseTo(0.657, 2);
  });

  it("applies analogy arithmetic in source space before fixed-basis projection", () => {
    const { points, projection, transformations } = defaultEmbeddingDataset;
    const king = points.find((point) => point.id === "king")!;
    const man = points.find((point) => point.id === "man")!;
    const woman = points.find((point) => point.id === "woman")!;
    const preset = transformations.find((transformation) => transformation.id === "royal-analogy")!;
    const result = applyTransformation(king, preset, points, projection);
    const expected = king.vector.map((value, index) => value - man.vector[index]! + woman.vector[index]!);

    expect(result.vector).toHaveLength(768);
    result.vector.slice(0, 12).forEach((value, index) => expect(value).toBeCloseTo(expected[index]!, 12));
    expect(result.projection[0]).toBeCloseTo(projectVector(expected, projection)[0], 10);
    expect(result.projection[1]).toBeCloseTo(projectVector(expected, projection)[1], 10);
  });

  it("uses centroids for multi-point semantic directions", () => {
    const { points, projection, transformations } = defaultEmbeddingDataset;
    const forest = points.find((point) => point.id === "forest")!;
    const preset = transformations.find((transformation) => transformation.id === "natural-to-technical")!;
    const result = applyTransformation(forest, preset, points, projection);
    const byId = new Map(points.map((point) => [point.id, point.vector]));
    const nature = meanVector(preset.subtract.map((id) => byId.get(id)!));
    const technology = meanVector(preset.add.map((id) => byId.get(id)!));
    const expectedFirst = forest.vector[0]! - nature[0]! + technology[0]!;
    expect(result.vector[0]).toBeCloseTo(expectedFirst, 12);
  });
});

describe("skip-gram training operations", () => {
  const dataset = defaultEmbeddingTrainingDataset;
  const checkpoint = dataset.checkpoints.at(-1)!;

  it("calculates learned neighbors and pairwise cosine in the 16D source space", () => {
    const neighbors = trainingNeighbors(checkpoint.vectors.king!, checkpoint, 3, ["king"]);
    expect(neighbors.map((neighbor) => neighbor.word)).toEqual(["queen", "kingdom", "rules"]);
    expect(neighbors[0]!.similarity).toBeGreaterThan(0.95);
    expect(cosineSimilarity(checkpoint.vectors.king!, checkpoint.vectors.queen!)).toBeCloseTo(neighbors[0]!.similarity, 10);
  });

  it("computes deterministic a - b + c analogy arithmetic before neighbor lookup", () => {
    const result = trainingAnalogy("king", "man", "woman", checkpoint);
    const expected = checkpoint.vectors.king!.map((value, index) => value - checkpoint.vectors.man![index]! + checkpoint.vectors.woman![index]!);
    expect(result.vector).toEqual(expected);
    expect(result.nearest).toMatchObject({ word: "kingdom" });
    expect(result.nearest!.similarity).toBeGreaterThan(0.85);
  });

  it("distinguishes supported, multi-token, and unsupported teaching queries", () => {
    expect(inspectTrainingQuery(" KING ", dataset.vocabulary)).toMatchObject({ status: "supported", word: "king" });
    expect(inspectTrainingQuery("ice cream", dataset.vocabulary)).toMatchObject({ status: "multiple" });
    expect(inspectTrainingQuery("unicorn", dataset.vocabulary)).toMatchObject({ status: "unsupported" });
  });
});
