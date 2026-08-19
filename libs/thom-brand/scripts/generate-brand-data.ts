import { mkdir } from "node:fs/promises";
import { createBrandData } from "../src/geometry";

const outputDirectory = new URL("../src/generated/", import.meta.url);
await mkdir(outputDirectory, { recursive: true });
await Bun.write(
  new URL("brand-data.json", outputDirectory),
  `${JSON.stringify(createBrandData(), null, 2)}\n`,
);

console.log("Generated deterministic THOM runtime data.");
