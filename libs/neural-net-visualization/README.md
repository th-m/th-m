# Neural Net Visualization

## Purpose

`@th-m/neural-net-visualization` provides a reusable React component that plays
preset animated scenes on a small left-to-right neural network: a forward
inference pass with glowing nodes, a focused feed-forward computation wave, and
a training scene in which a bad guess produces a loss and backpropagation
visibly adjusts the numbers inside the nodes. The figure is self-playing by
default, and the reader can pause it and step through the timeline — jumping to
any numbered step, or moving one step forward or backward — to inspect the
exact network state at each operation. It uses local illustrative values, makes
no live model calls, and displays only deterministic seeded teaching traces.

## Ontology

The component separates the deterministic illustrative scenario, the pure
forward and training math, the per-effect operation timeline, and the SVG
rendering. A **neural-net figure** is one scene selected by an `effect` prop;
each scene exposes one **step** per operation (for example, a forward pass
through hidden layer 1), shown as a numbered control the reader can activate.
Learned parameters and temporary activations remain explicit semantic kinds,
and all values are seeded teaching traces rather than measurements of a real
model.

## Key Terms

- **Effect:** one animation scene — `inference`, `feed-forward`, or `backprop`
  — selected through the component props.
- **Step:** one operation within a scene (input, a hidden-layer pass, output,
  loss, backward pass, update), reachable by number so the reader can inspect
  the network state at that exact point.
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

The figure plays automatically by default. Selecting a numbered step, pressing
Prev/Next, or toggling Play/Pause pauses autoplay so the reader can inspect a
single state; Play resumes the loop.

## Accessibility

The figure carries an `aria-label` naming the effect and a step bar of real
buttons, each labeled `Step N of M: <operation> — <detail>`, with the active
step marked via `aria-current`. The current operation is announced through an
`aria-live` region, and the Play/Pause control uses `aria-pressed`.
`prefers-reduced-motion` collapses every scene to a static labeled frame (the
system preference can be overridden through the `reducedMotion` prop); under
reduced motion the reader can still step through the static frames manually.
