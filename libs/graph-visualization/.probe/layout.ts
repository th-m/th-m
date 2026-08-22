import Graph from "/Users/thom/Sites/th-m/th-m/node_modules/.bun/reagraph@4.32.0+83823b6e86569096/node_modules/graphology/dist/graphology.esm.js";
import { buildGraph, layoutProvider } from "reagraph";
import { graphToReagraph } from "../src/canvas";

const constraintGraphDocument = {
  schemaVersion: 1, id: "truth-entropy-constraints", name: "How language carries constraints",
  createdAt: "2026-08-22T00:00:00.000Z", updatedAt: "2026-08-22T00:00:00.000Z",
  themeId: "thom-dark", layoutMode: "editorial",
  propositions: [
    { id: "prompt-hash", statement: "Prompt: Implement hash-based sorting for these bounded integer keys.", emphasis: true, pinned: false },
    { id: "prompt-organize", statement: "Prompt: Organize this list really fast.", emphasis: false, pinned: false },
    { id: "patterns", statement: "Technical language activates named patterns and assumptions", emphasis: true, pinned: false },
    { id: "feedback", statement: "Feedback systems reject invalid expressions", emphasis: true, pinned: false },
    { id: "code", statement: "Parsers, types, tests, runtimes, and consequences filter candidate continuations", emphasis: false, pinned: false },
    { id: "coherence", statement: "Coherence is evidence about a pattern, not the world", emphasis: true, pinned: false },
  ],
  relationships: [
    { id: "activates", statement: "activates a region of precise language", participants: [{ nodeId: "prompt-hash", arrowAtNode: false, arrowAtRelation: false }, { nodeId: "patterns", arrowAtNode: true, arrowAtRelation: false }], pinned: false },
    { id: "guesses", statement: "leaves the ordering rule and costs unspecified — the model guesses", participants: [{ nodeId: "prompt-organize", arrowAtNode: false, arrowAtRelation: false }, { nodeId: "coherence", arrowAtNode: true, arrowAtRelation: false }], pinned: false },
    { id: "shapes", statement: "rewards stable distinctions and rejects noise", participants: [{ nodeId: "feedback", arrowAtNode: false, arrowAtRelation: false }, { nodeId: "patterns", arrowAtNode: true, arrowAtRelation: false }], pinned: false },
    { id: "corpora", statement: "produces pattern-dense corpora a model can learn", participants: [{ nodeId: "feedback", arrowAtNode: false, arrowAtRelation: false }, { nodeId: "code", arrowAtNode: true, arrowAtRelation: false }], pinned: false },
    { id: "checks", statement: "lets patterns be checked against executable behavior", participants: [{ nodeId: "code", arrowAtNode: false, arrowAtRelation: false }, { nodeId: "coherence", arrowAtNode: true, arrowAtRelation: false }], pinned: false },
    { id: "selects", statement: "constrains which continuations are plausible", participants: [{ nodeId: "patterns", arrowAtNode: false, arrowAtRelation: false }, { nodeId: "coherence", arrowAtNode: true, arrowAtRelation: false }], pinned: false },
  ],
  poster: {},
};

function measure(nodes: { id: string; x: number; y: number }[]) {
  let min = Infinity, minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    minX = Math.min(minX, a.x); maxX = Math.max(maxX, a.x);
    minY = Math.min(minY, a.y); maxY = Math.max(maxY, a.y);
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      min = Math.min(min, Math.hypot(a.x - b.x, a.y - b.y));
    }
  }
  return { minDist: Math.round(min), width: Math.round(maxX - minX), height: Math.round(maxY - minY) };
}

function run(link: number, label: string) {
  const { nodes, edges } = graphToReagraph(constraintGraphDocument as never);
  const graph = new Graph({ multi: true });
  buildGraph(graph, nodes, edges);
  const strat = layoutProvider({ type: "forceDirected2d", graph, linkDistance: link, nodeStrength: -(link * 4) });
  strat.step();
  const positions = nodes.map((n) => { const p = strat.getNodePosition(n.id); return { id: n.id, x: p.x, y: p.y }; });
  const m = measure(positions);
  // Simulate the figure's auto-fit into a ~680x480 canvas: scale = min(1, 680/w, 480/h)
  const scale = Math.min(1, 680 / m.width, 480 / m.height);
  console.log(`${label}  link=${link} strength=${-(link*4)} -> ${JSON.stringify(m)}  onScreenMinDist≈${Math.round(m.minDist * scale)}px @680x480`);
}

run(340, "compact");
run(560, "comfortable");
run(700, "wide");
