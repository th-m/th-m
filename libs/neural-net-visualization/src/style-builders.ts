export type NeuralNetTone = "muted" | "primary" | "accent" | "danger";
export type NeuralNetEmphasis = "normal" | "strong";
export type NeuralNetNodeValueTone = "muted" | "strong" | "tone";

export interface NeuralNetNodeStyleOptions {
  tone?: NeuralNetTone;
  emphasis?: NeuralNetEmphasis;
  ring?: "none" | "solid" | "dashed";
  valueTone?: NeuralNetNodeValueTone;
  motion?: "none" | "pulse" | "swap";
}

export interface NeuralNetEdgeStyleOptions {
  tone?: NeuralNetTone;
  emphasis?: NeuralNetEmphasis;
  pattern?: "solid" | "dashed";
  motion?: "none" | "pulse" | "flow";
  direction?: "start-to-end" | "end-to-start";
}

export interface NeuralNetValueBarStyleOptions {
  tone?: NeuralNetTone;
  emphasis?: NeuralNetEmphasis;
  outline?: "solid" | "dashed";
  motion?: "none" | "pulse";
}

export function neuralNetNodeStyle(options: NeuralNetNodeStyleOptions = {}): string {
  const {
    tone = "muted",
    emphasis = "normal",
    ring = "none",
    valueTone = "muted",
    motion = "none",
  } = options;
  return [
    `nnl-node-tone-${tone}`,
    `nnl-node-emphasis-${emphasis}`,
    `nnl-node-ring-${ring}`,
    `nnl-node-value-${valueTone}`,
    `nnl-node-motion-${motion}`,
  ].join(" ");
}

export function neuralNetEdgeStyle(options: NeuralNetEdgeStyleOptions = {}): string {
  const {
    tone = "muted",
    emphasis = "normal",
    pattern = "solid",
    motion = "none",
    direction = "start-to-end",
  } = options;
  return [
    `nnl-edge-tone-${tone}`,
    `nnl-edge-emphasis-${emphasis}`,
    `nnl-edge-pattern-${pattern}`,
    `nnl-edge-motion-${motion}`,
    `nnl-edge-direction-${direction}`,
  ].join(" ");
}

export function neuralNetValueBarStyle(options: NeuralNetValueBarStyleOptions = {}): string {
  const {
    tone = "muted",
    emphasis = "normal",
    outline = "solid",
    motion = "none",
  } = options;
  return [
    `nnl-value-tone-${tone}`,
    `nnl-value-emphasis-${emphasis}`,
    `nnl-value-outline-${outline}`,
    `nnl-value-motion-${motion}`,
  ].join(" ");
}
