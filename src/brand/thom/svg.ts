import type { BrandData, ChordNetwork, FilledPath, PathCommand, Point } from "./geometry";
import { BRAND_COLORS, M_FINAL_MATERIAL, scaleFourierLayer } from "./geometry";

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

const filledPath = (path: FilledPath, fill: string, luminous: boolean) =>
  `<path d="${pathData(path)}" fill="${fill}"${luminous ? ` stroke="${BRAND_COLORS.gold}" stroke-width=".34" filter="url(#thom-fill-glow)"` : ""}/>`;

const polyline = (points: Point[], stroke: string, width: number, opacity = 1, extra = "") =>
  `<polyline points="${pointList(points)}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}" vector-effect="non-scaling-stroke"${extra}/>`;

const node = (point: Point, fill: string, radius: number, opacity = 1, extra = "") =>
  `<circle cx="${point.x.toFixed(3)}" cy="${point.y.toFixed(3)}" r="${radius}" fill="${fill}" opacity="${opacity}"${extra}/>`;

function palette(theme: SvgTheme) {
  if (theme === "light") return { background: BRAND_COLORS.lightBackground, ivory: BRAND_COLORS.lightInk, gold: BRAND_COLORS.lightGold, highlight: BRAND_COLORS.lightInk };
  if (theme === "monochrome") return { background: "transparent", ivory: "#000000", gold: "#000000", highlight: "#000000" };
  return { background: BRAND_COLORS.background, ivory: BRAND_COLORS.ivory, gold: BRAND_COLORS.gold, highlight: BRAND_COLORS.highlight };
}

function defs(theme: SvgTheme, compact: boolean): string {
  if (theme !== "dark" || compact) return "";
  return `<defs>
    <linearGradient id="thom-metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BRAND_COLORS.shadow}"/>
      <stop offset=".28" stop-color="${BRAND_COLORS.gold}"/>
      <stop offset=".49" stop-color="${BRAND_COLORS.highlight}"/>
      <stop offset=".7" stop-color="${BRAND_COLORS.ivory}"/>
      <stop offset="1" stop-color="${BRAND_COLORS.shadow}"/>
    </linearGradient>
    <linearGradient id="thom-m-highlight" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${BRAND_COLORS.shadow}"/>
      <stop offset=".08" stop-color="${BRAND_COLORS.gold}"/>
      <stop offset=".14" stop-color="${BRAND_COLORS.highlight}"/>
      <stop offset=".86" stop-color="${BRAND_COLORS.highlight}"/>
      <stop offset=".92" stop-color="${BRAND_COLORS.gold}"/>
      <stop offset="1" stop-color="${BRAND_COLORS.shadow}"/>
    </linearGradient>
    <filter id="thom-fill-glow" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.35" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 .17 0 .72 0 0 .08 0 0 .38 0 .02 0 0 0 .34 0" result="warm"/>
      <feMerge><feMergeNode in="warm"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="thom-line-glow" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="2.2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;
}

function luminousLine(points: Point[], core: string, width = 1.2, opacity = 1): string {
  return `${polyline(points, BRAND_COLORS.gold, width * 4.6, opacity * 0.09)}${polyline(points, BRAND_COLORS.gold, width * 1.9, opacity * 0.34)}${polyline(points, core, width, opacity, ` filter="url(#thom-line-glow)"`)}`;
}

function mDisplayMarkup(data: BrandData, colors: ReturnType<typeof palette>, luminous: boolean): string {
  const baseline = data.m.coefficients[0].a / 2;
  const partials = data.m.restingLayers.map((layer) => {
    const points = scaleFourierLayer(data.m.partialSums[layer.partialIndex], baseline, layer.amplitudeScale);
    const halo = luminous && layer.haloOpacity > 0 ? polyline(points, BRAND_COLORS.gold, layer.haloWidth, layer.haloOpacity) : "";
    return `${halo}${polyline(points, luminous ? BRAND_COLORS.gold : colors.ivory, layer.width, layer.opacity)}`;
  }).join("");
  const final = luminous
    ? `${polyline(data.m.hero, BRAND_COLORS.gold, M_FINAL_MATERIAL.halo.width, M_FINAL_MATERIAL.halo.opacity)}${polyline(data.m.hero, BRAND_COLORS.gold, M_FINAL_MATERIAL.middle.width, M_FINAL_MATERIAL.middle.opacity)}${polyline(data.m.hero, "url(#thom-m-highlight)", M_FINAL_MATERIAL.core.width, M_FINAL_MATERIAL.core.opacity, ` filter="url(#thom-line-glow)"`)}`
    : polyline(data.m.hero, colors.ivory, 1.35, 0.96);
  return `${partials}${final}`;
}

function chordMarkup(network: ChordNetwork, color: string, luminous: boolean): string {
  const chordLines = network.chords.map((chord) => {
    const start = network.anchors[chord.a];
    const end = network.anchors[chord.b];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    const inset = 1.7;
    const a = { x: start.x + (dx / length) * inset, y: start.y + (dy / length) * inset };
    const b = { x: end.x - (dx / length) * inset, y: end.y - (dy / length) * inset };
    return luminous
      ? `${polyline([a, b], color, 2.4, 0.045)}${polyline([a, b], color, 0.76, 0.44)}`
      : polyline([a, b], color, 0.9, 0.55);
  });

  const anchors = network.anchors.map((point) => luminous
    ? `${node(point, color, 3.5, 0.08)}${node(point, BRAND_COLORS.highlight, 1.02, 0.94, ` filter="url(#thom-line-glow)"`)}`
    : node(point, color, 1.15, 0.8));
  const intersections = network.intersections.map((point) => node(point, color, luminous ? 0.72 : 0.85, luminous ? 0.58 : 0.78));
  const highlights = luminous ? network.highlights.map((point) => `${node(point, color, 4.2, 0.11)}${node(point, BRAND_COLORS.highlight, 1.25, 1, ` filter="url(#thom-line-glow)"`)}`) : [];
  return [...chordLines, ...anchors, ...intersections, ...highlights].join("");
}

export function renderGlyphContent(data: BrandData, glyph: "t" | "h" | "o" | "m", theme: SvgTheme = "dark", compact = false): string {
  const colors = palette(theme);
  const luminous = theme === "dark" && !compact;
  const fill = luminous ? "url(#thom-metal)" : colors.ivory;

  if (glyph === "t") return filledPath(compact ? data.pi.compact : data.pi.display, fill, luminous);
  if (glyph === "h") {
    const pillars = data.h.paths.map((path) => filledPath(path, fill, luminous)).join("");
    if (compact) return `${pillars}${polyline(data.h.curve, colors.gold, 1.2)}`;
    const axis = polyline(data.h.axis, colors.gold, 0.72, luminous ? 0.22 : 0.35, ` stroke-dasharray="3 4"`);
    const curves = luminous
      ? `${luminousLine(data.h.curve, BRAND_COLORS.highlight, 1.15)}${luminousLine(data.h.companion, BRAND_COLORS.ivory, 0.72, 0.72)}`
      : `${polyline(data.h.curve, colors.gold, 1.15)}${polyline(data.h.companion, colors.gold, 0.72, 0.72)}`;
    const midpoint = luminous
      ? `${node(data.h.midpoint, colors.gold, 5.4, 0.16)}${node(data.h.midpoint, colors.highlight, 1.85, 1, ` filter="url(#thom-line-glow)"`)}`
      : node(data.h.midpoint, colors.gold, 1.75);
    return `${axis}${pillars}${curves}${midpoint}`;
  }
  if (glyph === "o") {
    const network = compact ? data.o.compact : data.o.canonical;
    const circle = luminous ? luminousLine(data.o.circle, BRAND_COLORS.ivory, 1.05) : polyline(data.o.circle, colors.ivory, compact ? 1.35 : 1.15);
    return `${circle}${chordMarkup(network, colors.gold, luminous)}`;
  }
  if (compact) return polyline(data.m.compact, colors.ivory, 1.8);
  return mDisplayMarkup(data, colors, luminous);
}

export function renderLogoContent(data: BrandData, theme: SvgTheme = "dark", compact = false): string {
  return (["t", "h", "o", "m"] as const).map((glyph) => {
    const placement = data.placements[glyph];
    return `<g transform="translate(${placement.x} 0) scale(${placement.scaleX} 1)">${renderGlyphContent(data, glyph, theme, compact)}</g>`;
  }).join("");
}

function svgShell(viewBox: string, content: string, theme: SvgTheme, compact: boolean, background?: string, width?: number, height?: number): string {
  const dimensions = width && height ? ` width="${width}" height="${height}"` : "";
  const backgroundRect = background && background !== "transparent" ? `<rect width="100%" height="100%" fill="${background}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"${dimensions} role="img" aria-labelledby="title"><title id="title">THOM</title>${defs(theme, compact)}${backgroundRect}${content}</svg>`;
}

export function renderLogoSvg(data: BrandData, theme: SvgTheme = "dark", compact = false): string {
  return svgShell(`0 0 ${data.master.width} ${data.master.height}`, renderLogoContent(data, theme, compact), theme, compact);
}

export function renderGlyphSvg(data: BrandData, glyph: "t" | "h" | "o" | "m", theme: SvgTheme = "dark", compact = false): string {
  if (glyph === "m") {
    const content = `<g transform="scale(${data.placements.m.scaleX} 1)">${renderGlyphContent(data, glyph, theme, compact)}</g>`;
    return svgShell(`0 0 ${data.placements.m.width} 120`, content, theme, compact);
  }
  return svgShell("0 0 100 120", renderGlyphContent(data, glyph, theme, compact), theme, compact);
}

export function renderFaviconSvg(data: BrandData): string {
  const content = `<g transform="translate(9 4) scale(.82 .92)">${renderGlyphContent(data, "t", "dark", true)}</g>`;
  return svgShell("0 0 100 120", content, "dark", true, BRAND_COLORS.background);
}

export function renderAvatarSvg(data: BrandData): string {
  const content = `<circle cx="64" cy="64" r="53" fill="none" stroke="${BRAND_COLORS.gold}" stroke-width="1.5" opacity=".7"/><g transform="translate(23 11) scale(.82 .88)">${renderGlyphContent(data, "t", "dark", true)}</g>`;
  return svgShell("0 0 128 128", content, "dark", true, BRAND_COLORS.background, 512, 512);
}

export function renderOpenGraphSvg(data: BrandData): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    ${defs("dark", false)}
    <rect width="1200" height="630" fill="${BRAND_COLORS.background}"/>
    <circle cx="1080" cy="-10" r="390" fill="none" stroke="${BRAND_COLORS.gold}" stroke-width="1" opacity=".16"/>
    <circle cx="1080" cy="-10" r="280" fill="none" stroke="${BRAND_COLORS.gold}" stroke-width="1" opacity=".1"/>
    <g transform="translate(101 188) scale(2.4)">${renderLogoContent(data)}</g>
    <text x="104" y="532" fill="${BRAND_COLORS.muted}" font-family="IBM Plex Mono, monospace" font-size="22" letter-spacing="5">TH-M.CODES</text>
    <line x1="104" y1="558" x2="1096" y2="558" stroke="${BRAND_COLORS.gold}" stroke-width="1" opacity=".28"/>
  </svg>`;
}
