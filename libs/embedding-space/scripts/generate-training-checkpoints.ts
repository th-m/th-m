import { isAbsolute, normalize, relative, resolve } from "node:path";

type Category = "roles" | "places" | "animals" | "nature" | "food" | "technology";

const corpus = [
  "king royal man crown throne", "queen royal woman crown throne",
  "prince royal boy crown palace", "princess royal girl crown palace",
  "king man rules royal kingdom", "queen woman rules royal kingdom",
  "prince boy lives royal palace", "princess girl lives royal palace",
  "man woman person human adult", "boy girl person human young",
  "paris france capital city europe", "rome italy capital city europe",
  "berlin germany capital city europe", "madrid spain capital city europe",
  "france paris country nation europe", "italy rome country nation europe",
  "germany berlin country nation europe", "spain madrid country nation europe",
  "dog animal pet home companion", "cat animal pet home companion",
  "wolf animal wild forest hunter", "fox animal wild forest hunter",
  "dog puppy animal friendly companion", "cat kitten animal quiet companion",
  "river water flows forest valley", "ocean water meets coast shore",
  "tree plant grows forest green", "flower plant grows garden green",
  "mountain stone rises valley high", "river stream water flows valley",
  "apple fruit sweet fresh food", "orange fruit sweet fresh food",
  "banana fruit soft fresh food", "bread grain baked warm food",
  "rice grain cooked warm food", "coffee drink roasted warm cup",
  "tea drink leaf warm cup", "computer machine runs software code",
  "server machine stores digital data", "robot machine follows software code",
  "network system moves digital data", "computer program executes code software",
  "server network connects system data",
] as const;

const categorySeeds: Record<Category, readonly string[]> = {
  roles: ["king", "queen", "prince", "princess", "man", "woman", "boy", "girl", "royal", "crown", "throne", "palace", "kingdom", "person", "human", "adult", "young", "rules", "lives"],
  places: ["paris", "france", "rome", "italy", "berlin", "germany", "madrid", "spain", "capital", "city", "europe", "country", "nation"],
  animals: ["dog", "cat", "wolf", "fox", "puppy", "kitten", "animal", "pet", "home", "companion", "wild", "hunter", "friendly", "quiet"],
  nature: ["river", "ocean", "tree", "flower", "mountain", "water", "flows", "forest", "valley", "meets", "coast", "shore", "plant", "grows", "green", "garden", "stone", "rises", "high", "stream"],
  food: ["apple", "orange", "banana", "bread", "rice", "coffee", "tea", "fruit", "sweet", "fresh", "food", "soft", "grain", "baked", "warm", "cooked", "drink", "roasted", "cup", "leaf"],
  technology: ["computer", "server", "robot", "network", "machine", "software", "code", "runs", "stores", "digital", "data", "follows", "system", "moves", "program", "executes", "connects"],
};

const dimensions = 16;
const windowSize = 2;
const negativeSamples = 4;
const epochs = 120;
const checkpointInterval = 5;
const seed = 94721;

function parseOutput() {
  const args = Bun.argv.slice(2);
  const index = args.indexOf("--output");
  const value = index >= 0 ? args[index + 1] : undefined;
  if (!value) throw new Error("Usage: --output <library-owned.json>");
  const output = resolve(value);
  const projectRoot = resolve(import.meta.dir, "..");
  const withinProject = relative(projectRoot, output);
  if (!isAbsolute(output) || withinProject.startsWith("..") || normalize(withinProject) !== "src/data/skip-gram-training.json") {
    throw new Error(`Generated output must be the explicit library-owned training dataset path. Received ${output}`);
  }
  return output;
}

function mulberry32(initial: number) {
  let state = initial >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function sigmoid(value: number) {
  if (value > 12) return 0.9999938558;
  if (value < -12) return 0.0000061442;
  return 1 / (1 + Math.exp(-value));
}

function dot(a: readonly number[], b: readonly number[]) {
  return a.reduce((sum, value, index) => sum + value * (b[index] ?? 0), 0);
}

function vectorMean(vectors: readonly number[][]) {
  return Array.from({ length: vectors[0]?.length ?? 0 }, (_, dimension) =>
    vectors.reduce((sum, vector) => sum + (vector[dimension] ?? 0), 0) / vectors.length,
  );
}

function normalizeVector(vector: number[]) {
  const magnitude = Math.sqrt(dot(vector, vector)) || 1;
  return vector.map((value) => value / magnitude);
}

function covarianceProduct(centered: readonly number[][], vector: readonly number[]) {
  const result = Array(vector.length).fill(0) as number[];
  for (const row of centered) {
    const weight = dot(row, vector);
    for (let index = 0; index < result.length; index += 1) result[index] += (row[index] ?? 0) * weight;
  }
  return result.map((value) => value / Math.max(1, centered.length - 1));
}

function component(centered: readonly number[][], seedIndex: number, orthogonal?: readonly number[]) {
  let vector = Array(centered[0]?.length ?? 0).fill(0) as number[];
  vector[seedIndex] = 1;
  for (let iteration = 0; iteration < 140; iteration += 1) {
    let next = covarianceProduct(centered, vector);
    if (orthogonal) {
      const weight = dot(next, orthogonal);
      next = next.map((value, index) => value - weight * (orthogonal[index] ?? 0));
    }
    vector = normalizeVector(next);
  }
  const pivot = vector.reduce((best, value, index) => Math.abs(value) > Math.abs(vector[best] ?? 0) ? index : best, 0);
  return (vector[pivot] ?? 0) < 0 ? vector.map((value) => -value) : vector;
}

function rounded(value: number, digits = 5) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

const tokenized = corpus.map((sentence) => sentence.split(" "));
const counts = new Map<string, number>();
for (const sentence of tokenized) for (const word of sentence) counts.set(word, (counts.get(word) ?? 0) + 1);
const vocabulary = [...counts.keys()].sort((a, b) => a.localeCompare(b));
const wordIndex = new Map(vocabulary.map((word, index) => [word, index]));
const pairs: Array<[number, number]> = [];
for (const sentence of tokenized) {
  for (let center = 0; center < sentence.length; center += 1) {
    for (let offset = -windowSize; offset <= windowSize; offset += 1) {
      if (offset === 0 || !sentence[center + offset]) continue;
      pairs.push([wordIndex.get(sentence[center]!)!, wordIndex.get(sentence[center + offset]!)!]);
    }
  }
}

const categoryByWord = new Map<string, Category>();
for (const [category, words] of Object.entries(categorySeeds) as Array<[Category, readonly string[]]>) {
  for (const word of words) categoryByWord.set(word, category);
}
for (const word of vocabulary) if (!categoryByWord.has(word)) throw new Error(`Missing category for ${word}.`);

const random = mulberry32(seed);
const input = vocabulary.map(() => Array.from({ length: dimensions }, () => (random() - 0.5) / dimensions));
const outputVectors = vocabulary.map(() => Array(dimensions).fill(0) as number[]);
const weights = vocabulary.map((word) => (counts.get(word) ?? 1) ** 0.75);
const cumulative: number[] = [];
weights.reduce((sum, weight, index) => (cumulative[index] = sum + weight), 0);
const totalWeight = cumulative.at(-1) ?? 1;
const sampleNegative = (positiveContext: number) => {
  for (;;) {
    const target = random() * totalWeight;
    const index = cumulative.findIndex((value) => value >= target);
    if (index !== positiveContext) return Math.max(0, index);
  }
};

const checkpointVectors: Array<{ epoch: number; loss: number; rows: number[][] }> = [
  { epoch: 0, loss: Math.log(2), rows: input.map((row) => [...row]) },
];

for (let epoch = 1; epoch <= epochs; epoch += 1) {
  const order = Array.from({ length: pairs.length }, (_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [order[index], order[swap]] = [order[swap]!, order[index]!];
  }
  const learningRate = 0.036 - (epoch - 1) / Math.max(1, epochs - 1) * 0.028;
  let totalLoss = 0;
  let observations = 0;
  for (const pairIndex of order) {
    const [center, context] = pairs[pairIndex]!;
    const examples: Array<[number, 0 | 1]> = [[context, 1]];
    for (let negative = 0; negative < negativeSamples; negative += 1) examples.push([sampleNegative(context), 0]);
    for (const [target, label] of examples) {
      const inputRow = input[center]!;
      const outputRow = outputVectors[target]!;
      const inputBefore = [...inputRow];
      const probability = sigmoid(dot(inputRow, outputRow));
      const gradient = probability - label;
      totalLoss += -(label * Math.log(Math.max(probability, 1e-9)) + (1 - label) * Math.log(Math.max(1 - probability, 1e-9)));
      observations += 1;
      for (let dimension = 0; dimension < dimensions; dimension += 1) {
        inputRow[dimension] -= learningRate * gradient * (outputRow[dimension] ?? 0);
        outputRow[dimension] -= learningRate * gradient * (inputBefore[dimension] ?? 0);
      }
    }
  }
  if (epoch % checkpointInterval === 0 || epoch === epochs) {
    checkpointVectors.push({ epoch, loss: totalLoss / observations, rows: input.map((row) => [...row]) });
  }
}

const finalRows = checkpointVectors.at(-1)!.rows;
const projectionMean = vectorMean(finalRows);
const centeredFinal = finalRows.map((row) => row.map((value, index) => value - (projectionMean[index] ?? 0)));
const pc1 = component(centeredFinal, 0);
const pc2 = component(centeredFinal, 1, pc1);
const eigen1 = dot(pc1, covarianceProduct(centeredFinal, pc1));
const eigen2 = dot(pc2, covarianceProduct(centeredFinal, pc2));
const totalVariance = centeredFinal.reduce((sum, row) => sum + dot(row, row), 0) / Math.max(1, centeredFinal.length - 1);
const project = (row: readonly number[]): [number, number] => {
  const centered = row.map((value, index) => value - (projectionMean[index] ?? 0));
  return [dot(centered, pc1), dot(centered, pc2)];
};
const allProjections: Array<[number, number]> = [];
const checkpoints = checkpointVectors.map((checkpoint) => {
  const vectors: Record<string, number[]> = {};
  const projections: Record<string, [number, number]> = {};
  vocabulary.forEach((word, index) => {
    vectors[word] = checkpoint.rows[index]!.map((value) => rounded(value));
    projections[word] = project(checkpoint.rows[index]!).map((value) => rounded(value)) as [number, number];
    allProjections.push(projections[word]!);
  });
  return { epoch: checkpoint.epoch, loss: rounded(checkpoint.loss, 6), vectors, projections };
});

const xs = allProjections.map((point) => point[0]);
const ys = allProjections.map((point) => point[1]);
const dataset = {
  id: "thm-skip-gram-teaching-v1",
  title: "A small embedding model learns from company",
  metadata: {
    algorithm: "skip-gram with negative sampling",
    sentenceCount: corpus.length,
    vocabularySize: vocabulary.length,
    embeddingDimensions: dimensions,
    contextWindow: windowSize,
    trainingPairCount: pairs.length,
    negativeSamples,
    epochs,
    seed,
    checkpointInterval,
    delivery: "precomputed deterministic checkpoints",
  },
  corpus,
  vocabulary: vocabulary.map((word) => ({ word, count: counts.get(word)!, category: categoryByWord.get(word)! })),
  projection: {
    method: "PCA",
    fittedOn: "final checkpoint",
    fixedBasis: true,
    mean: projectionMean.map((value) => rounded(value, 6)),
    components: [pc1.map((value) => rounded(value, 6)), pc2.map((value) => rounded(value, 6))],
    explainedVarianceRatio: [rounded(eigen1 / totalVariance, 8), rounded(eigen2 / totalVariance, 8)],
    bounds: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) },
  },
  checkpoints,
  disclosure: "This is an original, compact teaching corpus and a precomputed replay of deterministic skip-gram training with negative sampling. It illustrates co-occurrence geometry; production decoder LLM token embeddings use different training objectives and architectures.",
};

const outputPath = parseOutput();
await Bun.write(outputPath, `${JSON.stringify(dataset)}\n`);
console.log(`Wrote ${checkpoints.length} checkpoints for ${vocabulary.length} words to ${outputPath}`);
