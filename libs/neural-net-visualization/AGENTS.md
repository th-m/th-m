# Neural Net Visualization Agent Contract

## Operational Flow

Keep the declarative scene contract and validation in `src/scene.ts`, visual
class builders in `src/style-builders.ts`, generic rendering and interaction in
`src/NeuralNetAnimation.tsx`, and atomic implementation classes in
`src/styles.css`. Export the renderer, scene helper, builders, and their public
types through the package root. Define semantic labels, numerical data, and
local style aliases in the consuming article or feature.

## Required Verification Parameters Within Nested Context

Run `neural-net-visualization:typecheck` and
`neural-net-visualization:test`. Run every consumer app's `typecheck`, `test`,
and `publish` targets when changing runtime components, styles, or the package
contract.

## Required Invariants Within Folder Context

The library models generic ordered layers, nodes, geometric edges, value-bar
groups, snapshots, steps, frames, and iterations. It never owns article
semantics, preset animations, seeded training math, or visual flags named for a
domain concept. Every snapshot contains exactly one finite value per node, and
every iteration contains exactly one independently resolved frame per step.
Style builders remain deterministic and domain-neutral. Manual navigation,
autoplay, accessible labels, data identifiers, and the final-frame reduced
motion behavior remain covered by tests.
