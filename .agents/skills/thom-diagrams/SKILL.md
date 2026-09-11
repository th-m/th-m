---
name: thom-diagrams
description: Create THOM-branded editorial or technical diagrams using Diagram Design patterns and Fireworks Tech Graph generators, including static exports and draw/flow animation. Use for article figures, architecture, feedback loops, workflows, and diagram theming in th-m.
---

# THOM diagrams

Work from the th-m root. Read the [diagrams README](../../../tools/diagrams/README.md)
for output contracts and [AGENTS](../../../tools/diagrams/AGENTS.md) for commands.
Use the installed pinned sources when available. If `.bun-tmp/diagram-tools`
is absent and setup is in scope, run `bun run nx run diagrams:setup`.

Read `libs/thom-brand/agent-design-instruction-guidelines.md` and the generated
`tools/diagrams/dist/theme/style-guide.md`. THOM's foundation and user overrides
are authoritative over both upstream skins. This workspace already requests
THOM branding; use these values without another upstream onboarding question.
Regenerate the profile with `diagrams:setup` after foundation changes.

Choose by communication goal:

- Editorial relationships, comparisons, flowcharts, and loops: read
  `.bun-tmp/diagram-tools/diagram-design/skills/diagram-design/SKILL.md` and the
  relevant `references/type-*.md`. Apply its layout grammar with the THOM guide.
- Architecture, UML, agent workflows, cloud, events, and operational diagrams:
  read `.bun-tmp/diagram-tools/fireworks-tech-graph/SKILL.md` and the relevant
  reference/schema. Use the actual Fireworks JSON generator.
- Combined output: use Diagram Design's composition and semantic edges for
  Fireworks-inspired draw-then-flow motion. Sample fixtures are examples, not
  evidence of the user's architecture.

Keep editable sources with their owning article or tool. Use explicit workspace
paths with `diagrams:gen`. Editorial SVG uses theme CSS variables or
`data-thom-role` attributes. Annotate animated paths with
`data-graph-role="edge"`, `data-motion-stage`, and `data-motion-order`.
HTML inputs must contain one SVG; surrounding editorial cards are not exported.

Motion defaults to `none`. Choose `draw` for construction or `flow` for
construction followed by directed packets; add `--gif` for GIF. These use the
THOM adapter described in `tools/diagrams/UPSTREAMS.md`. The original Fireworks
GIF engine remains available for its supported, unmodified scenes.

Inspect PNG at reading size and exercise playback, pause, restart, and reduced
motion in HTML. Check fonts, full text, routes, and contrast. Report artifact
paths and receipt limitations. Keep a static equivalent alongside GIF. Article
embedding follows `article-assets.ts` registration and the owner's checks.
