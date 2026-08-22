# Neural Net Visualization

## Purpose

`@th-m/neural-net-visualization` provides a reusable, non-interactive React
component that plays preset animated scenes on a small left-to-right neural
network: a forward inference pass with glowing nodes, a focused feed-forward
computation wave, and a training scene in which a bad guess produces a loss and
backpropagation visibly adjusts the numbers inside the nodes. It uses local
illustrative values, makes no live model calls, and never requires the reader
to operate controls.

## Ontology

The component separates the deterministic illustrative scenario, the pure
forward and training math, the per-effect animation timeline, and the SVG
rendering. A **neural-net figure** is one self-playing scene selected by an
`effect` prop; the reader watches it rather than stepping through it. Learned
parameters and temporary activations remain explicit semantic kinds, and all
values are seeded teaching traces rather than measurements of a real model.

## Key Terms

- **Effect:** one self-playing animation scene — `inference`, `feed-forward`,
  or `backprop` — selected through the component props.
- **Scenario:** the deterministic layer sizes, weights, biases, input, and
  target that define the illustrative network and its traces.
- **Teaching trace:** the fixed per-phase activation, probability, loss, and
  weight values the animation displays; no randomness or live computation is
  claimed.
- **Forward pass:** activation signal traveling left to right through the
  layers, ending at output probabilities.
- **Backward pass:** gradient signal traveling right to left during the
  `backprop` effect, followed by visible parameter adjustments.

## Public API

Import `NeuralNetAnimation` and the `neuralNetEffects` list from
`@th-m/neural-net-visualization`, plus the `NeuralNetEffect` and
`NeuralNetAnimationProps` types. Import `@th-m/neural-net-visualization/styles.css`
once in the web consumer after the THOM design-theme CSS.

```tsx
import { NeuralNetAnimation } from "@th-m/neural-net-visualization";

<NeuralNetAnimation effect="backprop" />
```

## Accessibility

The figure is decorative-by-default with a labeled summary; when the summary is
hidden the component still carries an `aria-label`. The active phase is
announced through an `aria-live` region so screen-reader users learn what the
animation is showing without needing controls. `prefers-reduced-motion`
collapses every scene to a static labeled frame (the system preference can be
overridden through the `reducedMotion` prop).
