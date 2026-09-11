import { diagramCss, type DiagramTheme } from "./index";

const SVG_NS = "http://www.w3.org/2000/svg";
const safeTags = new Set("svg g defs title desc metadata style rect circle ellipse path line polyline polygon text tspan marker pattern linearGradient radialGradient stop clipPath mask filter feGaussianBlur feDropShadow feOffset feMerge feMergeNode feColorMatrix feBlend feComposite feFlood".split(" "));

/** Parse without executing source HTML, scripts, event handlers, or remote resources. */
export function themeSvg(source: string, engine: "fireworks" | "diagram-design", theme: DiagramTheme, fontCss = ""): string {
  if (/<!doctype html|<html[\s>]/i.test(source)) {
    const html = new DOMParser().parseFromString(source, "text/html");
    const candidates = html.querySelectorAll("svg");
    if (candidates.length !== 1) throw new Error("HTML input must contain exactly one SVG");
    const svg = candidates[0]!;
    const style = document.createElementNS(SVG_NS, "style");
    // Retain diagram classes from HTML templates; scope rules to the SVG.
    const css = Array.from(html.querySelectorAll("head style")).map(el => el.textContent ?? "").join("\n");
    if (/@|expression|[<>\\]/i.test(css) || /url\s*\((?!\s*#[\w:.-]+\s*\))/i.test(css)) throw new Error("Editorial CSS must be local and inert");
    const sheet = new CSSStyleSheet(); sheet.replaceSync(css);
    style.textContent = Array.from(sheet.cssRules).filter(rule => rule instanceof CSSStyleRule).map(rule => {
      const r = rule as CSSStyleRule;
      return r.selectorText.split(",").map(selector => {
        const s = selector.trim();
        return s === ":root" || s === "svg" ? "svg" : `svg ${s}`;
      }).join(",") + `{${r.style.cssText}}`;
    }).join("\n");
    svg.prepend(style);
    source = new XMLSerializer().serializeToString(svg);
  }
  const parsed = new DOMParser().parseFromString(source, "image/svg+xml");
  const root = parsed.documentElement;
  if (root.localName !== "svg" || parsed.querySelector("parsererror") || /<!DOCTYPE|<!ENTITY/i.test(source)) throw new Error("Expected a self-contained SVG");
  for (const el of [root, ...Array.from(root.querySelectorAll("*"))]) {
    if (!safeTags.has(el.localName) || el.namespaceURI !== SVG_NS) throw new Error(`Unsupported SVG element: ${el.localName}`);
    for (const attr of Array.from(el.attributes)) {
      if (/^on/i.test(attr.name) || /href$/i.test(attr.name)) throw new Error(`External or executable SVG attribute: ${attr.name}`);
      if (/url\s*\(/i.test(attr.value) && !/^url\(#[\w:.-]+\)$/.test(attr.value)) throw new Error("SVG references must be local fragment IDs");
    }
    if (el.localName === "style" && (/@|expression|[<>\\]/i.test(el.textContent ?? "") || /url\s*\((?!\s*["']?#[\w:.-]+["']?\s*\))/i.test(el.textContent ?? ""))) throw new Error("Source SVG CSS must be local and inert; fonts are embedded by the generator");
  }
  const c = theme.colors;
  const flowColor = (flow: string) => {
    const index = ["read", "write", "data", "async", "feedback"].indexOf(flow);
    return flow === "control" ? c.accent : index >= 0 ? theme.series[index % theme.series.length]! : c.boundary;
  };
  const legendColors = new Map(Array.from(root.querySelectorAll('[data-graph-role="edge"][stroke][data-flow]')).map(edge => [edge.getAttribute("stroke"), flowColor(edge.getAttribute("data-flow")!)]));
  if (engine === "diagram-design") {
    const background = Array.from(root.querySelectorAll("rect")).find(el => !el.closest("defs"))?.getAttribute("fill");
    const dark = ["#2d3142", "#1c1917", "#141414"].includes(background ?? "");
    const palette: Record<string, string> = {
      "#2d3142": dark ? c.paper : c.ink, "#f5f5f5": dark ? c.ink : c.paper,
      "#1c1917": dark ? c.paper : c.ink, "#faf7f2": dark ? c.ink : c.paper,
      "#ffffff": c.surface, "#ececec": c.surface, "#393e53": c.surface,
      "#4f5d75": c.muted, "#bfc0c0": dark ? c.muted : c.boundary,
      "#7a8399": c.soft, "#8e98ac": c.soft,
      "#eb6c36": c.accent, "#f08a59": c.accent, "#f7591f": c.accent,
      "#2e5aa8": c.link, "#6a95d8": c.link,
    };
    const recolor = (value: string) => value.replace(/#[\da-f]{6}\b/gi, color => palette[color.toLowerCase()] ?? color);
    for (const el of Array.from(root.querySelectorAll("*"))) {
      for (const attr of ["fill", "stroke", "stop-color", "style"]) if (el.hasAttribute(attr)) el.setAttribute(attr, recolor(el.getAttribute(attr)!));
      if (el.localName === "style") el.textContent = recolor(el.textContent ?? "");
    }
  }
  for (const el of Array.from(root.querySelectorAll("*"))) {
    const shape = el as unknown as SVGElement;
    const role = el.getAttribute("data-thom-role") as keyof typeof c | null;
    if (role && !(role in c)) throw new Error(`Unknown THOM diagram role: ${role}`);
    if (el.localName === "rect" && !el.closest("defs")) { el.setAttribute("rx", "0"); el.removeAttribute("ry"); }
    if (engine === "fireworks" && !el.closest("defs")) {
      el.removeAttribute("filter");
      if (el.localName === "rect") { el.setAttribute("rx", "0"); el.removeAttribute("ry"); }
      if (el.localName === "text" || el.localName === "tspan") {
        shape.style.setProperty("fill", role ? c[role] : /title|node-title/.test(el.getAttribute("class") ?? "") ? c.ink : c.muted);
        el.removeAttribute("font-family");
      } else {
        if (el.hasAttribute("fill") && el.getAttribute("fill") !== "none") {
          const fill = el.getAttribute("data-graph-role") === "background" ? c.paper : el.closest('[data-graph-role="node"]') ? c.raised : c.surface;
          shape.style.setProperty("fill", role ? c[role] : fill);
          el.setAttribute("fill", role ? c[role] : fill);
        }
        if (el.hasAttribute("stroke") && el.getAttribute("stroke") !== "none") {
          const flow = el.getAttribute("data-flow");
          const color = role ? c[role] : el.getAttribute("data-graph-role") === "edge"
            ? flowColor(flow ?? "")
            : el.getAttribute("data-graph-role") === "decoration" ? legendColors.get(el.getAttribute("stroke")) ?? c.boundary
            : c.boundary;
          shape.style.setProperty("stroke", color);
          el.setAttribute("stroke", color);
        }
      }
    }
    // Explicit roles let editorial sources opt in without color guessing.
    if (role) {
      const attr = el.getAttribute("data-thom-attribute") === "stroke" ? "stroke" : "fill";
      shape.style.setProperty(attr, c[role]);
      el.setAttribute(attr, c[role]);
    }
  }
  // A marker can serve several edge colors; context-stroke keeps them consistent.
  if (engine === "fireworks") for (const el of Array.from(root.querySelectorAll("marker path, marker polygon"))) el.setAttribute("fill", "context-stroke");
  const style = parsed.createElementNS(SVG_NS, "style");
  style.textContent = `${fontCss}\n${diagramCss(theme)}`;
  root.appendChild(style);
  root.setAttribute("data-thom-diagram", engine);
  root.setAttribute("role", "img");
  if (!root.hasAttribute("aria-label") && !root.hasAttribute("aria-labelledby")) {
    root.setAttribute("aria-label", root.querySelector("title")?.textContent ?? root.querySelector("text.title")?.textContent ?? "Technical diagram");
  }
  return new XMLSerializer().serializeToString(root);
}

export type DiagramMotionMode = "none" | "draw" | "flow";
export interface DiagramPlayback { seek(seconds: number): void; play(): void; pause(): void; destroy(): void; duration: number }

function drawProgress(progress: number, easing: string): number {
  const match = easing.match(/^cubic-bezier\(([^)]+)\)$/);
  if (!match || progress === 0 || progress === 1) return progress;
  const values = match[1]!.split(",").map(Number);
  if (values.length !== 4 || values.some(value => !Number.isFinite(value))) return progress;
  const [x1,y1,x2,y2] = values as [number,number,number,number];
  const coordinate = (t: number, a: number, b: number) => 3*(1-t)*(1-t)*t*a + 3*(1-t)*t*t*b + t*t*t;
  let low=0, high=1;
  for (let i=0; i<16; i++) { const middle=(low+high)/2; if (coordinate(middle,x1,x2)<progress) low=middle; else high=middle; }
  return coordinate((low+high)/2,y1,y2);
}

/** THOM's draw-then-flow adapter; the untouched source is the static equivalent. */
export function mountDiagramMotion(svg: SVGSVGElement, mode: DiagramMotionMode, onPlaying?: (playing: boolean) => void, onTime?: (seconds: number) => void): DiagramPlayback {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const easing = getComputedStyle(svg).getPropertyValue("--ease-draw").trim();
  const edges = Array.from(svg.querySelectorAll<SVGGeometryElement>('[data-graph-role="edge"]'))
    .filter(el => typeof el.getTotalLength === "function")
    .sort((a,b) => Number(a.dataset.motionStage || 1) - Number(b.dataset.motionStage || 1) || Number(a.dataset.motionOrder || 0) - Number(b.dataset.motionOrder || 0));
  const overlays: { edge: SVGGeometryElement; clone: SVGGeometryElement; stream: SVGGeometryElement; length: number; visibility: string }[] = [];
  let frame = 0, elapsed = 0, started = 0, playing = false;
  const duration = 5.75;
  if (mode !== "none") for (const edge of edges) {
    const clone = edge.cloneNode(true) as SVGGeometryElement;
    const stream = edge.cloneNode(true) as SVGGeometryElement;
    for (const overlay of [clone, stream]) {
      for (const attr of Array.from(overlay.attributes)) if (attr.name === "id" || attr.name.startsWith("data-") || attr.name.startsWith("marker-") || attr.name === "filter") overlay.removeAttribute(attr.name);
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.pointerEvents = "none";
      overlay.style.visibility = "hidden";
      overlay.setAttribute("data-thom-motion", "overlay");
    }
    stream.style.setProperty("stroke", "var(--color-accent)");
    stream.style.setProperty("stroke-width", "3");
    stream.style.setProperty("stroke-dasharray", "8 24");
    edge.after(clone, stream);
    overlays.push({ edge, clone, stream, length: edge.getTotalLength(), visibility: edge.style.visibility });
  }
  const restore = () => { for (const o of overlays) { o.edge.style.visibility = o.visibility; o.clone.style.visibility = o.stream.style.visibility = "hidden"; } };
  const pause = () => { cancelAnimationFrame(frame); playing = false; onPlaying?.(false); };
  const seek = (seconds: number) => {
    elapsed = Math.max(0, Math.min(duration, seconds));
    onTime?.(elapsed);
    if (media.matches || mode === "none" || elapsed >= duration) { restore(); return; }
    overlays.forEach((o, index) => {
      const start = index / Math.max(1, overlays.length) * 1.4;
      const progress = Math.min(1, Math.max(0, (elapsed - start) / .4));
      o.edge.style.visibility = progress === 1 ? o.visibility : "hidden";
      o.clone.style.visibility = progress > 0 && progress < 1 ? "visible" : "hidden";
      o.clone.style.setProperty("stroke-dasharray", `${o.length} ${o.length}`);
      o.clone.style.setProperty("stroke-dashoffset", String(o.length * (1 - drawProgress(progress, easing))));
      o.stream.style.visibility = progress === 1 && mode === "flow" ? "visible" : "hidden";
      o.stream.style.setProperty("stroke-dashoffset", String(-elapsed * 70));
    });
  };
  const tick = (now: number) => { seek((now - started) / 1000); if (elapsed >= duration) { pause(); restore(); } else frame = requestAnimationFrame(tick); };
  const play = () => {
    if (media.matches || mode === "none" || !edges.length || playing) return;
    if (elapsed >= duration) elapsed = 0;
    playing = true; started = performance.now() - elapsed * 1000; onPlaying?.(true); frame = requestAnimationFrame(tick);
  };
  const motionChange = () => { pause(); restore(); };
  media.addEventListener("change", motionChange);
  return { duration, seek, play, pause, destroy() { pause(); restore(); overlays.forEach(o => { o.clone.remove(); o.stream.remove(); }); media.removeEventListener("change", motionChange); } };
}
