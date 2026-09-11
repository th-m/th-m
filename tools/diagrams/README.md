# THOM Diagrams

## Purpose

Use Diagram Design's editorial grammars and Fireworks Tech Graph's technical
patterns with THOM colors, typography, and draw-then-flow animation.

## Ontology

This local Bun/Nx tool installs pinned upstream source under the ignored
`.bun-tmp/diagram-tools` directory. It generates a THOM style guide for agents,
uses Fireworks' actual JSON-to-SVG generator, and passes SVG from either source
through `@th-m/diagram-theme`. The tool owns offline HTML, PNG, and GIF export.
Source content stays editable; reports distinguish upstream geometry checks
from THOM adaptation. It does not deploy or change existing article figures.

## Key Terms

- **Engine:** `fireworks` for generated JSON, `diagram-design` for authored SVG/HTML.
- **Motion:** `none` (default), `draw`, or `flow`; complete static HTML loads first.
- **Theme override:** JSON with optional `colors`, `fonts`, `easing`, and `series`
  matching `DiagramThemeOverrides`. Colors are six-digit hex strings.
- **Output stem:** explicit workspace path; outputs append `.svg`, `@2x.png`,
  `.html`, `.receipt.json`, and optionally `.gif`.

Install dependencies with `bun install`, then set up both upstream tools:

```sh
bun run nx run diagrams:setup
```

Setup installs the Playwright Chromium used for font-faithful export. Python 3
is needed for Fireworks generation; FFmpeg is needed only for GIF export.
Upstream licenses remain with their pinned source copies. Setup does not change
global skills or profiles. The checked-in `.agents/skills/thom-diagrams/SKILL.md`
routes future tasks to both local upstream skills and the generated brand guide.

Generate the Fireworks tool-grounding example (an upstream fixture with the
original labels and topology, reskinned as THOM):

```sh
bun run nx run diagrams:gen -- --engine fireworks --mode agent --input .bun-tmp/diagram-tools/fireworks-tech-graph/fixtures/tool-call-style2.json --output tools/diagrams/dist/tool-flow --motion flow --gif
```

Generate an editorial pipeline or feedback loop:

```sh
bun run nx run diagrams:gen -- --engine diagram-design --input tools/diagrams/examples/pipeline.svg --output tools/diagrams/dist/pipeline --motion flow --gif
bun run nx run diagrams:gen -- --engine diagram-design --input tools/diagrams/examples/loop.html --output tools/diagrams/dist/loop --motion draw
```

Choose any relevant upstream pattern reference before authoring a new diagram.

The [writing process](../../libs/blogs/writing-process.md) example aligns five
stages with the artifacts they create or modify, working conventions, and GitHub
checkpoints:

```sh
bun run nx run diagrams:gen -- --engine diagram-design --input tools/diagrams/examples/writing-process.svg --output tools/diagrams/dist/writing-process --motion flow
```

For editorial inputs, provide one SVG, or an HTML file containing exactly one
SVG. The exporter intentionally captures the diagram, not surrounding HTML
editorial cards. Use `data-thom-role="accent"` and optionally
`data-thom-attribute="stroke"` on shapes; CSS variables from the generated guide
also work. Label animated paths with `data-graph-role="edge"`,
`data-motion-stage`, and `data-motion-order`.

Add `--theme path/to/theme.json` to override roles consistently across all output
formats. The default fonts are embedded for offline use. Font overrides must
name locally available fonts or include fallbacks; custom font embedding is not
provided. Verify actual font appearance before sharing customized output.

Preview a generated HTML file with `bun run nx run diagrams:start -- --input
tools/diagrams/dist/pipeline.html`, then open `http://127.0.0.1:5193`.

The generated HTML provides Play/Pause, Restart, Complete view, and a timeline.
Reduced motion disables playback and retains every node and connection. GIFs
cannot honor browser motion preferences; publish their static SVG/PNG alternative
alongside them. The HTML includes no remote requests.

Read [UPSTREAMS.md](UPSTREAMS.md) for source pins, supported adaptation boundaries,
and the difference between upstream GIF presets and THOM playback.
