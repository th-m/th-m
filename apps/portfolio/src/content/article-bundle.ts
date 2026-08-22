/**
 * The essay-bundle graph shown on the home page: the three fundamental essays
 * converge on the Knowledge Factory, which branches into the Ontology and
 * Cognitive Factory essays. Positions live in a fixed 960x660 viewBox that the
 * ArticleBundleGraph component scales responsively.
 */

export type BundleNodeKind = "fundamental" | "hub" | "branch";

export interface BundleNode {
  slug: string;
  kind: BundleNodeKind;
  /** Top-left position and size in the 960x660 viewBox. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BundleEdge {
  from: string;
  to: string;
}

export const BUNDLE_VIEWBOX = { width: 960, height: 660 } as const;
export const MOBILE_BUNDLE_VIEWBOX = { width: 360, height: 560 } as const;

export const articleBundleNodes: BundleNode[] = [
  // Top row: the three fundamental essays.
  { slug: "goals-solutions-and-value", kind: "fundamental", x: 30, y: 20, width: 250, height: 130 },
  { slug: "truth-entropy-and-inference", kind: "fundamental", x: 355, y: 20, width: 250, height: 130 },
  { slug: "understanding-is-the-bottleneck", kind: "fundamental", x: 680, y: 20, width: 250, height: 130 },
  // Hub: the knowledge factory.
  { slug: "the-knowledge-factory", kind: "hub", x: 330, y: 270, width: 300, height: 150 },
  // Bottom row: the factory branches.
  { slug: "the-factory-ontology", kind: "branch", x: 110, y: 520, width: 240, height: 120 },
  { slug: "the-cognitive-factory", kind: "branch", x: 610, y: 520, width: 240, height: 120 },
];

/** Compact topology used at the portfolio's existing 680px breakpoint. */
export const articleBundleMobileNodes: BundleNode[] = [
  { slug: "goals-solutions-and-value", kind: "fundamental", x: 0, y: 10, width: 112, height: 110 },
  { slug: "truth-entropy-and-inference", kind: "fundamental", x: 124, y: 10, width: 112, height: 110 },
  { slug: "understanding-is-the-bottleneck", kind: "fundamental", x: 248, y: 10, width: 112, height: 110 },
  { slug: "the-knowledge-factory", kind: "hub", x: 75, y: 225, width: 210, height: 110 },
  { slug: "the-factory-ontology", kind: "branch", x: 15, y: 440, width: 150, height: 100 },
  { slug: "the-cognitive-factory", kind: "branch", x: 195, y: 440, width: 150, height: 100 },
];

export const articleBundleEdges: BundleEdge[] = [
  { from: "goals-solutions-and-value", to: "the-knowledge-factory" },
  { from: "truth-entropy-and-inference", to: "the-knowledge-factory" },
  { from: "understanding-is-the-bottleneck", to: "the-knowledge-factory" },
  { from: "the-knowledge-factory", to: "the-factory-ontology" },
  { from: "the-knowledge-factory", to: "the-cognitive-factory" },
];

export function bundleNodeCenter(node: BundleNode): { x: number; y: number } {
  return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
}
