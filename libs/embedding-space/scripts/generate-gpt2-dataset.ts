import { isAbsolute, normalize, relative, resolve } from "node:path";

type Cluster = "people" | "nature" | "animals" | "technology" | "places" | "emotion" | "food" | "polysemy";

interface EntrySpec {
  id: string;
  label: string;
  cluster: Cluster;
  description: string;
  tokens: string[];
  polysemyNote?: string;
}

interface TensorHeader {
  dtype: string;
  shape: number[];
  data_offsets: [number, number];
}

const entries: EntrySpec[] = [
  ...[
    ["king", "king", "A royal title and person noun."], ["queen", "queen", "A royal title and person noun."],
    ["prince", "prince", "A royal title."], ["princess", "princess", "A royal title."],
    ["man", "man", "A common person noun."], ["woman", "woman", "A common person noun."],
    ["boy", "boy", "A common person noun."], ["girl", "girl", "A common person noun."],
    ["mother", "mother", "A family-role noun."], ["father", "father", "A family-role noun."],
  ].map(([id, label, description]) => ({ id, label, description, cluster: "people" as const, tokens: [`Ġ${label}`] })),
  ...[
    ["forest", "forest"], ["tree", "tree"], ["river", "river"], ["mountain", "mountain"], ["ocean", "ocean"],
    ["flower", "flower"], ["garden", "garden"], ["sky", "sky"], ["moon", "moon"], ["sun", "sun"],
  ].map(([id, label]) => ({ id, label, cluster: "nature" as const, description: "A curated natural-world token.", tokens: [`Ġ${label}`] })),
  ...[
    ["dog", "dog"], ["cat", "cat"], ["horse", "horse"], ["bird", "bird"], ["wolf", "wolf"],
    ["lion", "lion"], ["tiger", "tiger"], ["fish", "fish"], ["bear", "bear"],
  ].map(([id, label]) => ({ id, label, cluster: "animals" as const, description: "A curated animal token.", tokens: [`Ġ${label}`] })),
  { id: "sea-lion", label: "sea lion", cluster: "animals", description: "A mean-pooled, two-token teaching composite.", tokens: ["Ġsea", "Ġlion"] },
  ...[
    ["code", "code"], ["software", "software"], ["computer", "computer"], ["data", "data"], ["network", "network"],
    ["robot", "robot"], ["machine", "machine"], ["server", "server"], ["digital", "digital"], ["algorithm", "algorithm"],
  ].map(([id, label]) => ({ id, label, cluster: "technology" as const, description: "A curated computing token.", tokens: [`Ġ${label}`] })),
  ...[
    ["city", "city"], ["village", "village"], ["street", "street"], ["building", "building"], ["house", "house"],
    ["bridge", "bridge"], ["road", "road"], ["country", "country"], ["world", "world"],
  ].map(([id, label]) => ({ id, label, cluster: "places" as const, description: "A curated place or built-environment token.", tokens: [`Ġ${label}`] })),
  { id: "new-york", label: "New York", cluster: "places", description: "A mean-pooled, two-token teaching composite.", tokens: ["ĠNew", "ĠYork"] },
  ...[
    ["happy", "happy"], ["sad", "sad"], ["angry", "angry"], ["calm", "calm"],
    ["love", "love"], ["fear", "fear"], ["joy", "joy"], ["hope", "hope"],
  ].map(([id, label]) => ({ id, label, cluster: "emotion" as const, description: "A curated affective token.", tokens: [`Ġ${label}`] })),
  ...[
    ["apple", "apple"], ["orange", "orange"], ["banana", "banana"], ["bread", "bread"], ["coffee", "coffee"],
    ["tea", "tea"], ["cheese", "cheese"], ["rice", "rice"], ["wine", "wine"],
  ].map(([id, label]) => ({ id, label, cluster: "food" as const, description: "A curated food or drink token.", tokens: [`Ġ${label}`] })),
  { id: "ice-cream", label: "ice cream", cluster: "food", description: "A mean-pooled, two-token teaching composite.", tokens: ["Ġice", "Ġcream"] },
  { id: "bank", label: "bank", cluster: "polysemy", description: "One static token shared across ordinary senses.", tokens: ["Ġbank"], polysemyNote: "Can refer to a financial institution or a river bank; this static row does not choose a contextual sense." },
  { id: "mouse", label: "mouse", cluster: "polysemy", description: "One static token shared across ordinary senses.", tokens: ["Ġmouse"], polysemyNote: "Can refer to an animal or an input device; context-dependent activations would differ later in the model." },
  { id: "python", label: "python", cluster: "polysemy", description: "One static token shared across ordinary senses.", tokens: ["Ġpython"], polysemyNote: "Can refer to a snake or a programming language; the embedding row is not a complete stored concept." },
  { id: "market", label: "market", cluster: "polysemy", description: "One static token used in several ordinary frames.", tokens: ["Ġmarket"], polysemyNote: "Financial, commercial, and physical-market uses share this static token row." },
];

const transformations = [
  {
    id: "royal-analogy",
    label: "Apply the man → woman direction",
    shortLabel: "man → woman",
    description: "Adds woman − man to the selected source vector. This tests a familiar analogy direction but does not guarantee a clean linguistic relation in GPT-2's input table.",
    formula: "selected − man + woman",
    subtract: ["man"],
    add: ["woman"],
    applicableClusters: ["people"],
    illustrative: true,
  },
  {
    id: "natural-to-technical",
    label: "Apply the nature → technology centroid direction",
    shortLabel: "nature → tech",
    description: "Adds the difference between two curated cluster centroids in the original 768-dimensional space.",
    formula: "selected − mean(nature) + mean(technology)",
    subtract: ["forest", "tree", "river", "mountain", "ocean", "flower", "garden", "sky", "moon", "sun"],
    add: ["code", "software", "computer", "data", "network", "robot", "machine", "server", "digital", "algorithm"],
    applicableClusters: ["nature", "technology"],
    illustrative: true,
  },
  {
    id: "animal-to-food",
    label: "Apply the animal → food centroid direction",
    shortLabel: "animal → food",
    description: "Adds the difference between curated animal and food centroids in source space.",
    formula: "selected − mean(animals) + mean(food)",
    subtract: ["dog", "cat", "horse", "bird", "wolf", "lion", "tiger", "fish", "bear", "sea-lion"],
    add: ["apple", "orange", "banana", "bread", "coffee", "tea", "cheese", "rice", "wine", "ice-cream"],
    applicableClusters: ["animals", "food"],
    illustrative: true,
  },
] as const;

function parseArgs() {
  const args = Bun.argv.slice(2);
  const valueAfter = (flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const model = valueAfter("--model");
  const tokenizer = valueAfter("--tokenizer");
  const output = valueAfter("--output");
  if (!model || !tokenizer || !output) {
    throw new Error("Usage: --model <model.safetensors> --tokenizer <tokenizer.json> --output <library-owned.json>");
  }
  return { model: resolve(model), tokenizer: resolve(tokenizer), output: resolve(output) };
}

function validateOutput(output: string) {
  const projectRoot = resolve(import.meta.dir, "..");
  const withinProject = relative(projectRoot, output);
  if (!isAbsolute(output) || withinProject.startsWith("..") || normalize(withinProject) !== "src/data/gpt2-embedding-space.json") {
    throw new Error(`Generated output must be the explicit library-owned dataset path. Received ${output}`);
  }
}

function dot(a: readonly number[], b: readonly number[]) {
  return a.reduce((sum, value, index) => sum + value * (b[index] ?? 0), 0);
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function normalizeVector(vector: number[]) {
  const magnitude = Math.sqrt(dot(vector, vector));
  return vector.map((value) => value / magnitude);
}

function multiplyCovariance(centered: readonly number[][], vector: readonly number[]) {
  const result = Array(vector.length).fill(0) as number[];
  for (const row of centered) {
    const weight = dot(row, vector);
    for (let index = 0; index < result.length; index += 1) result[index] += (row[index] ?? 0) * weight;
  }
  return result.map((value) => value / Math.max(1, centered.length - 1));
}

function principalComponent(centered: readonly number[][], seedIndex: number, orthogonalTo?: readonly number[]) {
  let vector = Array(centered[0]?.length ?? 0).fill(0) as number[];
  vector[seedIndex] = 1;
  for (let iteration = 0; iteration < 160; iteration += 1) {
    let next = multiplyCovariance(centered, vector);
    if (orthogonalTo) {
      const projection = dot(next, orthogonalTo);
      next = next.map((value, index) => value - projection * (orthogonalTo[index] ?? 0));
    }
    vector = normalizeVector(next);
  }
  const largest = vector.reduce((best, value, index) => Math.abs(value) > Math.abs(vector[best] ?? 0) ? index : best, 0);
  return (vector[largest] ?? 0) < 0 ? vector.map((value) => -value) : vector;
}

function mean(vectors: readonly number[][]) {
  return Array.from({ length: vectors[0]?.length ?? 0 }, (_, index) =>
    vectors.reduce((sum, vector) => sum + (vector[index] ?? 0), 0) / vectors.length,
  );
}

const { model, tokenizer, output } = parseArgs();
validateOutput(output);
const tokenizerJson = await Bun.file(tokenizer).json() as { model: { vocab: Record<string, number> } };
const modelBuffer = await Bun.file(model).arrayBuffer();
const view = new DataView(modelBuffer);
const headerLength = Number(view.getBigUint64(0, true));
const header = JSON.parse(new TextDecoder().decode(new Uint8Array(modelBuffer, 8, headerLength))) as Record<string, TensorHeader>;
const tensor = header["wte.weight"];
if (!tensor || tensor.dtype !== "F32" || tensor.shape[1] !== 768) throw new Error("Expected GPT-2 F32 wte.weight with 768 dimensions.");
const dataStart = 8 + headerLength + tensor.data_offsets[0];
const dimensions = tensor.shape[1];

const tokenVector = (piece: string) => {
  const tokenId = tokenizerJson.model.vocab[piece];
  if (tokenId === undefined) throw new Error(`Token piece ${piece} is absent from the supplied vocabulary.`);
  return {
    tokenId,
    vector: Array.from({ length: dimensions }, (_, index) => view.getFloat32(dataStart + (tokenId * dimensions + index) * 4, true)),
  };
};

const points = entries.map((entry) => {
  const rows = entry.tokens.map(tokenVector);
  return {
    ...entry,
    representation: rows.length === 1 ? "token" : "pooled",
    tokenIds: rows.map((row) => row.tokenId),
    tokenPieces: entry.tokens,
    vector: mean(rows.map((row) => row.vector)).map((value) => round(value, 4)),
  };
});

const sourceMean = mean(points.map((point) => point.vector)).map((value) => round(value, 6));
const centered = points.map((point) => point.vector.map((value, index) => value - (sourceMean[index] ?? 0)));
const pc1 = principalComponent(centered, 0);
const pc2 = principalComponent(centered, 1, pc1);
const eigen1 = dot(pc1, multiplyCovariance(centered, pc1));
const eigen2 = dot(pc2, multiplyCovariance(centered, pc2));
const totalVariance = centered.reduce((sum, row) => sum + dot(row, row), 0) / Math.max(1, centered.length - 1);
const storedPc1 = pc1.map((value) => round(value, 6));
const storedPc2 = pc2.map((value) => round(value, 6));
const projected = points.map((point, index) => ({
  ...point,
  projection: [round(dot(centered[index] ?? [], storedPc1), 6), round(dot(centered[index] ?? [], storedPc2), 6)] as [number, number],
}));
const xs = projected.map((point) => point.projection[0]);
const ys = projected.map((point) => point.projection[1]);

const dataset = {
  id: "gpt2-curated-token-space-v1",
  title: "A projected neighborhood of GPT-2 tokens",
  source: {
    model: "GPT-2 small (124M)",
    tensor: "wte.weight",
    vocabulary: "GPT-2 byte-level BPE",
    dimensions,
    license: "Modified MIT",
    sourceUrl: "https://huggingface.co/openai-community/gpt2",
    licenseUrl: "https://github.com/openai/gpt-2/blob/master/LICENSE",
    generatedAt: "2026-08-20",
    precision: "Source tensor values rounded to 4 decimal places for browser delivery",
    caveat: "These are static input-table rows, not contextual activations or complete meanings. Multi-token teaching composites are arithmetic means and are not stored GPT-2 parameters.",
  },
  projection: {
    method: "PCA",
    dimensions: 2,
    sourceDimensions: dimensions,
    fittedOn: `${points.length} curated entries; filters never refit the basis`,
    fixedBasis: true,
    mean: sourceMean,
    components: [storedPc1, storedPc2],
    explainedVarianceRatio: [round(eigen1 / totalVariance, 8), round(eigen2 / totalVariance, 8)],
    bounds: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) },
  },
  points: projected,
  transformations,
};

await Bun.write(output, `${JSON.stringify(dataset)}\n`);
console.log(`Wrote ${points.length} points × ${dimensions} dimensions to ${output}`);
