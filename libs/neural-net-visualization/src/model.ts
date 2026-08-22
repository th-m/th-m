/**
 * Deterministic illustrative model for the neural-net animation component.
 *
 * Everything here is computed from fixed seed weights with pure math — no
 * randomness, no live model calls. The backward pass is real gradient descent
 * on a tiny tanh MLP with a softmax output, so the displayed loss genuinely
 * decreases across epochs while remaining fully deterministic.
 */

export const neuralNetEffects = ["inference", "feed-forward", "backprop"] as const;
export type NeuralNetEffect = (typeof neuralNetEffects)[number];

/** Layer sizes: input, hidden 1, hidden 2, output. */
export const illustrativeLayerSizes = [3, 4, 4, 2] as const;

export const outputTokenLabels = ["the", "story"] as const;
export const outputTargetIndex = 1;

export interface NeuralNetScenario {
  layerSizes: readonly number[];
  input: readonly number[];
  targetIndex: number;
  learningRate: number;
  /** weights[layer] is a row-major matrix [out][in]; biases[layer] length = out. */
  weights: readonly (readonly (readonly number[])[])[];
  biases: readonly (readonly number[])[];
  epochs: number;
}

/** Per-layer activation values for one epoch. layers[layer][node]. */
export type LayerActivations = readonly (readonly number[])[];

export interface EpochTrace {
  activations: LayerActivations;
  probabilities: readonly number[];
  loss: number;
}

export interface NeuralNetTrace {
  epochs: readonly EpochTrace[];
  /** Loss of every epoch, for the backprop readout. */
  losses: readonly number[];
}

/** The default teaching network: 3 → 4 → 4 → 2. */
export const illustrativeScenario: NeuralNetScenario = {
  layerSizes: illustrativeLayerSizes,
  input: [0.52, 0.31, -0.44],
  targetIndex: outputTargetIndex,
  learningRate: 0.1,
  weights: [
    // W1: hidden 1 (4) × input (3)
    [
      [0.32, -0.41, 0.18],
      [-0.25, 0.38, 0.22],
      [0.14, 0.27, -0.35],
      [-0.3, -0.18, 0.42],
    ],
    // W2: hidden 2 (4) × hidden 1 (4)
    [
      [0.24, -0.32, 0.15, 0.28],
      [-0.2, 0.18, -0.34, 0.11],
      [0.31, 0.22, -0.16, -0.27],
      [-0.12, 0.35, 0.26, -0.21],
    ],
    // W3: output (2) × hidden 2 (4) — the target row starts far below the
    // other row so the first prediction is a visibly bad guess.
    [
      [0.55, 0.4, 0.45, 0.3],
      [-1.2, -1.0, -0.9, -0.8],
    ],
  ],
  biases: [
    [0.1, -0.08, 0.12, -0.05],
    [0.06, -0.1, 0.09, 0.04],
    [0.4, -1.1],
  ],
  epochs: 5,
};

export function matMul(
  matrix: readonly (readonly number[])[],
  vector: readonly number[],
): number[] {
  return matrix.map((row) => row.reduce((sum, value, index) => sum + value * vector[index], 0));
}

export function addBias(vector: readonly number[], bias: readonly number[]): number[] {
  return vector.map((value, index) => value + bias[index]);
}

export function tanhVector(vector: readonly number[]): number[] {
  return vector.map((value) => Math.tanh(value));
}

export function softmax(vector: readonly number[]): number[] {
  const max = Math.max(...vector);
  const shifted = vector.map((value) => Math.exp(value - max));
  const sum = shifted.reduce((total, value) => total + value, 0);
  return shifted.map((value) => value / sum);
}

export function crossEntropyLoss(probabilities: readonly number[], targetIndex: number): number {
  const probability = probabilities[targetIndex] ?? 0;
  return -Math.log(Math.max(probability, 1e-9));
}

/** One forward pass; returns per-layer activations and output probabilities. */
export function forwardPass(
  scenario: NeuralNetScenario,
  weights: NeuralNetScenario["weights"],
  biases: NeuralNetScenario["biases"],
): { activations: LayerActivations; probabilities: readonly number[] } {
  const activations: number[][] = [[...scenario.input]];
  for (let layer = 0; layer < weights.length; layer += 1) {
    const pre = addBias(matMul(weights[layer], activations[layer]), biases[layer]);
    activations.push(tanhVector(pre));
  }
  const probabilities = softmax(activations[activations.length - 1]);
  return { activations, probabilities };
}

/** Gradient of cross-entropy loss w.r.t. every weight and bias, via backprop. */
export function backwardPass(
  scenario: NeuralNetScenario,
  weights: NeuralNetScenario["weights"],
  activations: LayerActivations,
): {
  weightGradients: (readonly (readonly number[])[])[];
  biasGradients: (readonly number[])[];
} {
  const layers = weights.length;
  // dL/dz[L] for softmax + cross-entropy is p − onehot(target).
  let gradient = activations[layers].map(
    (value, index) => value - (index === scenario.targetIndex ? 1 : 0),
  );
  const weightGradients: (readonly (readonly number[])[])[] = [];
  const biasGradients: (readonly number[])[] = [];

  for (let layer = layers - 1; layer >= 0; layer -= 1) {
    const input = activations[layer];
    // dW[l][i][j] = g[i] · a[l][j]; db[l][i] = g[i].
    weightGradients.unshift(
      weights[layer].map((row, rowIndex) =>
        row.map((_, columnIndex) => gradient[rowIndex] * input[columnIndex]),
      ),
    );
    biasGradients.unshift([...gradient]);
    if (layer > 0) {
      // dL/da[l][j] = Σᵢ W[l][i][j] · g[i], then dL/dz[l] = dL/da[l] · tanh′(z[l])
      // with tanh′(z[l]) = 1 − a[l]².
      const da = input.map((_, columnIndex) =>
        weights[layer].reduce((sum, row, rowIndex) => sum + row[columnIndex] * gradient[rowIndex], 0),
      );
      gradient = da.map((value, index) => value * (1 - input[index] * input[index]));
    }
  }
  return { weightGradients, biasGradients };
}

function updateWeights(
  scenario: NeuralNetScenario,
  weights: NeuralNetScenario["weights"],
  biases: NeuralNetScenario["biases"],
  weightGradients: (readonly (readonly number[])[])[],
  biasGradients: (readonly number[])[],
): { weights: NeuralNetScenario["weights"]; biases: NeuralNetScenario["biases"] } {
  const lr = scenario.learningRate;
  return {
    weights: weights.map((layer, layerIndex) =>
      layer.map((row, rowIndex) =>
        row.map(
          (value, columnIndex) => value - lr * weightGradients[layerIndex][rowIndex][columnIndex],
        ),
      ),
    ),
    biases: biases.map((layer, layerIndex) =>
      layer.map((value, rowIndex) => value - lr * biasGradients[layerIndex][rowIndex]),
    ),
  };
}

/** Build the full deterministic trace: one epoch per gradient update. */
export function buildTrace(scenario: NeuralNetScenario): NeuralNetTrace {
  let weights = scenario.weights;
  let biases = scenario.biases;
  const epochs: EpochTrace[] = [];

  for (let epoch = 0; epoch < scenario.epochs; epoch += 1) {
    const { activations, probabilities } = forwardPass(scenario, weights, biases);
    epochs.push({ activations, probabilities, loss: crossEntropyLoss(probabilities, scenario.targetIndex) });
    if (epoch < scenario.epochs - 1) {
      const { weightGradients, biasGradients } = backwardPass(scenario, weights, activations);
      const updated = updateWeights(scenario, weights, biases, weightGradients, biasGradients);
      weights = updated.weights;
      biases = updated.biases;
    }
  }

  return { epochs, losses: epochs.map((epoch) => epoch.loss) };
}

export const illustrativeTrace: NeuralNetTrace = buildTrace(illustrativeScenario);

/* ------------------------------------------------------------------ */
/* Per-effect animation timelines (pure data).                         */
/* ------------------------------------------------------------------ */

export interface NeuralNetPhase {
  id: string;
  label: string;
  detail: string;
}

const inferencePhases: readonly NeuralNetPhase[] = [
  { id: "input", label: "Input", detail: "The input values light the first layer." },
  { id: "h1", label: "Hidden 1", detail: "Activations propagate through the first hidden layer." },
  { id: "h2", label: "Hidden 2", detail: "The second hidden layer transforms the signal." },
  { id: "output", label: "Output", detail: "The output layer scores every candidate token." },
  { id: "select", label: "Selection", detail: "The highest-scoring token is selected." },
];

const feedForwardPhases: readonly NeuralNetPhase[] = [
  { id: "input", label: "Input", detail: "Each input node supplies one value." },
  { id: "h1", label: "Hidden 1 · compute", detail: "Weighted sums pass through the activation, node by node." },
  { id: "h2", label: "Hidden 2 · compute", detail: "The next layer recomputes every node from the previous one." },
  { id: "output", label: "Output · compute", detail: "Output scores are normalized into probabilities." },
];

const backpropPhases: readonly NeuralNetPhase[] = [
  { id: "forward", label: "Forward pass", detail: "The signal moves left to right and the model guesses." },
  { id: "loss", label: "Loss", detail: "The guess missed the target token, so loss is high." },
  { id: "backward-h2", label: "Backward · hidden 2", detail: "Gradients carry the error back through the last layer." },
  { id: "backward-h1", label: "Backward · hidden 1", detail: "The error continues through the first hidden layer." },
  { id: "update", label: "Update", detail: "Parameters adjust and the numbers inside the nodes change." },
];

export const neuralNetPhases: Record<NeuralNetEffect, readonly NeuralNetPhase[]> = {
  inference: inferencePhases,
  "feed-forward": feedForwardPhases,
  backprop: backpropPhases,
};

export function effectLabel(effect: NeuralNetEffect): string {
  switch (effect) {
    case "inference":
      return "Inference";
    case "feed-forward":
      return "Feed-forward";
    case "backprop":
      return "Training · backpropagation";
  }
}
