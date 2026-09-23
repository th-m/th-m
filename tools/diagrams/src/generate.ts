import { mkdir, mkdtemp, readFile, rename, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright";
import { createDiagramTheme, type DiagramThemeOverrides } from "@th-m/diagram-theme";
import { diagramIconFragments } from "@th-m/diagram-theme/export-icons";
import type { DiagramMotionMode } from "@th-m/diagram-theme/browser";
import { workspacePath } from "./paths";
import { assertUpstreams, upstreamRoot, upstreams } from "./upstreams";
import { run } from "./process";

export interface GenerateOptions { engine: "fireworks" | "diagram-design"; input: string; output: string; mode: string; motion: DiagramMotionMode; gif: boolean; theme?: string }

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]!);

async function bundle(path: string): Promise<string> {
  const build = await Bun.build({ entrypoints: [path], target: "browser", minify: true });
  if (!build.success) throw new Error(build.logs.join("\n"));
  return build.outputs[0]!.text();
}

async function fonts(): Promise<string> {
  const specs = [
    ["Inter Variable", "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", "100 900"],
    ["Newsreader Variable", "@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2", "200 800"],
    ["IBM Plex Mono", "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", "400"],
  ];
  return (await Promise.all(specs.map(async ([family,path,weight]) => {
    const bytes = await readFile(Bun.resolveSync(path!, import.meta.dir));
    return `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};src:url(data:font/woff2;base64,${bytes.toString("base64")}) format("woff2");}`;
  }))).join("\n");
}

export async function generate(workspace: string, options: GenerateOptions): Promise<void> {
  await assertUpstreams(workspace);
  const input = await workspacePath(workspace, options.input);
  const output = await workspacePath(workspace, options.output);
  const suffixes = [".svg", "@2x.png", ".html", ".receipt.json", ...(options.gif ? [".gif"] : []), ...(options.engine === "fireworks" ? [".source.svg", ".source-report.json"] : [])];
  for (const suffix of suffixes) {
    const destination = await workspacePath(workspace, `${output}${suffix}`);
    if (destination === input) throw new Error("Output would overwrite the source input");
  }
  const overrides = options.theme ? JSON.parse(await readFile(await workspacePath(workspace, options.theme), "utf8")) as DiagramThemeOverrides : {};
  const theme = createDiagramTheme(overrides);
  const source = await readFile(input, "utf8");
  await mkdir(dirname(output), { recursive: true });
  const staging = await mkdtemp(resolve(dirname(output), ".diagram-"));
  const base = resolve(staging, "diagram");
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
  try {
    let svg = source;
    let upstreamChecks: unknown = null;
    if (options.engine === "fireworks") {
      const cli = resolve(upstreamRoot(workspace, "fireworks-tech-graph"), "scripts/fireworks.py");
      await run(["python3", cli, "render", options.mode, input, `${base}.source.svg`, "--report", `${base}.source-report.json`]);
      upstreamChecks = JSON.parse(await run(["python3", cli, "check", `${base}.source.svg`]));
      const report = JSON.parse(await readFile(`${base}.source-report.json`, "utf8"));
      // The upstream report retains full labels even when visible text is shortened.
      if (report.typography?.truncated?.length > 0) throw new Error("Fireworks reported truncated text; repair the source before exporting");
      svg = await readFile(`${base}.source.svg`, "utf8");
    }
    const iconCss = (await readFile(Bun.resolveSync("@th-m/diagram-theme/icons.css", import.meta.dir), "utf8")).replace(/^@import.*$/gm, "");
    const fontCss = await fonts() + "\n" + iconCss;
    const icons = diagramIconFragments();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
    // No source code or external requests execute while parsing imported SVG/HTML.
    await page.route("**/*", route => route.abort());
    const adapterPath = resolve(staging, "adapter.ts");
    await Bun.write(adapterPath, `export { themeSvg } from ${JSON.stringify(resolve(workspace, "libs/diagram-theme/src/browser.ts"))};`);
    const adapter = await Bun.build({ entrypoints: [adapterPath], target: "browser", format: "esm" });
    if (!adapter.success) throw new Error(adapter.logs.join("\n"));
    await page.evaluate(async script => { const module = await import(URL.createObjectURL(new Blob([script], { type: "text/javascript" }))); (window as unknown as { adapt: unknown }).adapt = module.themeSvg; }, await adapter.outputs[0]!.text());
    const themed = await page.evaluate(({ svg, engine, theme, fontCss, icons }) => {
      return (window as unknown as { adapt: (source: string, engine: string, theme: unknown, fontCss: string, icons: Record<string, string>) => string }).adapt(svg, engine, theme, fontCss, icons);
    }, { svg, engine: options.engine, theme, fontCss, icons });
    await Bun.write(`${base}.svg`, themed);
    const runtime = await bundle(resolve(import.meta.dir, "viewer.ts"));
    const c = theme.colors;
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:; img-src data:;"><title>THOM diagram</title><style>
      ${fontCss}
      *{box-sizing:border-box}body{margin:0;background:${c.paper};color:${c.ink};font-family:${theme.fonts.sans}}
      main{max-width:1280px;margin:auto;padding:24px}header{font-family:${theme.fonts.mono};font-size:12px;letter-spacing:.12em;color:${c.muted};padding-bottom:16px;border-bottom:1px solid ${c.rule}}
      .canvas{overflow:auto;margin-top:24px}svg{display:block;width:100%;height:auto;min-width:700px}
      nav{display:flex;align-items:center;flex-wrap:wrap;gap:12px;padding:20px 0;border-top:1px solid ${c.rule}}
      button{font:inherit;color:${c.ink};background:${c.raised};border:1px solid ${c.boundary};padding:10px 16px;cursor:pointer}button:focus-visible,input:focus-visible{outline:2px solid ${c.accent};outline-offset:3px}button:disabled{opacity:.5;cursor:default}input{accent-color:${c.accent};max-width:100%}#status{font-size:12px;color:${c.muted}}
      @media(prefers-reduced-motion:reduce){[data-thom-motion]{display:none!important}}
    </style></head><body data-motion="${options.motion}"><main><header>THOM · ${escapeHtml(options.engine)} · ${escapeHtml(options.motion)}</header><div class="canvas">${themed}</div><nav aria-label="Diagram playback"><button id="play">Play</button><button id="restart">Restart</button><button id="complete">Complete view</button><label>Timeline <input id="timeline" type="range" min="0" max="5.75" step="0.05" value="5.75"></label><span id="status" role="status"></span></nav></main><script>${runtime.replace(/<\/script/gi, "<\\/script")}</script></body></html>`;
    await Bun.write(`${base}.html`, html);
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    if (options.motion !== "none" && await page.locator('svg [data-graph-role="edge"]').count() === 0) throw new Error("Motion requires explicit semantic edges; annotate the source or choose --motion none");
    const dimensions = await page.locator("svg").evaluate(el => { const box = (el as SVGSVGElement).viewBox.baseVal; return { width:box.width, height:box.height }; });
    if (!(dimensions.width > 0 && dimensions.height > 0 && dimensions.width <= 4096 && dimensions.height <= 4096)) throw new Error("SVG viewBox must have dimensions between 1 and 4096");
    await page.setViewportSize({ width: Math.ceil(dimensions.width + 48), height: Math.ceil(dimensions.height + 240) });
    await page.locator("svg").evaluate((el, width) => { (el as SVGSVGElement).style.width = `${width}px`; (el as SVGSVGElement).style.minWidth = "0"; }, dimensions.width);
    const textOverflow = await page.locator("svg").evaluate(el => Array.from(el.querySelectorAll<SVGTextElement>("text[data-text-max-width]")).filter(text => text.getComputedTextLength() > Number(text.dataset.textMaxWidth) + 1).map(text => text.textContent));
    if (textOverflow.length) throw new Error(`THOM fonts overflow source label boxes: ${textOverflow.join(", ")}`);
    await page.locator("svg").screenshot({ path: `${base}@2x.png` });
    let gifReceipt: unknown = null;
    if (options.gif) {
      await page.setViewportSize({ width: 1008, height: Math.ceil(dimensions.height / dimensions.width * 960 + 240) });
      await page.locator("svg").evaluate(el => { (el as SVGSVGElement).style.width = "960px"; });
      for (let index = 0; index < 115; index++) {
        await page.evaluate(seconds => window.thomDiagram.seek(seconds), index / 20);
        await page.locator("svg").screenshot({ path: resolve(staging, `frame-${String(index).padStart(3,"0")}.png`), scale: "css" });
      }
      await run(["ffmpeg", "-v", "error", "-y", "-framerate", "20", "-i", resolve(staging,"frame-%03d.png"), "-filter_complex", "split[a][b];[a]palettegen[p];[b][p]paletteuse", "-loop", "0", `${base}.gif`]);
      gifReceipt = JSON.parse(await run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,nb_frames,duration", "-of", "json", `${base}.gif`]));
    }
    await Bun.write(`${base}.receipt.json`, JSON.stringify({
      engine: options.engine, upstreams, input, motion: options.motion,
      motionImplementation: "THOM adapter; not upstream scene-preset validation",
      theme, dimensions, sourceChecks: upstreamChecks, themedTextOverflow: textOverflow,
      fonts: "Embedded Latin: Inter Variable, Newsreader Variable, IBM Plex Mono 400",
      gif: gifReceipt,
    }, null, 2) + "\n");
    for (const suffix of suffixes) await rename(`${base}${suffix}`, `${output}${suffix}`);
    console.log(`Generated ${suffixes.map(suffix => `${output}${suffix}`).join("\n")}`);
  } finally { await browser?.close(); await rm(staging, { recursive: true, force: true }); }
}
