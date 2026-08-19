# Blog Graph Assets Agent Contract

## Operational Flow

Change the owning graph inputs or generator, regenerate the SVG/PNG pair, and
review the editorial alt text and caption whenever the visual meaning changes.

## Required Verification Parameters Within Nested Context

Run the matching graph generator, confirm both files are produced, and run
`graph:typecheck`, `graph:test`, and `blogs:publish` when a public article uses
the assets.

## Required Invariants Within Folder Context

Each publication master has a paired 2× PNG. Assets remain blog-owned outputs;
generation implementation stays in `tools/graph`.
