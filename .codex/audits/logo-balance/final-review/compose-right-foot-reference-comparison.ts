import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const output = resolve(import.meta.dir);
const reference = await Bun.file("/Users/thom/Desktop/Right Foot.svg").text();
const mockup = await Bun.file(resolve(output, "compose-alignment-mockup.ts")).text();

const referenceFoot = reference.match(/<path d="([^"]+)" style="fill:none;stroke:#757575[^>]*\/>/)?.[1];
const currentRight = mockup.match(/data-t-segment="right-pillar"[\s\S]*?<path d="([^"]+)"/)?.[1];

if (!referenceFoot || !currentRight) {
  throw new Error("Could not read the reference foot or the current right pillar.");
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2200" height="900" viewBox="0 0 440 180">
  <rect width="440" height="180" fill="#c5b6f4"/>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" fill="#17131b">
    <text x="20" y="14" font-size="5" letter-spacing=".5">RIGHT FOOT · REFERENCE / CURRENT COMPARISON</text>
    <text x="20" y="22" font-size="2.7" fill="#4b416a">THE LEFT IS YOUR ORIGINAL DRAWN CURVE; THE RIGHT IS ITS FITTED, FILLED RESULT.</text>
  </g>
  <rect x="18" y="32" width="190" height="128" rx="2" fill="#a999d8" opacity=".36"/>
  <rect x="232" y="32" width="190" height="128" rx="2" fill="#a999d8" opacity=".36"/>
  <text x="24" y="42" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="3.5" fill="#17131b" letter-spacing=".3">YOUR RIGHT FOOT.svg · DRAWN REFERENCE</text>
  <text x="238" y="42" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="3.5" fill="#17131b" letter-spacing=".3">CURRENT T · FITTED FILL</text>
  <svg x="24" y="48" width="178" height="102" viewBox="160 270 180 190" preserveAspectRatio="xMidYMid meet">
    <rect x="160" y="270" width="180" height="190" fill="#c5b6f4"/>
    <path d="${referenceFoot}" fill="none" stroke="#656168" stroke-width="4.17" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <svg x="238" y="48" width="178" height="102" viewBox="43 55 68 62" preserveAspectRatio="xMidYMid meet">
    <rect x="43" y="55" width="68" height="62" fill="#c5b6f4"/>
    <g transform="translate(22 -.222) scale(.86 1.03)" fill="#000000">
      <path d="${currentRight}"/>
    </g>
    <g fill="none" stroke="#17131b" stroke-width=".35" stroke-dasharray="1.5 1.5" opacity=".72">
      <line x1="43" y1="72.2143" x2="111" y2="72.2143"/>
      <line x1="43" y1="84.9286" x2="111" y2="84.9286"/>
    </g>
    <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="2.25" fill="#4b416a">
      <text x="44" y="71.1">ROW 10</text>
      <text x="44" y="83.8">ROW 12</text>
    </g>
  </svg>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="3" fill="#4b416a">
    <text x="24" y="157">2 CUBIC ARCS + STRAIGHT CLOSING EDGE</text>
    <text x="238" y="157">ROW-10 EDGES AND ROW-12 CUSP LOCKED</text>
  </g>
</svg>`;

const stem = "42-right-foot-reference-comparison";
await Bun.write(resolve(output, `${stem}.svg`), `${svg}\n`);
await Bun.write(resolve(output, `${stem}.png`), new Resvg(svg, { fitTo: { mode: "width", value: 2200 } }).render().asPng());
