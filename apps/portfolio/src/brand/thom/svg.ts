import type { BrandData, ChordNetwork, CubicBezierSegment, FilledPath, OpticalProfile, PathCommand, Point } from "@th-m/thom-brand/geometry";
import {
  BRAND_COLORS,
  displayStrokeWorldWidth,
  H_COLUMN_MATERIAL,
  H_ISOLATED_VIEW,
  H_MATERIAL,
  H_RATIO_POINT_SHAPE,
  H_RATIO_POINT_MATERIAL,
  hStrokeWorldWidth,
  M_COMPACT_SCRIBBLE_LAYERS,
  M_FINAL_MATERIAL,
  M_FINE_STRAND_OFFSETS,
  O_DISPLAY_MATERIAL,
  O_METAL_GRADIENT,
  OPTICAL_PLACEMENT_X,
  PI_MATERIAL,
  fourierCompactBezier,
  fourierPartialBezier,
} from "@th-m/thom-brand/geometry";

type SvgTheme = "dark" | "light" | "monochrome";

const pointList = (points: Point[]) => points.map((point) => `${point.x.toFixed(3)},${point.y.toFixed(3)}`).join(" ");
const pathNumber = (value: number) => Number(value.toFixed(3));

function pathData(path: FilledPath): string {
  return path.commands.map((command: PathCommand) => {
    if (command.type === "Z") return "Z";
    if (command.type === "C") {
      return `C${pathNumber(command.x1)} ${pathNumber(command.y1)} ${pathNumber(command.x2)} ${pathNumber(command.y2)} ${pathNumber(command.x)} ${pathNumber(command.y)}`;
    }
    return `${command.type}${pathNumber(command.x)} ${pathNumber(command.y)}`;
  }).join(" ");
}

function precisePathData(path: FilledPath): string {
  return path.commands.map((command: PathCommand) => {
    if (command.type === "Z") return "Z";
    if (command.type === "C") return `C${command.x1} ${command.y1} ${command.x2} ${command.y2} ${command.x} ${command.y}`;
    return `${command.type}${command.x} ${command.y}`;
  }).join(" ");
}

const filledPath = (path: FilledPath, fill: string, luminous: boolean, opticalStroke = 0) =>
  `<path d="${pathData(path)}" fill="${fill}"${luminous ? ` stroke="${BRAND_COLORS.gold}" stroke-width="${H_COLUMN_MATERIAL.strokeWidth}" filter="url(#thom-fill-glow)"` : opticalStroke > 0 ? ` stroke="${fill}" stroke-width="${opticalStroke}" stroke-linejoin="round"` : ""}/>`;

const piPath = (path: FilledPath, fill: string, luminous: boolean) =>
  `<path d="${precisePathData(path)}" fill="${fill}"${luminous ? ` stroke="${PI_MATERIAL.edge}" stroke-width="${PI_MATERIAL.strokeWidth}" filter="url(#thom-pi-glow)"` : ""}/>`;

const polyline = (points: Point[], stroke: string, width: number, opacity = 1, extra = "", widthInWorldUnits = false) =>
  `<polyline points="${pointList(points)}" fill="none" stroke="${stroke}" stroke-width="${widthInWorldUnits ? width : displayStrokeWorldWidth(width)}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"${extra}/>`;

const bezierPathData = (chain: CubicBezierSegment[]) => {
  if (!chain.length) return "";
  return `M${pathNumber(chain[0].start.x)} ${pathNumber(chain[0].start.y)} ${chain.map((segment) =>
    `C${pathNumber(segment.control1.x)} ${pathNumber(segment.control1.y)} ${pathNumber(segment.control2.x)} ${pathNumber(segment.control2.y)} ${pathNumber(segment.end.x)} ${pathNumber(segment.end.y)}`
  ).join(" ")}`;
};

const bezierPath = (chain: CubicBezierSegment[], stroke: string, width: number, opacity = 1, extra = "") =>
  `<path d="${bezierPathData(chain)}" fill="none" stroke="${stroke}" stroke-width="${displayStrokeWorldWidth(width)}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"${extra}/>`;

const node = (point: Point, fill: string, radius: number, opacity = 1, extra = "") =>
  `<circle cx="${point.x.toFixed(3)}" cy="${point.y.toFixed(3)}" r="${radius}" fill="${fill}" opacity="${opacity}"${extra}/>`;

const ellipse = (point: Point, fill: string, radiusX: number, radiusY: number, opacity = 1, extra = "") =>
  `<ellipse cx="${point.x.toFixed(3)}" cy="${point.y.toFixed(3)}" rx="${radiusX}" ry="${radiusY}" fill="${fill}" opacity="${opacity}"${extra}/>`;

function palette(theme: SvgTheme) {
  if (theme === "light") return { background: BRAND_COLORS.lightBackground, ivory: BRAND_COLORS.lightInk, gold: BRAND_COLORS.lightGold, highlight: BRAND_COLORS.lightInk };
  if (theme === "monochrome") return { background: "transparent", ivory: "#000000", gold: "#000000", highlight: "#000000" };
  return { background: BRAND_COLORS.background, ivory: BRAND_COLORS.ivory, gold: BRAND_COLORS.gold, highlight: BRAND_COLORS.highlight };
}

function defs(theme: SvgTheme, profile: OpticalProfile): string {
  if (theme !== "dark" || profile !== "display") return "";
  return `<defs>
    <linearGradient id="thom-metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BRAND_COLORS.shadow}"/>
      <stop offset=".28" stop-color="${BRAND_COLORS.gold}"/>
      <stop offset=".49" stop-color="${BRAND_COLORS.highlight}"/>
      <stop offset=".7" stop-color="${BRAND_COLORS.ivory}"/>
      <stop offset="1" stop-color="${BRAND_COLORS.shadow}"/>
    </linearGradient>
    <linearGradient id="thom-pi-metal" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="120">
      <stop offset="0" stop-color="${PI_MATERIAL.shadow}"/>
      <stop offset=".28" stop-color="${PI_MATERIAL.gold}"/>
      <stop offset=".49" stop-color="${PI_MATERIAL.highlight}"/>
      <stop offset=".7" stop-color="${PI_MATERIAL.ivory}"/>
      <stop offset="1" stop-color="${PI_MATERIAL.shadow}"/>
    </linearGradient>
    <linearGradient id="thom-m-highlight" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${BRAND_COLORS.shadow}"/>
      <stop offset=".08" stop-color="${BRAND_COLORS.gold}"/>
      <stop offset=".14" stop-color="${BRAND_COLORS.highlight}"/>
      <stop offset=".86" stop-color="${BRAND_COLORS.highlight}"/>
      <stop offset=".92" stop-color="${BRAND_COLORS.gold}"/>
      <stop offset="1" stop-color="${BRAND_COLORS.shadow}"/>
    </linearGradient>
    <linearGradient id="thom-m-partial" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${BRAND_COLORS.shadow}"/>
      <stop offset=".14" stop-color="${BRAND_COLORS.gold}"/>
      <stop offset=".86" stop-color="${BRAND_COLORS.gold}"/>
      <stop offset="1" stop-color="${BRAND_COLORS.shadow}"/>
    </linearGradient>
    <linearGradient id="thom-h-metal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${H_COLUMN_MATERIAL.edge}"/>
      <stop offset=".42" stop-color="${H_COLUMN_MATERIAL.body}"/>
      <stop offset=".5" stop-color="${H_COLUMN_MATERIAL.highlight}"/>
      <stop offset=".58" stop-color="${H_COLUMN_MATERIAL.body}"/>
      <stop offset="1" stop-color="${H_COLUMN_MATERIAL.edge}"/>
    </linearGradient>
    <filter id="thom-fill-glow" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.35" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 .17 0 .72 0 0 .08 0 0 .38 0 .02 0 0 0 .34 0" result="warm"/>
      <feMerge><feMergeNode in="warm"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="thom-pi-glow" x="-24%" y="-24%" width="148%" height="148%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation=".9" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values=".72 0 0 0 .12 0 .54 0 0 .06 0 0 .3 0 .02 0 0 0 .22 0" result="warm"/>
      <feMerge><feMergeNode in="warm"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="thom-line-glow" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="2.2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="thom-o-glow" x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="1.2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;
}

function luminousLine(points: Point[], core: string, width = 1.2, opacity = 1): string {
  return `${polyline(points, BRAND_COLORS.gold, width * 4.6, opacity * 0.09)}${polyline(points, BRAND_COLORS.gold, width * 1.9, opacity * 0.34)}${polyline(points, core, width, opacity, ` filter="url(#thom-line-glow)"`)}`;
}

function oCircleMarkup(points: Point[]): string {
  const material = O_DISPLAY_MATERIAL.circle;
  const gradientStops = O_METAL_GRADIENT.stops
    .map((stop) => `<stop offset="${stop.offset}" stop-color="${stop.color}"/>`)
    .join("");
  const metal = `<defs><linearGradient id="thom-o-metal" gradientUnits="userSpaceOnUse" x1="${O_METAL_GRADIENT.start.x}" y1="${O_METAL_GRADIENT.start.y}" x2="${O_METAL_GRADIENT.end.x}" y2="${O_METAL_GRADIENT.end.y}">${gradientStops}</linearGradient></defs>`;
  return `${metal}${polyline(points, BRAND_COLORS.gold, material.haloWidth, material.haloOpacity)}${polyline(points, BRAND_COLORS.gold, material.middleWidth, material.middleOpacity)}${polyline(points, "url(#thom-o-metal)", material.coreWidth, material.coreOpacity, ` filter="url(#thom-o-glow)"`, true)}`;
}

function hLuminousLine(points: Point[], core: string, material: (typeof H_MATERIAL)[keyof typeof H_MATERIAL], part: string): string {
  const marker = ` data-h-part="${part}"`;
  return `${polyline(points, BRAND_COLORS.gold, hStrokeWorldWidth(material.haloWidth), material.haloOpacity, "", true)}${polyline(points, BRAND_COLORS.gold, hStrokeWorldWidth(material.middleWidth), material.middleOpacity, "", true)}${polyline(points, core, hStrokeWorldWidth(material.coreWidth), material.coreOpacity, ` filter="url(#thom-line-glow)"${marker}`, true)}`;
}

function mDisplayMarkup(data: BrandData, colors: ReturnType<typeof palette>, luminous: boolean): string {
  const partials = data.m.restingLayers.map((layer) => {
    const chain = fourierPartialBezier(data.m, layer.partialIndex, 64, layer.amplitudeScale);
    const halo = luminous && layer.haloOpacity > 0 ? bezierPath(chain, BRAND_COLORS.gold, layer.haloWidth, layer.haloOpacity) : "";
    return `${halo}${bezierPath(chain, luminous ? "url(#thom-m-partial)" : colors.ivory, layer.width, layer.opacity)}`;
  }).join("");
  const finalChain = fourierPartialBezier(data.m, data.m.displayHarmonicCount - 1);
  const final = luminous
    ? `${bezierPath(finalChain, BRAND_COLORS.gold, M_FINAL_MATERIAL.halo.width, M_FINAL_MATERIAL.halo.opacity)}${bezierPath(finalChain, BRAND_COLORS.gold, M_FINAL_MATERIAL.middle.width, M_FINAL_MATERIAL.middle.opacity)}${bezierPath(finalChain, "url(#thom-m-highlight)", M_FINAL_MATERIAL.core.width, M_FINAL_MATERIAL.core.opacity, ` filter="url(#thom-line-glow)"`)}`
    : bezierPath(finalChain, colors.ivory, 1.35, 0.96);
  const fineStrands = data.m.restingLayers.slice(1).map((layer) => {
    const chain = fourierPartialBezier(data.m, layer.partialIndex, 64, layer.amplitudeScale);
    const halo = luminous && layer.haloOpacity > 0 ? bezierPath(chain, BRAND_COLORS.gold, layer.haloWidth, layer.haloOpacity) : "";
    return `${halo}${bezierPath(chain, luminous ? "url(#thom-m-partial)" : colors.ivory, layer.width, layer.opacity)}`;
  }).join("");
  const texture = M_FINE_STRAND_OFFSETS.map((offset) => `<g transform="translate(0 ${offset})" opacity=".4">${fineStrands}</g>`).join("");
  return `${partials}${final}${texture}`;
}

function mCompactMarkup(data: BrandData, colors: ReturnType<typeof palette>): string {
  const scribbles = M_COMPACT_SCRIBBLE_LAYERS.map((layer) => {
    const chain = fourierPartialBezier(data.m, layer.partialIndex, 64, layer.amplitudeScale);
    return `<path d="${bezierPathData(chain)}" transform="translate(0 ${layer.offsetY})" fill="none" stroke="${colors.gold}" stroke-width="${layer.width}" stroke-linecap="round" stroke-linejoin="round" opacity="${layer.opacity}" data-m-layer="scribble"/>`;
  }).join("");
  const core = `<path d="${bezierPathData(fourierCompactBezier(data.m))}" fill="none" stroke="${colors.ivory}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="1" data-m-layer="core"/>`;
  return `${scribbles}${core}`;
}

function chordMarkup(network: ChordNetwork, color: string, luminous: boolean, profile: OpticalProfile): string {
  const simplified = profile !== "display";
  const chords = profile === "micro" ? network.chords.slice(0, 7) : network.chords;
  const chordLines = chords.map((chord) => {
    const start = network.anchors[chord.a];
    const end = network.anchors[chord.b];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    const inset = 1.7;
    const weight = chord.weight ?? 0.55;
    const haloWidth = O_DISPLAY_MATERIAL.chord.haloWidth * (0.7 + weight * 0.6);
    const coreWidth = O_DISPLAY_MATERIAL.chord.coreWidthBase + weight * O_DISPLAY_MATERIAL.chord.coreWidthWeight;
    const coreOpacity = 0.38 + weight * 0.46;
    const a = { x: start.x + (dx / length) * inset, y: start.y + (dy / length) * inset };
    const b = { x: end.x - (dx / length) * inset, y: end.y - (dy / length) * inset };
    return luminous
      ? `${polyline([a, b], color, haloWidth, O_DISPLAY_MATERIAL.chord.haloOpacity)}${polyline([a, b], color, coreWidth, coreOpacity)}`
      : polyline([a, b], color, profile === "micro" ? 2.15 : profile === "compact" ? 1.65 : 0.9, profile === "micro" ? 0.68 : 0.55, "", simplified);
  });

  const anchors = profile === "micro" ? [] : network.anchors.map((point) => luminous
    ? `${node(point, color, O_DISPLAY_MATERIAL.anchor.haloRadius, O_DISPLAY_MATERIAL.anchor.haloOpacity)}${node(point, BRAND_COLORS.highlight, O_DISPLAY_MATERIAL.anchor.coreRadius, O_DISPLAY_MATERIAL.anchor.coreOpacity, ` filter="url(#thom-o-glow)"`)}`
    : node(point, color, 1.15, 0.8));
  const intersections = profile === "micro" ? [] : network.intersections.map((point) => node(point, color, luminous ? O_DISPLAY_MATERIAL.intersection.radius : 0.85, luminous ? O_DISPLAY_MATERIAL.intersection.opacity : 0.78));
  const highlights = luminous ? network.highlights.map((point) => `${node(point, color, O_DISPLAY_MATERIAL.highlight.haloRadius, O_DISPLAY_MATERIAL.highlight.haloOpacity)}${node(point, BRAND_COLORS.highlight, O_DISPLAY_MATERIAL.highlight.coreRadius, O_DISPLAY_MATERIAL.highlight.coreOpacity, ` filter="url(#thom-o-glow)"`)}`) : [];
  return [...chordLines, ...anchors, ...intersections, ...highlights].join("");
}

export function renderGlyphContent(data: BrandData, glyph: "t" | "h" | "o" | "m", theme: SvgTheme = "dark", profile: OpticalProfile = "display"): string {
  const colors = palette(theme);
  const luminous = theme === "dark" && profile === "display";
  const fill = luminous ? "url(#thom-metal)" : colors.ivory;

  if (glyph === "t") return data.pi.displayContours
    .map((contour) => piPath(contour, luminous ? "url(#thom-pi-metal)" : fill, luminous))
    .join("");
  if (glyph === "h") {
    const hFill = luminous ? "url(#thom-h-metal)" : fill;
    const pillarStroke = profile === "micro" ? 1.4 : profile === "compact" ? 1 : 0;
    const pillars = data.h.paths.map((path) => filledPath(path, hFill, luminous, pillarStroke)).join("");
    if (profile !== "display") {
      if (profile === "micro") {
        const start = data.h.proportion.a[0];
        const end = data.h.proportion.b.at(-1)!;
        const crossbar = polyline([start, end], colors.gold, 1.85, 0.9, ` data-h-part="crossbar"`, true);
        return `${pillars}${crossbar}`;
      }
      const a = polyline(data.h.proportion.a, colors.gold, 1.35, 1, ` data-h-part="a"`, true);
      const b = polyline(data.h.proportion.b, colors.gold, 1.35, 1, ` data-h-part="b"`, true);
      return `${pillars}${a}${b}`;
    }
    const construction = luminous
      ? `${hLuminousLine(data.h.proportion.a, BRAND_COLORS.highlight, H_MATERIAL.a, "a")}${hLuminousLine(data.h.proportion.b, BRAND_COLORS.highlight, H_MATERIAL.b, "b")}${data.h.proportion.ticks.map((tick, index) => hLuminousLine(tick, BRAND_COLORS.gold, H_MATERIAL.tick, `tick-${index}`)).join("")}${hLuminousLine(data.h.proportion.brace, BRAND_COLORS.gold, H_MATERIAL.brace, "unit-brace")}`
      : `${polyline(data.h.proportion.a, colors.gold, hStrokeWorldWidth(H_MATERIAL.a.coreWidth), 1, ` data-h-part="a"`, true)}${polyline(data.h.proportion.b, colors.gold, hStrokeWorldWidth(H_MATERIAL.b.coreWidth), 1, ` data-h-part="b"`, true)}${data.h.proportion.ticks.map((tick, index) => polyline(tick, colors.gold, hStrokeWorldWidth(0.72), 0.78, ` data-h-part="tick-${index}"`, true)).join("")}${polyline(data.h.proportion.brace, colors.gold, hStrokeWorldWidth(0.66), 0.68, ` data-h-part="unit-brace"`, true)}`;
    const ratioPoint = luminous
      ? ellipse(data.h.proportion.ratioPoint, BRAND_COLORS.gold, H_RATIO_POINT_SHAPE.radiusX, H_RATIO_POINT_SHAPE.radiusY, H_RATIO_POINT_MATERIAL.opacity, ` data-h-part="ratio-point"`)
      : ellipse(data.h.proportion.ratioPoint, colors.gold, H_RATIO_POINT_SHAPE.radiusX, H_RATIO_POINT_SHAPE.radiusY, 0.78, ` data-h-part="ratio-point"`);
    return `${pillars}${construction}${ratioPoint}`;
  }
  if (glyph === "o") {
    const network = profile === "display" ? data.o.canonical : data.o.compact;
    const circle = luminous ? oCircleMarkup(data.o.circle) : polyline(data.o.circle, colors.ivory, profile === "micro" ? 3.4 : profile === "compact" ? 2.8 : O_DISPLAY_MATERIAL.circle.coreWidth, 1, "", true);
    return `${circle}${chordMarkup(network, colors.gold, luminous, profile)}`;
  }
  if (profile === "compact") return mCompactMarkup(data, colors);
  if (profile === "micro") return `<path d="${bezierPathData(fourierCompactBezier(data.m))}" fill="none" stroke="${colors.ivory}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" opacity="1"/>`;
  return mDisplayMarkup(data, colors, luminous);
}

export function renderLogoContent(data: BrandData, theme: SvgTheme = "dark", profile: OpticalProfile = "display"): string {
  return (["t", "h", "o", "m"] as const).map((glyph) => {
    const placement = data.placements[glyph];
    const x = placement.x + OPTICAL_PLACEMENT_X[profile][glyph];
    return `<g transform="translate(${x} ${placement.y}) scale(${placement.scaleX} ${placement.scaleY})">${renderGlyphContent(data, glyph, theme, profile)}</g>`;
  }).join("");
}

function svgShell(viewBox: string, content: string, theme: SvgTheme, profile: OpticalProfile, background?: string, width?: number, height?: number): string {
  const dimensions = width && height ? ` width="${width}" height="${height}"` : "";
  const backgroundRect = background && background !== "transparent" ? `<rect width="100%" height="100%" fill="${background}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"${dimensions} role="img" aria-labelledby="title" data-optical-profile="${profile}"><title id="title">THOM</title>${defs(theme, profile)}${backgroundRect}${content}</svg>`;
}

export function renderLogoSvg(data: BrandData, theme: SvgTheme = "dark", profile: OpticalProfile = "display"): string {
  return svgShell(`0 0 ${data.master.width} ${data.master.height}`, renderLogoContent(data, theme, profile), theme, profile);
}

export function renderGlyphSvg(data: BrandData, glyph: "t" | "h" | "o" | "m", theme: SvgTheme = "dark", profile: OpticalProfile = "display"): string {
  if (glyph === "m") {
    const placement = data.placements.m;
    const content = `<g transform="translate(0 ${placement.y}) scale(${placement.scaleX} ${placement.scaleY})">${renderGlyphContent(data, glyph, theme, profile)}</g>`;
    return svgShell(`0 0 ${data.placements.m.width} 120`, content, theme, profile);
  }
  if (glyph === "h") {
    const view = H_ISOLATED_VIEW;
    const content = `<g transform="scale(${view.scaleX} 1)">${renderGlyphContent(data, glyph, theme, profile)}</g>`;
    return svgShell(`${view.x} ${view.y} ${view.width} ${view.height}`, content, theme, profile);
  }
  if (glyph === "t") {
    const placement = data.placements.t;
    const content = `<g transform="translate(0 ${placement.y}) scale(${placement.scaleX} ${placement.scaleY})">${renderGlyphContent(data, glyph, theme, profile)}</g>`;
    return svgShell("-10 0 120 120", content, theme, profile);
  }
  const placement = data.placements.o;
  const content = `<g transform="translate(0 ${placement.y}) scale(${placement.scaleX} ${placement.scaleY})">${renderGlyphContent(data, glyph, theme, profile)}</g>`;
  return svgShell("-16 0 120 120", content, theme, profile);
}

export function renderFaviconSvg(data: BrandData): string {
  const content = `<g transform="translate(9 4) scale(.82 .92)">${renderGlyphContent(data, "t", "dark", "micro")}</g>`;
  return svgShell("0 0 100 120", content, "dark", "micro", BRAND_COLORS.background);
}

export function renderAvatarSvg(data: BrandData): string {
  const content = `<circle cx="64" cy="64" r="53" fill="none" stroke="${BRAND_COLORS.gold}" stroke-width="1.5" opacity=".7"/><g transform="translate(23 11) scale(.82 .88)">${renderGlyphContent(data, "t", "dark", "compact")}</g>`;
  return svgShell("0 0 128 128", content, "dark", "compact", BRAND_COLORS.background, 512, 512);
}

export function renderOpenGraphSvg(data: BrandData): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    ${defs("dark", "display")}
    <rect width="1200" height="630" fill="${BRAND_COLORS.background}"/>
    <circle cx="1080" cy="-10" r="390" fill="none" stroke="${BRAND_COLORS.gold}" stroke-width="1" opacity=".16"/>
    <circle cx="1080" cy="-10" r="280" fill="none" stroke="${BRAND_COLORS.gold}" stroke-width="1" opacity=".1"/>
    <g transform="translate(101 188) scale(2.15)">${renderLogoContent(data)}</g>
    <text x="104" y="532" fill="${BRAND_COLORS.muted}" font-family="IBM Plex Mono, monospace" font-size="22" letter-spacing="5">TH-M.CODES</text>
    <line x1="104" y1="558" x2="1096" y2="558" stroke="${BRAND_COLORS.gold}" stroke-width="1" opacity=".28"/>
  </svg>`;
}
