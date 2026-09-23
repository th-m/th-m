/**
 * The six-essay AI Factory bundle. Three foundations converge on the Knowledge
 * Factory, which branches into the Ontology and Cognitive Factory essays.
 * Positions live in fixed desktop and mobile view boxes that the shared graph
 * scales responsively.
 */

export type BundleNodeKind = "fundamental" | "hub" | "branch";

export interface BundleNode {
  slug: string;
  title: string;
  kind: BundleNodeKind;
  order: string;
  summary: string;
  /** Top-left position and size in the 960x600 desktop view box. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BundleEdge {
  from: string;
  to: string;
}

export const BUNDLE_VIEWBOX = { width: 960, height: 600 } as const;
export const MOBILE_BUNDLE_VIEWBOX = { width: 360, height: 560 } as const;

export const articleBundleNodes: BundleNode[] = [
  {
    slug: "vision-and-values",
    title: "Vision and Values",
    kind: "fundamental",
    order: "01",
    summary: "Human values decide which goals deserve pursuit.",
    x: 30,
    y: 20,
    width: 250,
    height: 125,
  },
  {
    slug: "truth-and-inference",
    title: "Truth and Inference",
    kind: "fundamental",
    order: "02",
    summary: "Reliable inference begins where language carries constraints.",
    x: 355,
    y: 20,
    width: 250,
    height: 125,
  },
  {
    slug: "understanding-and-bottlenecks",
    title: "Understanding and Bottlenecks",
    kind: "fundamental",
    order: "03",
    summary: "Complete learning loops move understanding into bounded teams.",
    x: 680,
    y: 20,
    width: 250,
    height: 125,
  },
  {
    slug: "the-knowledge-factory",
    title: "The Knowledge Factory",
    kind: "hub",
    order: "04",
    summary: "Triggers, agent workflows, and feedback turn intent into verified outcomes.",
    x: 330,
    y: 230,
    width: 300,
    height: 145,
  },
  {
    slug: "the-ontology-factory",
    title: "The Ontology Factory",
    kind: "branch",
    order: "05",
    summary: "Repository structure makes ownership and dependencies visible.",
    x: 110,
    y: 465,
    width: 240,
    height: 115,
  },
  {
    slug: "the-cognitive-factory",
    title: "Cognitive Factory",
    kind: "branch",
    order: "06",
    summary: "Signals and discoverable memory expand what the factory can understand.",
    x: 610,
    y: 465,
    width: 240,
    height: 115,
  },
];

/** Compact topology used at the portfolio's existing 680px breakpoint. */
export const articleBundleMobileNodes: BundleNode[] = [
  { ...articleBundleNodes[0]!, x: 0, y: 10, width: 112, height: 110 },
  { ...articleBundleNodes[1]!, x: 124, y: 10, width: 112, height: 110 },
  { ...articleBundleNodes[2]!, x: 248, y: 10, width: 112, height: 110 },
  { ...articleBundleNodes[3]!, x: 75, y: 225, width: 210, height: 110 },
  { ...articleBundleNodes[4]!, x: 15, y: 440, width: 150, height: 100 },
  { ...articleBundleNodes[5]!, x: 195, y: 440, width: 150, height: 100 },
];

export const articleBundleEdges: BundleEdge[] = [
  { from: "vision-and-values", to: "the-knowledge-factory" },
  { from: "truth-and-inference", to: "the-knowledge-factory" },
  { from: "understanding-and-bottlenecks", to: "the-knowledge-factory" },
  { from: "the-knowledge-factory", to: "the-ontology-factory" },
  { from: "the-knowledge-factory", to: "the-cognitive-factory" },
];

export function bundleNodeCenter(node: BundleNode): { x: number; y: number } {
  return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
}
