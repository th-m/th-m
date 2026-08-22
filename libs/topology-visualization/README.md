# Topology Visualization

## Purpose

`@th-m/topology-visualization` owns the portable layered-system-topology
domain and its renderers: ordered layers, nodes assigned to layers, and
directed dependency links between nodes — the structural "how things connect"
content behind THOM's factory ontology and pipeline figures. The library is
the shared home for the `TopologyDocument` contract, deterministic layered
layout, the self-contained SVG renderer (content figure + 1600×1000 poster),
the seed topologies, and the reagraph interactive canvas used by the local
authoring tool.

## Ontology

A topology is a set of **layers** (ordered columns or rows), **nodes** that
belong to exactly one layer, and **links** that express directed dependencies
between nodes. A `TopologyDocument` is the portable source of truth; layout
positions and rendered artifacts are derived output. The library separates the
domain (types, model, seeds) from the deterministic layout, the SVG renderer,
and the React canvas. The `./core` export entry excludes React and reagraph so
Bun/Node CLI generators never load the WebGL runtime.

## Key Terms

- **Layer:** an ordered band in the topology; the horizontal axis of the
  system. Layers flow left-to-right (`lr`) or top-down (`td`).
- **Node:** a card in exactly one layer. Emphasis nodes are highlighted with
  the primary token.
- **Link:** a directed dependency from one node to another; dashed links
  express indirect dependencies, and links may carry a short label ("may
  depend on").
- **TopologyDocument:** the versioned JSON contract shared by the editor, the
  canvas, the SVG generator, and seeds.
- **TopologyCanvas:** the reagraph WebGL canvas — hierarchical layout matches
  the deterministic generator so the preview and the artifact agree.
- **Artifact pair:** `<output>.svg` and `<output>@2x.png`, produced by the
  `tools/topology` CLI from this library's renderer.

## Usage

Consumers import the package and its stylesheet once:

```ts
import { TopologyCanvas } from "@th-m/topology-visualization";
import "@th-m/topology-visualization/styles.css";
```

Browser consumers must provide the design theme tokens
(`@th-m/design-theme/theme.css`). CLI consumers import
`@th-m/topology-visualization/core` and use `layoutTopology` +
`createTopologySvg`.

## Verification

Run `topology-visualization:typecheck` and `topology-visualization:test`.
The library depends on the `testing` support library for the vitest setup.
