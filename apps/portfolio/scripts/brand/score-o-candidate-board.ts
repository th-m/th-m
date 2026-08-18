import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const root = new URL("../../public/brand-audit/", import.meta.url);
const calibrationUrl = new URL("../../src/brand/thom/o-calibration.json", import.meta.url);
const metadata = await Bun.file(new URL("o-candidates.json", root)).json() as {
  columns: number;
  tileWidth: number;
  tileHeight: number;
  candidates: Array<{ removed: { a: number; b: number } | null; added: { a: number; b: number } | null; chords: Array<{ a: number; b: number }> }>;
};
const reference = PNG.sync.read(Buffer.from(await Bun.file(new URL("reference/o.png", root)).arrayBuffer()));
const board = PNG.sync.read(Buffer.from(await Bun.file(new URL("o-candidates.png", root)).arrayBuffer()));
const area = metadata.tileWidth * metadata.tileHeight;
let best = { index: -1, mismatch: Number.POSITIVE_INFINITY };

for (let candidateIndex = 0; candidateIndex < metadata.candidates.length; candidateIndex += 1) {
  const column = candidateIndex % metadata.columns;
  const row = Math.floor(candidateIndex / metadata.columns);
  const tile = new PNG({ width: metadata.tileWidth, height: metadata.tileHeight });
  PNG.bitblt(board, tile, column * metadata.tileWidth, row * metadata.tileHeight, metadata.tileWidth, metadata.tileHeight, 0, 0);
  const mismatch = pixelmatch(reference.data, tile.data, new Uint8Array(area * 4), metadata.tileWidth, metadata.tileHeight, {
    threshold: 0.1,
    includeAA: false,
  }) / area;
  if (mismatch < best.mismatch) best = { index: candidateIndex, mismatch };
}

const result = {
  currentMismatch: (() => {
    const tile = new PNG({ width: metadata.tileWidth, height: metadata.tileHeight });
    PNG.bitblt(board, tile, 0, 0, metadata.tileWidth, metadata.tileHeight, 0, 0);
    return pixelmatch(reference.data, tile.data, new Uint8Array(area * 4), metadata.tileWidth, metadata.tileHeight, { threshold: 0.1, includeAA: false }) / area;
  })(),
  bestMismatch: best.mismatch,
  best: metadata.candidates[best.index],
};
if (Bun.argv.includes("--apply") && result.bestMismatch < result.currentMismatch) {
  const calibration = await Bun.file(calibrationUrl).json();
  calibration.chords = result.best.chords;
  await Bun.write(calibrationUrl, `${JSON.stringify(calibration, null, 2)}\n`);
}
console.log(JSON.stringify(result, null, 2));
