import { mkdir } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";

const width = 1600;
const height = 1000;
const outputDirectory = new URL(
  "../../../../libs/blogs/articles/truth-entropy-and-inference/assets/",
  import.meta.url,
);

type NodeSpec = {
  index: string;
  x: number;
  y: number;
  radius: number;
  lines: string[];
  detail: string;
  emphasis?: boolean;
};

type EdgeSpec = {
  path: string;
  label: string;
  labelX: number;
  labelY: number;
  rotation: number;
  width: number;
  emphasis?: boolean;
};

const nodes: NodeSpec[] = [
  { index: "P.01", x: 158, y: 323, radius: 67, lines: ["68°F"], detail: "RECORDED TEMPERATURE" },
  { index: "P.02", x: 458, y: 260, radius: 77, lines: ["PERSON", "AT WORK"], detail: "OBSERVED SITUATION" },
  { index: "P.03", x: 350, y: 535, radius: 82, lines: ["MARKET", "SHARE"], detail: "CATEGORY MEASURE" },
  { index: "P.04", x: 165, y: 750, radius: 82, lines: ["PRODUCT", "BET"], detail: "TEAM DECISION" },
  { index: "P.05", x: 585, y: 785, radius: 96, lines: ["CUSTOMER", "REQUEST"], detail: "RECORDED STATEMENT" },
  { index: "P.06", x: 610, y: 555, radius: 75, lines: ["PRODUCT", "TEAM"], detail: "DECISION MAKER" },
  { index: "P.07", x: 868, y: 325, radius: 105, lines: ["TOUCH", "SCREEN"], detail: "PRODUCT PROPERTY", emphasis: true },
  { index: "P.08", x: 925, y: 665, radius: 79, lines: ["NEW", "USER"], detail: "PARTICIPANT" },
  { index: "P.09", x: 1170, y: 765, radius: 96, lines: ["PREMIUM", "PRICE"], detail: "MARKET POSITION" },
  { index: "P.10", x: 1382, y: 390, radius: 118, lines: ["FELT", "POSSIBILITY"], detail: "QUALITATIVE RESPONSE", emphasis: true },
  { index: "P.11", x: 1435, y: 735, radius: 82, lines: ["BUYER", "IDENTITY"], detail: "SOCIAL CONTEXT" },
];

const edges: EdgeSpec[] = [
  {
    path: "M 224 310 C 302 281 355 261 381 258",
    label: "FEELS COLD TO",
    labelX: 307,
    labelY: 276,
    rotation: -10,
    width: 142,
  },
  {
    path: "M 311 603 C 260 647 221 684 194 702",
    label: "MATTERS BECAUSE",
    labelX: 250,
    labelY: 648,
    rotation: -31,
    width: 160,
  },
  {
    path: "M 588 690 C 592 650 598 616 603 607",
    label: "IS TRUSTED BY",
    labelX: 641,
    labelY: 648,
    rotation: -84,
    width: 145,
  },
  {
    path: "M 879 430 C 888 507 904 568 916 588",
    label: "ASKS BEHAVIOR OF",
    labelX: 938,
    labelY: 514,
    rotation: 79,
    width: 176,
  },
  {
    path: "M 967 305 C 1090 271 1241 282 1291 331",
    label: "INVITES GESTURE",
    labelX: 1132,
    labelY: 277,
    rotation: 1,
    width: 170,
    emphasis: true,
  },
  {
    path: "M 1250 708 C 1306 646 1354 638 1390 667",
    label: "SIGNALS STATUS TO",
    labelX: 1325,
    labelY: 644,
    rotation: -3,
    width: 182,
  },
];

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function renderEdge(edge: EdgeSpec) {
  const stroke = edge.emphasis ? "url(#gold-line)" : "#8d7650";
  const opacity = edge.emphasis ? 1 : 0.72;
  const strokeWidth = edge.emphasis ? 2.25 : 1.35;
  const labelFill = edge.emphasis ? "#fff5dc" : "#d6b06a";

  return `
    <g class="relationship">
      <path d="${edge.path}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" opacity="${opacity}"/>
      <circle cx="${edge.path.match(/M\s([\d.]+)/)?.[1] ?? 0}" cy="${edge.path.match(/M\s[\d.]+\s([\d.]+)/)?.[1] ?? 0}" r="2.5" fill="#d6b06a" opacity="${opacity}"/>
      <g transform="translate(${edge.labelX} ${edge.labelY}) rotate(${edge.rotation})">
        <rect x="${-edge.width / 2}" y="-14" width="${edge.width}" height="28" rx="3" fill="#050505" stroke="#d6b06a" stroke-opacity="0.24"/>
        <text x="0" y="3.5" text-anchor="middle" class="edge-label" fill="${labelFill}">${escapeXml(edge.label)}</text>
      </g>
    </g>`;
}

function renderNode(node: NodeSpec) {
  const titleFontSize = node.lines.length === 1 ? 27 : node.radius < 80 ? 18 : 21;
  const lineGap = titleFontSize * 0.91;
  const firstLineY = node.y - ((node.lines.length - 1) * lineGap) / 2 + 2;
  const title = node.lines
    .map(
      (line, index) =>
        `<tspan x="${node.x}" y="${firstLineY + index * lineGap}">${escapeXml(line)}</tspan>`,
    )
    .join("");
  const stroke = node.emphasis ? "#d6b06a" : "#f2e5cf";
  const strokeOpacity = node.emphasis ? 0.88 : 0.34;
  const fill = node.emphasis ? "url(#node-emphasis)" : "url(#node-neutral)";

  return `
    <g class="proposition">
      <circle cx="${node.x}" cy="${node.y}" r="${node.radius + 7}" fill="none" stroke="${stroke}" stroke-opacity="${node.emphasis ? 0.14 : 0.07}"/>
      <circle cx="${node.x}" cy="${node.y}" r="${node.radius}" fill="${fill}" stroke="${stroke}" stroke-opacity="${strokeOpacity}" stroke-width="1.2"/>
      <circle cx="${node.x}" cy="${node.y - node.radius + 1}" r="3" fill="#d6b06a"/>
      <text x="${node.x}" y="${node.y - node.radius + 25}" text-anchor="middle" class="node-index">${node.index}</text>
      <text x="${node.x}" text-anchor="middle" class="node-title" font-size="${titleFontSize}">${title}</text>
      <text x="${node.x}" y="${node.y + node.radius - 22}" text-anchor="middle" class="node-detail">${escapeXml(node.detail)}</text>
    </g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">Propositions as nodes and relationships as edges</title>
  <desc id="description">A sparse network where factual propositions are circular nodes and situated relationships are gold labeled edges. The highlighted path connects touchscreen to felt possibility through the relationship invites gesture.</desc>
  <defs>
    <radialGradient id="background-glow" cx="50%" cy="45%" r="65%">
      <stop offset="0" stop-color="#17130e"/>
      <stop offset="0.62" stop-color="#080706"/>
      <stop offset="1" stop-color="#050505"/>
    </radialGradient>
    <radialGradient id="node-neutral" cx="42%" cy="36%" r="72%">
      <stop offset="0" stop-color="#171510"/>
      <stop offset="1" stop-color="#080706"/>
    </radialGradient>
    <radialGradient id="node-emphasis" cx="40%" cy="32%" r="76%">
      <stop offset="0" stop-color="#211b11"/>
      <stop offset="0.58" stop-color="#100d09"/>
      <stop offset="1" stop-color="#070605"/>
    </radialGradient>
    <linearGradient id="gold-line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8d7650"/>
      <stop offset="0.48" stop-color="#fff0c8"/>
      <stop offset="1" stop-color="#d6b06a"/>
    </linearGradient>
    <filter id="grain" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="17"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="20"/>
    </filter>
    <style>
      .micro, .legend-label, .edge-label, .node-index, .node-detail, .footer-label {
        font-family: "IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, monospace;
        letter-spacing: 0.14em;
      }
      .micro { font-size: 10px; fill: #d6b06a; }
      .headline { font-family: Newsreader, Georgia, serif; font-size: 43px; font-weight: 400; fill: #f2e5cf; letter-spacing: -0.025em; }
      .legend-label { font-size: 9px; fill: #a99b87; }
      .legend-strong { fill: #f2e5cf; }
      .edge-label { font-size: 9px; font-weight: 400; }
      .node-index { font-size: 8px; fill: #d6b06a; }
      .node-title { font-family: Newsreader, Georgia, serif; font-weight: 400; fill: #f2e5cf; letter-spacing: -0.025em; }
      .node-detail { font-size: 6.8px; fill: #a99b87; letter-spacing: 0.115em; }
      .footer-label { font-size: 8px; fill: #7f7465; }
    </style>
  </defs>

  <rect width="1600" height="1000" fill="url(#background-glow)"/>
  <ellipse cx="1045" cy="430" rx="520" ry="370" fill="#d6b06a" opacity="0.025" filter="url(#soft-glow)"/>
  <rect width="1600" height="1000" filter="url(#grain)" opacity="0.035" style="mix-blend-mode:soft-light"/>

  <g aria-hidden="true">
    <path d="M 84 188 H 1516" stroke="#f2e5cf" stroke-opacity="0.12"/>
    <path d="M 84 898 H 1516" stroke="#f2e5cf" stroke-opacity="0.12"/>
    <path d="M 84 910 V 924 M 1516 910 V 924" stroke="#d6b06a" stroke-opacity="0.42"/>
  </g>

  <text x="84" y="70" class="micro">01 / A VISUAL GRAMMAR</text>
  <text x="84" y="137" class="headline">What can be stated is not yet what it means.</text>

  <g transform="translate(1125 68)">
    <circle cx="10" cy="10" r="9" fill="none" stroke="#f2e5cf" stroke-opacity="0.65"/>
    <circle cx="10" cy="1" r="2" fill="#d6b06a"/>
    <text x="33" y="8" class="legend-label legend-strong">NODE / PROPOSITION</text>
    <text x="33" y="23" class="legend-label">WHAT CAN BE STATED</text>
    <path d="M 235 10 H 283" stroke="#d6b06a" stroke-width="1.5"/>
    <text x="303" y="8" class="legend-label legend-strong">EDGE / RELATIONSHIP</text>
    <text x="303" y="23" class="legend-label">WHY IT MATTERS</text>
  </g>

  <g id="relationships">${edges.map(renderEdge).join("")}
  </g>
  <g id="propositions">${nodes.map(renderNode).join("")}
  </g>

  <text x="84" y="946" class="footer-label">NODES ANSWER WHAT.</text>
  <text x="248" y="946" class="footer-label" fill="#d6b06a">EDGES ANSWER WHY.</text>
  <text x="1516" y="946" text-anchor="end" class="footer-label">ILLUSTRATIVE LANGUAGE · NOT A FORMAL DEFINITION OF GRAPH THEORY</text>
</svg>`;

await mkdir(outputDirectory, { recursive: true });

const svgPath = new URL("propositions-and-relationships.svg", outputDirectory);
const pngPath = new URL("propositions-and-relationships@2x.png", outputDirectory);

await Bun.write(svgPath, svg);

const renderer = new Resvg(svg, {
  fitTo: { mode: "width", value: width * 2 },
  font: {
    loadSystemFonts: true,
    defaultFontFamily: "Georgia",
  },
});

await Bun.write(pngPath, renderer.render().asPng());

console.log(`Created ${svgPath.pathname}`);
console.log(`Created ${pngPath.pathname}`);
