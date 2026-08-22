import type { Law } from "../types";

export const gigo: Law = {
  slug: "gigo",
  title: "Garbage In, Garbage Out",
  definition: "The quality of a system’s output is bounded by the quality of its input — bad data or bad prompts produce bad results, no matter how good the machinery.",
  category: "theory",
  color: "#c53030",
  labels: ["ai", "information", "software-engineering"],
  copy: [
    "The adage, long used in computing and data processing, states that flawed input guarantees flawed output regardless of the sophistication of the processing in between.",
    "For language models it is doubly true: the model inherits the biases and errors of its training corpus, and a single prompt selects the context that governs inference — underspecified input reliably produces generic, and sometimes wrong, output.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Garbage_in,_garbage_out"],
  related: ["goodharts-law"],
};
