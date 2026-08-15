import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { brandData } from "../../../../src/brand/thom/brandData";
import { renderGlyphContent } from "../../../../src/brand/thom/svg";

const output = resolve(import.meta.dir);
// This is the audit's sole coordinate system. Source-path units are converted
// through the glyph transforms before being recorded as master measurements.
const MASTER_VIEWBOX = { width: 460, height: 152, capLine: 15, baseline: 104 };
const MASTER_CAP_HEIGHT = MASTER_VIEWBOX.baseline - MASTER_VIEWBOX.capLine;
const MASTER_EXPORT_SCALE = 2300 / MASTER_VIEWBOX.width;
const cap = 15;
const midline = 60;
const baseline = 104;
const overflowBottom = 112;

const guides = [
  { y: cap, label: "CAP LINE" },
  { y: midline, label: "CONSTRUCTION LINE" },
  { y: baseline, label: "BASELINE" },
  { y: overflowBottom, label: "OVERFLOW LIMIT" },
];

const frames = [
  { label: "T", left: 20, right: 106 },
  { label: "H", left: 114, right: 183 },
  { label: "O", left: 191, right: 268 },
  { label: "M", left: 275, right: 396 },
];

const O_PERIMETER_MULTIPLIER = 6.5;
const H_PILLAR_SCALE = 0.74;
// T: three true editable contours. Each has an outer and an inner Bézier edge;
// width can be altered locally by changing its own centered X scale.
const T_ROOF_SCALE_Y = 1;
const T_LEFT_PILLAR_SCALE_X = 1;
const T_RIGHT_PILLAR_SCALE_X = 1;
const tracedTGroups = `
  <g transform="translate(22 -.222) scale(.86 1.03)">
    <!-- Top: outer sweep and lower return are the two crisp Bézier edges. -->
    <g data-t-segment="top-bar" transform="translate(0 7.5) scale(1 ${T_ROOF_SCALE_Y}) translate(0 -7.5)">
      <path d="M2 37.075 C5 25.245 16 13.415 29 13.415 C48 13.415 71 13.87 91 12.96 C95 12.687 97 9.775 97.5 7.5 L99 7.5 C98.5 17.055 94 22.515 86 22.97 L67 22.97 L58.3 22.97 L45 22.97 L34 22.97 C18 22.97 8 28.885 3 38.895 Z"/>
    </g>
    <!-- Left pillar: outer edge (cap → terminal) and inner edge (terminal → cap). -->
    <g data-t-segment="left-pillar" transform="translate(27.75 0) scale(${T_LEFT_PILLAR_SCALE_X} 1) translate(-27.75 0)">
      <path d="M34 22.97 C33 30.705 31 42.535 29 55.275 C26.5 70.745 21.5 85.305 10.5 98.955 C13.5 100.32 18.5 101.23 23 98.955 C31.5 93.95 36.7 83.03 39.5 66.195 C42.3 50.725 44 34.345 45 22.97 Z"/>
    </g>
    <!-- Right pillar: inner edge (cap → terminal) and outer edge (terminal → cap). -->
    <g data-t-segment="right-pillar" transform="translate(70.1 0) scale(${T_RIGHT_PILLAR_SCALE_X} 1) translate(-70.1 0)">
      <path d="M58.3 22.97 C56 37.075 53 56.185 51.7 73.475 C50.5 88.49 53.5 97.135 67 99.41 C77 101.23 86 92.585 90.5 75.295 L88 75.295 C84 84.395 77.5 91.22 71 88.945 C63.3 86.215 60.8 75.295 62 58.915 C63 45.265 65 32.525 67 22.97 Z"/>
    </g>
  </g>
`;
const rawO = renderGlyphContent(brandData, "o", "monochrome");
const rawOPerimeter = Number(rawO.match(/stroke-width="([^"]+)"/)?.[1]);
const oWithHeavierPerimeter = rawO.replace(
  /stroke-width="([^"]+)"/,
  // A perceptual match at display size: heavier than the original rim without
  // becoming as dark as the filled H pillars; internal chords remain light.
  (_match, width) => `stroke-width="${(Number(width) * O_PERIMETER_MULTIPLIER).toFixed(3)}"`,
);

const hWithBalancedStrokes = renderGlyphContent(brandData, "h", "monochrome")
  .replace(
    /(<polyline[^>]*stroke-width=")(.*?)("[^>]*data-h-part="(?:a|b)"[^>]*>)/g,
    (_match, before, width, after) => `${before}${(Number(width) * 1.45).toFixed(3)}${after}`,
  )
  // Restore the previous pillar weight, then close the pillar centers by six units.
  .replace(/(<path d="M17\.2[^>]*\/>)/, '<g transform="translate(9.5 0) scale(.74 1)">$1</g>')
  .replace(/(<path d="M67\.2[^>]*\/>)/, '<g transform="translate(16.5 0) scale(.74 1)">$1</g>')
  // O is rendered at .88 × 1.14 in this board. Match that displayed node ellipse.
  .replace(
    /<circle cx="55\.375" cy="60\.000" r="[^"]+" fill="#000000" opacity="0\.78" data-h-part="ratio-point"\/>/,
    '<ellipse cx="55.375" cy="60.000" rx="0.748" ry="0.969" fill="#000000" opacity="0.78" data-h-part="ratio-point"/>',
  );

const rawM = renderGlyphContent(brandData, "m", "monochrome");
// Keep the existing dominant strand, then add only fine Fourier layers at
// shallow phase offsets. This adds body through density, never line thickness.
const mFineStrands = rawM.replace(/<path\b(?=[^>]*stroke-width="(?:0\.472|0\.32)")[^>]*\/>/g, "");
const mTextured = `${rawM}${[-2.4, -1.2, 1.2, 2.4]
  .map((offset) => `<g transform="translate(0 ${offset})" opacity=".4">${mFineStrands}</g>`)
  .join("")}`;

const glyphs = `
  <!-- T: original Bézier trace, grouped as roof / left pillar / right pillar. -->
  ${tracedTGroups}
  <!-- H: same construction span, subtly lighter pillars and reinforced crossbars. -->
  <g transform="translate(98.975 0)">${hWithBalancedStrokes}</g>
  <!-- O: actual chord network, vertically enlarged only for this review mockup. -->
  <g transform="translate(185.625 -8.4) scale(.88 1.14)">${oWithHeavierPerimeter}</g>
  <!-- M: actual layered Fourier construction, vertically enlarged only for this review mockup. -->
  <g transform="translate(274.6 -26.7) scale(1 1.49)">${mTextured}</g>
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2300" height="760" viewBox="0 0 460 152">
  <rect width="460" height="152" fill="#c5b6f4"/>
  <rect x="12" y="0" width="436" height="${cap}" fill="#f8df9e" opacity=".34"/>
  <rect x="12" y="${baseline}" width="436" height="${overflowBottom - baseline}" fill="#f8df9e" opacity=".34"/>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="5.4" fill="#17131b" letter-spacing=".6">
    ${guides.map(({ y, label }) => `<text x="4" y="${y + 1.8}">${label}</text><line x1="42" y1="${y}" x2="448" y2="${y}" stroke="#17131b" stroke-width=".85"/>`).join("")}
  </g>
  <g fill="none" stroke="#17131b" stroke-width=".7" stroke-dasharray="3 4" opacity=".8">
    ${frames.flatMap(({ left, right }) => [`<line x1="${left}" y1="${cap}" x2="${left}" y2="${baseline}"/>`, `<line x1="${right}" y1="${cap}" x2="${right}" y2="${baseline}"/>`]).join("")}
  </g>
  <g fill="#17131b" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="5.4" letter-spacing="1.1">
    ${frames.map(({ label, left, right }) => `<text x="${(left + right) / 2}" y="145" text-anchor="middle">${label}</text>`).join("")}
  </g>
  <g fill="#17131b" opacity=".26"><rect x="12" y="${cap - 1}" width="436" height="2"/><rect x="12" y="${baseline - 1}" width="436" height="2"/></g>
  <g fill="#000000">${glyphs}</g>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="4.5" fill="#17131b">
    <text x="48" y="10">T TOP · HALF-CAP OVERFLOW</text>
    <text x="210" y="10">O ROUND OVERSHOOT</text>
    <text x="285" y="121">M PEAKS AND VALLEY ALIGN TO CAP / BASELINE</text>
  </g>
</svg>`;

const master = (value: number) => Number(value.toFixed(4));
const capNormalized = (value: number) => Number(((value / MASTER_CAP_HEIGHT) * 100).toFixed(4));
const masterMetrics = {
  masterViewBox: MASTER_VIEWBOX,
  capHeightMasterUnits: MASTER_CAP_HEIGHT,
  exportPixelsPerMasterUnit: MASTER_EXPORT_SCALE,
  transforms: {
    t: { coordinateSpace: "master", source: "original-bezier-trace", groups: ["roof", "left-pillar", "right-pillar"], scale: [0.86, 1.03] },
    h: { translate: [98.975, 0], pillarCenters: [28, 72], pillarScaleX: H_PILLAR_SCALE },
    o: { translate: [185.625, -8.4], scale: [0.88, 1.14] },
    m: { translate: [274.6, -26.7], scale: [1, 1.49] },
  },
  measurements: {
    hPillarWidth: {
      masterUnits: master((32.8 - 17.2) * H_PILLAR_SCALE),
      capHeightPercent: capNormalized((32.8 - 17.2) * H_PILLAR_SCALE),
    },
    oCircumference: {
      sideMasterUnits: master(rawOPerimeter * O_PERIMETER_MULTIPLIER * 0.88),
      capBaselineMasterUnits: master(rawOPerimeter * O_PERIMETER_MULTIPLIER * 1.14),
      sideCapHeightPercent: capNormalized(rawOPerimeter * O_PERIMETER_MULTIPLIER * 0.88),
      capBaselineCapHeightPercent: capNormalized(rawOPerimeter * O_PERIMETER_MULTIPLIER * 1.14),
    },
    sharedIntersectionDot: {
      diameterMasterUnits: [1.496, 1.938],
      diameterCapHeightPercent: [capNormalized(1.496), capNormalized(1.938)],
    },
    mTexture: {
      addedFineStrandCopies: 4,
      localOffsets: [-2.4, -1.2, 1.2, 2.4],
      addedStrandOpacity: 0.4,
      lineWidthsUnchanged: true,
    },
  },
};

const svgPath = resolve(output, "14-alignment-mockup-perimeter-refined.svg");
const pngPath = resolve(output, "14-alignment-mockup-perimeter-refined.png");
const metricsPath = resolve(output, "14-alignment-mockup-master-metrics.json");
await Bun.write(svgPath, `${svg}\n`);
await Bun.write(pngPath, new Resvg(svg, { fitTo: { mode: "width", value: 2300 } }).render().asPng());
await Bun.write(metricsPath, `${JSON.stringify(masterMetrics, null, 2)}\n`);
