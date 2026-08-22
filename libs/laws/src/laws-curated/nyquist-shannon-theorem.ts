import type { Law } from "../types";

export const nyquistShannonTheorem: Law = {
  slug: "nyquist-shannon-theorem",
  title: "Nyquist–Shannon Sampling Theorem",
  definition: "A continuous signal can be perfectly reconstructed from samples taken at more than twice its highest frequency — the Nyquist rate.",
  category: "theory",
  color: "#63b3ed",
  labels: ["information", "cs"],
  copy: [
    "The sampling theorem states that a band-limited signal contains no information beyond half the sampling rate; sample faster than that limit and the original is recoverable, sample slower and high frequencies alias into false low frequencies.",
    "The lesson generalizes beyond signals: measurement must match the rate of the phenomenon being observed, or the observer sees artifacts that were never there.",
  ],
  sources: ["https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem"],
  related: ["shannons-theorem"],
};
