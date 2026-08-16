import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const reviewDirectory = resolve(import.meta.dir);
const sourcePath = resolve(reviewDirectory, "14-alignment-mockup-perimeter-refined.svg");
const exportDirectory = resolve(reviewDirectory, "vector-exports");
const source = await readFile(sourcePath, "utf8");

const between = (startMarker: string, endMarker: string) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);

  if (start === -1 || end === -1) {
    throw new Error(`Could not find SVG content between ${startMarker} and ${endMarker}.`);
  }

  return source.slice(start + startMarker.length, end).trim();
};

// Pull the exact vector paths used by the current audit board. Only the board
// placement translations are removed; the character-specific geometry and
// visual scaling remain untouched.
const t = between("<!-- T: original Bézier trace, grouped as roof / left pillar / right pillar. -->", "<!-- H:")
  .replace('transform="translate(22 -.222) scale(.86 1.03)"', 'transform="translate(0 -.222) scale(.86 1.03)"');

const h = between("<!-- H: same construction span, subtly lighter pillars and reinforced crossbars. -->", "<!-- O:")
  .replace(/^<g transform="translate\(98\.975 0\)">/, "")
  .replace(/<\/g>$/, "");

const o = between("<!-- O: actual chord network, vertically enlarged only for this review mockup. -->", "<!-- M:")
  .replace('transform="translate(185.625 -8.4) scale(.88 1.14)"', 'transform="translate(0 -8.4) scale(.88 1.14)"');

const mStart = source.indexOf('<g transform="translate(274.6 -26.7) scale(1 1.49)">');
const labelsStart = source.indexOf('<g font-family="ui-monospace', mStart);

if (mStart === -1 || labelsStart === -1) {
  throw new Error("Could not find the M glyph or the end of the glyph layer.");
}

// The slice includes the M group's closing tag followed by the board's glyph
// layer closing tag. Keep the former and discard only the latter.
const m = source
  .slice(mStart, labelsStart)
  .replace(/<\/g>\s*<\/g>\s*$/, "</g>")
  .replace('transform="translate(274.6 -26.7) scale(1 1.49)"', 'transform="translate(0 -26.7) scale(1 1.49)"');

const makeSvg = (character: string, content: string) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" viewBox="0 0 100 120" data-audit-glyph="${character}">
  <g id="${character.toLowerCase()}-glyph" fill="#000000">
    ${content}
  </g>
</svg>
`;

const glyphs = [
  { character: "T", content: t },
  { character: "H", content: h },
  { character: "O", content: o },
  { character: "M", content: m },
];

await mkdir(exportDirectory, { recursive: true });

for (const { character, content } of glyphs) {
  const svg = makeSvg(character, content);
  // Parse before writing so every delivered file is an importable SVG.
  new Resvg(svg).render();
  await writeFile(resolve(exportDirectory, `${character}-current-audit.svg`), svg);
}

console.log(`Exported ${glyphs.length} editable glyph SVGs to ${exportDirectory}`);
