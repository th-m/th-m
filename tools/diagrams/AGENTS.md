# Diagrams Agent Contract

## Operational Flow

Use the pinned upstream tools and shared diagram-theme package. Resolve all
input and output paths within this worktree, including symlink targets. Keep
source artifacts and receipts distinct from generated themed exports.

### Setup, generation, and preview

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

## Required Verification Parameters Within Nested Context

Run `diagrams:typecheck` and `diagrams:test`, then `diagrams:gen` for each affected
engine. Inspect PNGs and verify playback and reduced motion in generated HTML.
Run `testing:test` for documentation changes.

## Required Invariants Within Folder Context

Repository scripts use Bun TypeScript; upstream Python is invoked as an external
tool. Install only the revisions in upstreams.ts. Inputs remain unchanged.
Output paths must be explicit. Upstream scene validation is never claimed for
the separate THOM animation adapter.
