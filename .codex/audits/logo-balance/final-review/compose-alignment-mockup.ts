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
  { label: "H", left: 113.5, right: 182.5 },
  { label: "O", left: 187.875, right: 264.875 },
  { label: "M", left: 275, right: 396 },
];

const O_PERIMETER_WIDTH = 2.613;
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
      <path d="M2 30.2 C5 21 16 13.415 29 13.415 C48 13.415 71 13.87 91 12.96 C95 12.687 97 10.1 97.5 8.25 L99 8.25 C98.5 13.3 94 18.05 86 18.63 L64.51 18.63 L60.79 18.63 L41.36 18.63 L37.64 18.63 C18 18.63 8 21 3 29.8 Z"/>
    </g>
    <!-- Left pillar: outer edge (cap → terminal) and inner edge (terminal → cap). -->
    <g data-t-segment="left-pillar" transform="translate(27.75 0) scale(${T_LEFT_PILLAR_SCALE_X} 1) translate(-27.75 0)">
      <path d="M37.64 18.63 C36.99 27 35.07 42.535 33.37 55.275 C30.57 70.745 24.44 86.22 10.5 101.1864 L20.6 101.1864 C26.8 94.65 30.33 83.03 35.13 66.195 C37.93 50.725 40.28 30 41.36 18.63 Z"/>
    </g>
    <!-- Right pillar: inner edge (cap → terminal) and outer edge (terminal → cap). -->
    <g data-t-segment="right-pillar" transform="translate(70.1 0) scale(${T_RIGHT_PILLAR_SCALE_X} 1) translate(-70.1 0)">
      <!-- The supplied grey contour is registered directly onto the current right
           pillar at its two top intersections. Its two Bézier arcs replace the lower
           pillar; the outer handle is extended only enough to keep the base on line. -->
      <path d="M60.79 18.63 C60.18283713 26.44838958 58.46755266 40.51850456 56.85854676 52.72260962 C41.30673423 138.79746558 86.80571662 83.98950826 86.80571662 83.98950826 C46.75198157 120.82021715 60.45031492 52.68602707 60.45031492 52.68602707 C62.26545535 40.13351436 63.72403346 26.90448112 64.51 18.63 Z"/>
    </g>
  </g>
`;
const rawO = renderGlyphContent(brandData, "o", "monochrome");
// The production render now contains the approved perimeter, narrowed H
// pillars, proportion construction, and M texture directly. Keep the audit
// compositor as a placement board instead of applying those refinements twice.
const hWithBalancedStrokes = renderGlyphContent(brandData, "h", "monochrome");
const mTextured = renderGlyphContent(brandData, "m", "monochrome");

const glyphs = `
  <!-- T: original Bézier trace, grouped as roof / left pillar / right pillar. -->
  ${tracedTGroups}
  <!-- H: same construction span, subtly lighter pillars and reinforced crossbars. -->
  <g transform="translate(98.475 0)">${hWithBalancedStrokes}</g>
  <!-- O: actual chord network, vertically enlarged only for this review mockup. -->
  <g transform="translate(182.5 -8.4) scale(.88 1.14)">${rawO}</g>
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
    h: { translate: [98.475, 0], pillarCenters: [28, 72], pillarScaleX: H_PILLAR_SCALE },
    o: { translate: [182.5, -8.4], scale: [0.88, 1.14] },
    m: { translate: [274.6, -26.7], scale: [1, 1.49] },
  },
  measurements: {
    hPillarWidth: {
      masterUnits: master((32.8 - 17.2) * H_PILLAR_SCALE),
      capHeightPercent: capNormalized((32.8 - 17.2) * H_PILLAR_SCALE),
    },
    oCircumference: {
      sideMasterUnits: master(O_PERIMETER_WIDTH * 0.88),
      capBaselineMasterUnits: master(O_PERIMETER_WIDTH * 1.14),
      sideCapHeightPercent: capNormalized(O_PERIMETER_WIDTH * 0.88),
      capBaselineCapHeightPercent: capNormalized(O_PERIMETER_WIDTH * 1.14),
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
