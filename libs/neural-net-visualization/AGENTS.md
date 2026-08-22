# Neural Net Visualization Agent Contract

## Operational Flow

Keep the illustrative scenario and teaching traces in `model.ts`, the
per-effect phase timelines in pure data consumed by the component, and the SVG
scene in `NeuralNetAnimation.tsx`. Expose only the component, its props, and
the effect list through the package root.

## Required Verification Parameters Within Nested Context

Run `neural-net-visualization:typecheck` and
`neural-net-visualization:test`. Run every consumer app's `typecheck`, `test`,
and `publish` targets when changing runtime components, styles, or the package
contract.

## Required Invariants Within Folder Context

The component is a self-playing explanatory figure by default, with optional
reader-steppable controls: numbered step buttons for every operation, Prev and
Next stepping, and a Play/Pause toggle. Any control interaction pauses
autoplay so a single state can be inspected; the figure never exposes editing
or transport controls beyond this stepping. It never calls a live model or
service, never samples randomness, and displays only deterministic seeded
teaching traces. The `backprop` effect is the only scene that shows
training-only behavior, and it always labels loss, backward pass, and
parameter updates as training-only; `inference` and `feed-forward` never
include them. Learned parameters and temporary activations remain
distinguishable without color, and every scene collapses to a static labeled
frame under reduced motion, with manual stepping still available.
