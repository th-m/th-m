export interface NeuralNetAnimationCopy {
  eyebrow?: string;
  title: string;
  summary: string;
  disclaimer: string;
}

export type NeuralNetEdgeRoute = "between-nodes" | "outside-right";

export interface NeuralNetNodeDefinition {
  id: string;
  label: string;
  ariaLabel?: string;
  className?: string;
}

export interface NeuralNetLayerDefinition {
  id: string;
  label: string;
  nodes: readonly NeuralNetNodeDefinition[];
  className?: string;
}

export interface NeuralNetEdgeDefinition {
  id: string;
  from: string;
  to: string;
  label: string;
  ariaLabel?: string;
  route?: NeuralNetEdgeRoute;
  className?: string;
  visible?: boolean;
}

export interface NeuralNetValueBarGroupDefinition {
  id: string;
  nodeIds: readonly string[];
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export interface NeuralNetStepDefinition {
  id: string;
  label: string;
  detail: string;
}

export interface NeuralNetNodeValue {
  id: string;
  value: number;
}

export interface NeuralNetValueSnapshot {
  id: string;
  /** Exactly one value for every node in the scene. */
  nodeValues: readonly NeuralNetNodeValue[];
}

export interface NeuralNetNodeState {
  id: string;
  className?: string;
  valueBarClassName?: string;
  /** Optional frame-local text shown inside the node instead of its formatted snapshot value. */
  displayValue?: string;
  ariaLabel?: string;
}

export interface NeuralNetEdgeState {
  id: string;
  visible?: boolean;
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export interface NeuralNetReadout {
  id: string;
  text: string;
  className?: string;
}

export interface NeuralNetFrameDefinition {
  stepId: string;
  snapshotId: string;
  nodes?: readonly NeuralNetNodeState[];
  edges?: readonly NeuralNetEdgeState[];
  readouts?: readonly NeuralNetReadout[];
}

export interface NeuralNetIterationDefinition {
  id: string;
  label?: string;
  frames: readonly NeuralNetFrameDefinition[];
}

export interface NeuralNetScene {
  id: string;
  copy: NeuralNetAnimationCopy;
  layers: readonly NeuralNetLayerDefinition[];
  edges: readonly NeuralNetEdgeDefinition[];
  valueBarGroups?: readonly NeuralNetValueBarGroupDefinition[];
  steps: readonly NeuralNetStepDefinition[];
  snapshots: readonly NeuralNetValueSnapshot[];
  iterations: readonly NeuralNetIterationDefinition[];
  className?: string;
}

function assertNonEmpty(value: string, label: string): void {
  if (value.trim().length === 0) throw new Error(`${label} must not be empty.`);
}

function assertOptionalClassName(value: string | undefined, label: string): void {
  if (value !== undefined) assertNonEmpty(value, label);
}

function addUnique(ids: Set<string>, id: string, label: string): void {
  assertNonEmpty(id, `${label} id`);
  if (ids.has(id)) throw new Error(`Duplicate ${label} id: ${id}`);
  ids.add(id);
}

/** Validate a complete scene before it reaches the renderer. */
export function assertValidNeuralNetScene(scene: NeuralNetScene): void {
  assertNonEmpty(scene.id, "Scene id");
  assertOptionalClassName(scene.className, `Scene ${scene.id} className`);
  if (scene.copy.eyebrow !== undefined) {
    assertNonEmpty(scene.copy.eyebrow, `Scene ${scene.id} eyebrow`);
  }
  assertNonEmpty(scene.copy.title, `Scene ${scene.id} title`);
  assertNonEmpty(scene.copy.summary, `Scene ${scene.id} summary`);
  assertNonEmpty(scene.copy.disclaimer, `Scene ${scene.id} disclaimer`);
  if (scene.layers.length === 0) throw new Error(`Scene ${scene.id} must define at least one layer.`);
  if (scene.steps.length === 0) throw new Error(`Scene ${scene.id} must define at least one step.`);
  if (scene.snapshots.length === 0) throw new Error(`Scene ${scene.id} must define at least one snapshot.`);
  if (scene.iterations.length === 0) throw new Error(`Scene ${scene.id} must define at least one iteration.`);

  const layerIds = new Set<string>();
  const nodeIds = new Set<string>();
  for (const layer of scene.layers) {
    addUnique(layerIds, layer.id, "layer");
    assertNonEmpty(layer.label, `Layer ${layer.id} label`);
    assertOptionalClassName(layer.className, `Layer ${layer.id} className`);
    if (layer.nodes.length === 0) throw new Error(`Layer ${layer.id} must define at least one node.`);
    for (const node of layer.nodes) {
      addUnique(nodeIds, node.id, "node");
      assertNonEmpty(node.label, `Node ${node.id} label`);
      if (node.ariaLabel !== undefined) assertNonEmpty(node.ariaLabel, `Node ${node.id} ariaLabel`);
      assertOptionalClassName(node.className, `Node ${node.id} className`);
    }
  }

  const edgeIds = new Set<string>();
  for (const edge of scene.edges) {
    addUnique(edgeIds, edge.id, "edge");
    assertNonEmpty(edge.label, `Edge ${edge.id} label`);
    if (!nodeIds.has(edge.from)) throw new Error(`Edge ${edge.id} references unknown source node: ${edge.from}`);
    if (!nodeIds.has(edge.to)) throw new Error(`Edge ${edge.id} references unknown target node: ${edge.to}`);
    if (edge.ariaLabel !== undefined) assertNonEmpty(edge.ariaLabel, `Edge ${edge.id} ariaLabel`);
    assertOptionalClassName(edge.className, `Edge ${edge.id} className`);
  }

  const valueBarGroupIds = new Set<string>();
  for (const group of scene.valueBarGroups ?? []) {
    addUnique(valueBarGroupIds, group.id, "value-bar group");
    if (group.nodeIds.length === 0) throw new Error(`Value-bar group ${group.id} must reference at least one node.`);
    const groupNodeIds = new Set<string>();
    for (const nodeId of group.nodeIds) {
      if (!nodeIds.has(nodeId)) throw new Error(`Value-bar group ${group.id} references unknown node: ${nodeId}`);
      addUnique(groupNodeIds, nodeId, `node in value-bar group ${group.id}`);
    }
    if (group.label !== undefined) assertNonEmpty(group.label, `Value-bar group ${group.id} label`);
    if (group.ariaLabel !== undefined) assertNonEmpty(group.ariaLabel, `Value-bar group ${group.id} ariaLabel`);
    assertOptionalClassName(group.className, `Value-bar group ${group.id} className`);
  }

  const stepIds = new Set<string>();
  for (const step of scene.steps) {
    addUnique(stepIds, step.id, "step");
    assertNonEmpty(step.label, `Step ${step.id} label`);
    assertNonEmpty(step.detail, `Step ${step.id} detail`);
  }

  const snapshotIds = new Set<string>();
  for (const snapshot of scene.snapshots) {
    addUnique(snapshotIds, snapshot.id, "snapshot");
    const valueIds = new Set<string>();
    for (const nodeValue of snapshot.nodeValues) {
      if (!nodeIds.has(nodeValue.id)) throw new Error(`Snapshot ${snapshot.id} references unknown node: ${nodeValue.id}`);
      addUnique(valueIds, nodeValue.id, `node value in snapshot ${snapshot.id}`);
      if (!Number.isFinite(nodeValue.value)) {
        throw new Error(`Snapshot ${snapshot.id} value for ${nodeValue.id} must be finite.`);
      }
    }
    const missing = [...nodeIds].filter((nodeId) => !valueIds.has(nodeId));
    if (missing.length > 0) throw new Error(`Snapshot ${snapshot.id} is missing node values: ${missing.join(", ")}`);
  }

  const iterationIds = new Set<string>();
  const readoutIds = new Set<string>();
  for (const iteration of scene.iterations) {
    addUnique(iterationIds, iteration.id, "iteration");
    if (iteration.label !== undefined) assertNonEmpty(iteration.label, `Iteration ${iteration.id} label`);
    const frameStepIds = new Set<string>();
    for (const frame of iteration.frames) {
      if (!stepIds.has(frame.stepId)) {
        throw new Error(`Iteration ${iteration.id} references unknown step: ${frame.stepId}`);
      }
      addUnique(frameStepIds, frame.stepId, `frame step in iteration ${iteration.id}`);
      if (!snapshotIds.has(frame.snapshotId)) {
        throw new Error(`Frame ${iteration.id}/${frame.stepId} references unknown snapshot: ${frame.snapshotId}`);
      }
      const frameNodeIds = new Set<string>();
      for (const node of frame.nodes ?? []) {
        if (!nodeIds.has(node.id)) throw new Error(`Frame ${iteration.id}/${frame.stepId} references unknown node: ${node.id}`);
        addUnique(frameNodeIds, node.id, `node state in frame ${iteration.id}/${frame.stepId}`);
        assertOptionalClassName(node.className, `Node state ${node.id} className`);
        assertOptionalClassName(node.valueBarClassName, `Node state ${node.id} valueBarClassName`);
        if (node.displayValue !== undefined) {
          assertNonEmpty(node.displayValue, `Node state ${node.id} displayValue`);
        }
        if (node.ariaLabel !== undefined) assertNonEmpty(node.ariaLabel, `Node state ${node.id} ariaLabel`);
      }
      const frameEdgeIds = new Set<string>();
      for (const edge of frame.edges ?? []) {
        if (!edgeIds.has(edge.id)) throw new Error(`Frame ${iteration.id}/${frame.stepId} references unknown edge: ${edge.id}`);
        addUnique(frameEdgeIds, edge.id, `edge state in frame ${iteration.id}/${frame.stepId}`);
        if (edge.label !== undefined) assertNonEmpty(edge.label, `Edge state ${edge.id} label`);
        if (edge.ariaLabel !== undefined) assertNonEmpty(edge.ariaLabel, `Edge state ${edge.id} ariaLabel`);
        assertOptionalClassName(edge.className, `Edge state ${edge.id} className`);
      }
      for (const readout of frame.readouts ?? []) {
        addUnique(readoutIds, readout.id, "readout");
        assertNonEmpty(readout.text, `Readout ${readout.id} text`);
        assertOptionalClassName(readout.className, `Readout ${readout.id} className`);
      }
    }
    const missingSteps = [...stepIds].filter((stepId) => !frameStepIds.has(stepId));
    if (missingSteps.length > 0) {
      throw new Error(`Iteration ${iteration.id} is missing frames for steps: ${missingSteps.join(", ")}`);
    }
  }
}

export function defineNeuralNetScene<const TScene extends NeuralNetScene>(scene: TScene): TScene {
  assertValidNeuralNetScene(scene);
  return scene;
}
