# Testing Support

## Purpose

This library owns reusable unit and browser-test setup plus repository-wide
documentation and design-token contract checks.

## Boundaries

This library owns shared verification mechanisms and repository contract checks.
Product assertions stay with their owners. Structural checks establish document
integrity, not semantic correctness, output quality, or runtime permissions.

## Ontology

Testing support is reusable mechanism: DOM observer mocks, shared Playwright
project definitions, and structural policy checks. Product-specific assertions
and browser journeys remain beside their app or tool owner.

[`documentationViolations`](src/repository-policy.ts) returns `{ path, message }`
records for maintained README, AGENTS, and SKILL contracts. Its
[Markdown/YAML policy](src/documentation-policy.ts) checks ordered, unique
required sections, README/AGENTS pairing, local file links, skill metadata,
and skill routing from the root contract and catalog. Markdown syntax is
parsed with remark; YAML frontmatter is parsed with `yaml`.

The scan excludes named dependency, generated, vendor, and cache directories
and does not traverse symlinked trees. Historical plans and investigations are
outside this contract scan. File links include inline, image, and reference
forms; remote URLs and fragment anchors are not validated. Local directories
are valid targets. Prose accuracy and skill selection need human or agent
review in addition to structural checks.

`testing:test` runs without Nx caching because the policy reads contracts
across the workspace, including newly added owners outside this project's
dependency graph. [Fixture tests](src/documentation-policy.test.ts) exercise
both valid contracts and representative failures.

## Key Terms

- **Test setup:** shared environment behavior loaded before owner tests.
- **Project definition:** reusable Playwright device configuration.
- **Repository policy:** a deterministic structural invariant checked by unit
  tests, including canonical foundation-color ownership.
- **Routing:** links that make each repository skill discoverable in the root
  AGENTS Skills section and the local catalog's Ontology section.
