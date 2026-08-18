import { mkdir } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";

const width = 1600;
const height = 1000;
const outputDirectory = new URL(
  "../../../../apps/blogs/ai-knows-propositions-humans-navigate-relationships/assets/",
  import.meta.url,
);

type NodeSpec = {
  index: string;
  x: number;
  y: number;
  radius: number;
  lines: string[];
  fontSize?: number;
  emphasis?: boolean;
};

type RelationshipSpec = {
  index: string;
  path: string;
  labelLines: string[];
  labelX: number;
  labelY: number;
  width: number;
};

const nodes: NodeSpec[] = [
  {
    index: "P.01",
    x: 185,
    y: 350,
    radius: 100,
    lines: ["TEMPERATURE", "IS 85"],
    fontSize: 20,
    emphasis: true,
  },
  {
    index: "P.02",
    x: 520,
    y: 365,
    radius: 94,
    lines: ["HUMIDITY", "24%"],
    fontSize: 21,
  },
  {
    index: "P.03",
    x: 180,
    y: 710,
    radius: 88,
    lines: ["DATE IS", "AUG 15"],
    fontSize: 21,
  },
  {
    index: "P.04",
    x: 520,
    y: 720,
    radius: 82,
    lines: ["TIME IS", "8:27"],
    fontSize: 21,
    emphasis: true,
  },
  {
    index: "P.05",
    x: 940,
    y: 330,
    radius: 118,
    lines: ["HE IS WEARING", "A HOODED", "JACKET"],
    fontSize: 19,
  },
  {
    index: "P.06",
    x: 1370,
    y: 690,
    radius: 145,
    lines: ["HE IS WET", "FROM SWEAT,", "BUT NOT", "FROM RAIN"],
    fontSize: 21,
    emphasis: true,
  },
];

const interpretivePaths = [
  "M 268 392 C 430 470 585 548 720 610",
  "M 586 435 C 635 492 684 545 750 575",
  "M 267 700 C 430 655 578 635 720 627",
  "M 602 710 C 651 689 686 674 720 660",
  "M 1225 690 C 1202 681 1185 671 1170 660",
];

const causalPaths = [
  "M 277 314 C 607 167 1028 278 1268 584",
  "M 611 375 C 850 403 1097 500 1246 614",
  "M 1021 417 C 1128 502 1192 580 1247 634",
];

const retainedRelationships: RelationshipSpec[] = [
  {
    index: "R.01",
    path: "M 278 314 C 343 235 425 238 443 325",
    labelLines: ["IT FEELS WARM AND MUGGY", "OUTSIDE"],
    labelX: 360,
    labelY: 229,
    width: 300,
  },
  {
    index: "R.02",
    path: "M 268 738 C 330 827 407 840 442 754",
    labelLines: ["SUNSET EXPOSES BEAUTY", "IN GLOWING KOLOB"],
    labelX: 355,
    labelY: 840,
    width: 306,
  },
];

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function renderNode(node: NodeSpec) {
  const fontSize = node.fontSize ?? 21;
  const lineGap = fontSize * 0.92;
  const firstLineY = node.y - ((node.lines.length - 1) * lineGap) / 2 + 3;
  const title = node.lines
    .map(
      (line, index) =>
        `<tspan x="${node.x}" y="${firstLineY + index * lineGap}">${escapeXml(line)}</tspan>`,
    )
    .join("");
  const stroke = node.emphasis ? "#d6b06a" : "#f2e5cf";
  const strokeOpacity = node.emphasis ? 0.9 : 0.36;
  const fill = node.emphasis ? "url(#node-emphasis)" : "url(#node-neutral)";

  return `
    <g class="proposition">
      <circle cx="${node.x}" cy="${node.y}" r="${node.radius + 8}" fill="none" stroke="${stroke}" stroke-opacity="${node.emphasis ? 0.16 : 0.07}"/>
      <circle cx="${node.x}" cy="${node.y}" r="${node.radius}" fill="${fill}" stroke="${stroke}" stroke-opacity="${strokeOpacity}" stroke-width="1.2"/>
      <circle cx="${node.x}" cy="${node.y - node.radius + 1}" r="3" fill="#d6b06a"/>
      <text x="${node.x}" y="${node.y - node.radius + 26}" text-anchor="middle" class="node-index">${node.index} / PROPOSITION</text>
      <text x="${node.x}" text-anchor="middle" class="node-title" font-size="${fontSize}">${title}</text>
      <text x="${node.x}" y="${node.y + node.radius - 24}" text-anchor="middle" class="node-detail">WHAT CAN BE STATED</text>
    </g>`;
}

function renderRelationshipLabel(relationship: RelationshipSpec) {
  const text = relationship.labelLines
    .map((line, index) => `<tspan x="0" y="${-2 + index * 15}">${escapeXml(line)}</tspan>`)
    .join("");

  return `
    <g transform="translate(${relationship.labelX} ${relationship.labelY})">
      <rect x="${-relationship.width / 2}" y="-27" width="${relationship.width}" height="54" rx="3" fill="#050505" stroke="#d6b06a" stroke-opacity="0.55"/>
      <circle cx="${-relationship.width / 2 + 19}" cy="0" r="3" fill="#d6b06a"/>
      <text x="${-relationship.width / 2 + 34}" y="3" class="hub-index">${relationship.index}</text>
      <text x="0" text-anchor="middle" class="line-label">${text}</text>
    </g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">Weather propositions, causes, and relational meaning</title>
  <desc id="description">Six factual nodes record the date, temperature, humidity, time, clothing, and a person wet from sweat rather than rain. Temperature and humidity are joined by the interpretation that it feels warm and muggy outside. Date and time are joined by the interpretation that sunset exposes beauty in glowing Kolob. Solid causal arrows from temperature, humidity, and a hooded jacket point toward the observed sweat. Thin lines from date, temperature, humidity, time, and sweat converge on an image of ambivalent Iris gilding the cliffs while gathering rain.</desc>
  <defs>
    <radialGradient id="background-glow" cx="57%" cy="47%" r="72%">
      <stop offset="0" stop-color="#1a150e"/>
      <stop offset="0.58" stop-color="#0b0907"/>
      <stop offset="1" stop-color="#050505"/>
    </radialGradient>
    <radialGradient id="node-neutral" cx="42%" cy="36%" r="72%">
      <stop offset="0" stop-color="#171510"/>
      <stop offset="1" stop-color="#080706"/>
    </radialGradient>
    <radialGradient id="node-emphasis" cx="40%" cy="32%" r="76%">
      <stop offset="0" stop-color="#251d10"/>
      <stop offset="0.58" stop-color="#100d09"/>
      <stop offset="1" stop-color="#070605"/>
    </radialGradient>
    <linearGradient id="causal-line" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8d7650"/>
      <stop offset="0.55" stop-color="#fff0c8"/>
      <stop offset="1" stop-color="#d6b06a"/>
    </linearGradient>
    <filter id="grain" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="31"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <filter id="hub-glow" x="-50%" y="-80%" width="200%" height="260%">
      <feGaussianBlur stdDeviation="30"/>
    </filter>
    <marker id="causal-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 1 1 L 11 6 L 1 11 Z" fill="#d6b06a"/>
    </marker>
    <style>
      .micro, .legend-label, .node-index, .node-detail, .hub-index, .hub-detail, .line-label, .footer-label {
        font-family: "IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, monospace;
        letter-spacing: 0.13em;
      }
      .micro { font-size: 10px; fill: #d6b06a; }
      .headline { font-family: Newsreader, Georgia, serif; font-size: 41px; font-weight: 400; fill: #f2e5cf; letter-spacing: -0.025em; }
      .legend-label { font-size: 8.2px; fill: #a99b87; }
      .legend-strong { fill: #f2e5cf; }
      .node-index { font-size: 7.4px; fill: #d6b06a; }
      .node-title { font-family: Newsreader, Georgia, serif; font-weight: 400; fill: #f2e5cf; letter-spacing: -0.025em; }
      .node-detail { font-size: 6.5px; fill: #a99b87; }
      .hub-index { font-size: 8px; fill: #d6b06a; }
      .hub-title { font-family: Newsreader, Georgia, serif; font-size: 21px; font-weight: 400; fill: #fff0c8; letter-spacing: -0.02em; }
      .hub-detail { font-size: 7px; fill: #a99b87; }
      .line-label { font-size: 7.4px; fill: #d6b06a; }
      .footer-label { font-size: 8px; fill: #7f7465; }
    </style>
  </defs>

  <rect width="1600" height="1000" fill="url(#background-glow)"/>
  <ellipse cx="920" cy="650" rx="300" ry="190" fill="#d6b06a" opacity="0.035" filter="url(#hub-glow)"/>
  <rect width="1600" height="1000" filter="url(#grain)" opacity="0.035" style="mix-blend-mode:soft-light"/>

  <path d="M 84 188 H 1516" stroke="#f2e5cf" stroke-opacity="0.12"/>
  <path d="M 84 898 H 1516" stroke="#f2e5cf" stroke-opacity="0.12"/>
  <path d="M 84 910 V 924 M 1516 910 V 924" stroke="#d6b06a" stroke-opacity="0.42"/>

  <text x="84" y="70" class="micro">02 / CONDITIONS, CAUSES, MEANING</text>
  <text x="84" y="137" class="headline">Facts contribute to an outcome. Together, they shape its meaning.</text>

  <g transform="translate(1050 65)">
    <circle cx="10" cy="11" r="9" fill="none" stroke="#f2e5cf" stroke-opacity="0.65"/>
    <circle cx="10" cy="2" r="2" fill="#d6b06a"/>
    <text x="31" y="9" class="legend-label legend-strong">PROPOSITION</text>
    <text x="31" y="23" class="legend-label">WHAT IS STATED</text>

    <path d="M 153 11 H 203" fill="none" stroke="#d6b06a" stroke-width="1.8" marker-end="url(#causal-arrow)"/>
    <text x="220" y="9" class="legend-label legend-strong">CAUSAL ARROW</text>
    <text x="220" y="23" class="legend-label">CONTRIBUTES TO</text>

    <path d="M 350 3 L 374 11 L 350 19 M 398 3 L 374 11 L 398 19" fill="none" stroke="#f2e5cf" stroke-opacity="0.5"/>
    <text x="414" y="9" class="legend-label legend-strong">CONVERGENCE</text>
    <text x="414" y="23" class="legend-label">INTERPRETED TOGETHER</text>
  </g>

  <g id="interpretive-convergence" fill="none" stroke="#f2e5cf" stroke-opacity="0.34" stroke-width="1.1" stroke-dasharray="3 6" stroke-linecap="round">
    ${interpretivePaths.map((path) => `<path d="${path}"/>`).join("")}
  </g>

  <g id="retained-relationship-paths" fill="none" stroke="url(#causal-line)" stroke-width="1.7" stroke-linecap="round">
    ${retainedRelationships.map((relationship) => `<path d="${relationship.path}"/>`).join("")}
  </g>

  <g id="causal-arrows" fill="none" stroke="url(#causal-line)" stroke-width="2" stroke-linecap="round" marker-end="url(#causal-arrow)">
    ${causalPaths.map((path) => `<path d="${path}"/>`).join("")}
  </g>

  <g id="propositions">${nodes.map(renderNode).join("")}
  </g>

  <g id="retained-relationship-labels">${retainedRelationships.map(renderRelationshipLabel).join("")}
  </g>

  <g id="relational-statement">
    <rect x="720" y="555" width="450" height="190" rx="4" fill="#050505" stroke="#d6b06a" stroke-opacity="0.7"/>
    <circle cx="746" cy="581" r="3" fill="#d6b06a"/>
    <text x="762" y="584" class="hub-index">R.03 / RELATIONAL STATEMENT</text>
    <text x="945" y="614" text-anchor="middle" class="hub-title">
      <tspan x="945" y="614">AMBIVALENT IRIS BENDS</tspan>
      <tspan x="945" y="635">ABOVE KOLOB—</tspan>
      <tspan x="945" y="656">GILDING THE SUNLIT CLIFFS</tspan>
      <tspan x="945" y="677">WITH ONE HAND, GATHERING RAIN</tspan>
      <tspan x="945" y="698">WITH THE OTHER.</tspan>
    </text>
    <text x="945" y="722" text-anchor="middle" class="hub-detail">FIVE CONDITIONS / ONE EXPERIENCED MEANING</text>
  </g>

  <text x="84" y="946" class="footer-label">SOLID ARROWS SHOW CONTRIBUTION.</text>
  <text x="356" y="946" class="footer-label" fill="#d6b06a">DASHED LINES SHOW INTERPRETATION.</text>
  <text x="1516" y="946" text-anchor="end" class="footer-label">ILLUSTRATIVE LANGUAGE · NOT A FORMAL DEFINITION OF GRAPH THEORY</text>
</svg>`;

await mkdir(outputDirectory, { recursive: true });

const svgPath = new URL("weather-propositions-and-sensations.svg", outputDirectory);
const pngPath = new URL("weather-propositions-and-sensations@2x.png", outputDirectory);

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
