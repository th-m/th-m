import type {
  EmbeddingPoint,
  NeighborResult,
  ProjectionMetadata,
  TransformationPreset,
  TransformedVector,
} from "./types";

function assertSameDimensions(a: readonly number[], b: readonly number[]) {
  if (a.length !== b.length) {
    throw new Error(`Vector dimensions must match (${a.length} !== ${b.length}).`);
  }
}

export function vectorMagnitude(vector: readonly number[]): number {
  return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
}

export function cosineSimilarity(a: readonly number[], b: readonly number[]): number {
  assertSameDimensions(a, b);
  const denominator = vectorMagnitude(a) * vectorMagnitude(b);
  if (denominator === 0) return 0;
  return a.reduce((sum, value, index) => sum + value * (b[index] ?? 0), 0) / denominator;
}

export function meanVector(vectors: readonly (readonly number[])[]): number[] {
  if (vectors.length === 0) throw new Error("Cannot average zero vectors.");
  const dimensions = vectors[0]?.length ?? 0;
  if (vectors.some((vector) => vector.length !== dimensions)) {
    throw new Error("All vectors must share a dimensionality.");
  }
  return Array.from({ length: dimensions }, (_, dimension) =>
    vectors.reduce((sum, vector) => sum + (vector[dimension] ?? 0), 0) / vectors.length,
  );
}

export function projectVector(
  vector: readonly number[],
  projection: Pick<ProjectionMetadata, "mean" | "components">,
): [number, number] {
  assertSameDimensions(vector, projection.mean);
  const centered = vector.map((value, index) => value - (projection.mean[index] ?? 0));
  return projection.components.map((component) => {
    assertSameDimensions(centered, component);
    return centered.reduce((sum, value, index) => sum + value * (component[index] ?? 0), 0);
  }) as [number, number];
}

export function applyTransformation(
  selected: EmbeddingPoint,
  preset: TransformationPreset,
  points: readonly EmbeddingPoint[],
  projection: ProjectionMetadata,
): TransformedVector {
  const byId = new Map(points.map((point) => [point.id, point]));
  const resolve = (id: string) => {
    const point = byId.get(id);
    if (!point) throw new Error(`Transformation references unknown point “${id}”.`);
    return point.vector;
  };
  const subtract = meanVector(preset.subtract.map(resolve));
  const add = meanVector(preset.add.map(resolve));
  const direction = Array.from({ length: selected.vector.length }, (_, index) => {
    return ((add[index] ?? 0) - (subtract[index] ?? 0)) * (preset.scale ?? 1);
  });
  const vector = selected.vector.map((value, index) => value + (direction[index] ?? 0));
  return { vector, projection: projectVector(vector, projection), operation: preset };
}

export function nearestNeighbors(
  vector: readonly number[],
  points: readonly EmbeddingPoint[],
  count = 5,
  excludeIds: readonly string[] = [],
): NeighborResult[] {
  const excluded = new Set(excludeIds);
  return points
    .filter((point) => !excluded.has(point.id))
    .map((point) => ({ point, similarity: cosineSimilarity(vector, point.vector) }))
    .sort((a, b) => b.similarity - a.similarity || a.point.label.localeCompare(b.point.label))
    .slice(0, count);
}
