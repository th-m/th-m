# TH-M Workspace

## Purpose

This Bun and Nx monorepo owns Thomas Valadez's personal sites, editorial work,
content-generation tools, and the small libraries that support them. Each
runnable project owns its source, tests, configuration, and generated output.

Install dependencies with `bun install`. Discover projects with
`bun run nx show projects`, then run a project target with
`bun run nx run <project>:<target>`.

The repository root is also an Obsidian vault. Blog authoring starts with
`bun run nx run blogs:start`.

## Ontology

| Owner | Meaning |
| --- | --- |
| [`apps/`](apps/README.md) | Deployable personal products and their content. |
| [`libs/`](libs/README.md) | Reusable, non-deployable capabilities with typed public APIs; `blogs` owns the essays' editorial content and publication pipeline. |
| [`tools/`](tools/README.md) | Local authoring applications that generate durable content artifacts. |
| [`netlify/`](netlify/README.md) | Future hosting and delivery configuration for the apps. |

An **app** produces a site artifact, a **tool** produces author-owned content,
and a **library** provides reusable behavior without owning a runtime. Nx
projects are configured in their package manifests; structural directories are
documentation and routing boundaries rather than coordinator projects.

## Key Terms

- **Owner:** the nearest app, tool, or library responsible for source, tests,
  configuration, and operational documentation.
- **Publish:** build an app- or library-owned local artifact in `dist`; it does
  not deploy remotely.
- **Generate (`gen`):** transform explicit tool input into paired SVG and PNG
  content artifacts.
- **Start:** launch the local authoring or development experience.
- **Canonical verification:** the owning project's `typecheck` and unit `test`
  targets.
