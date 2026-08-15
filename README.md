# Thomas Valadez

I am interested in how software systems become understandable enough to change.

Most of the engineering questions I return to live between product intent and system design: What is the real shape of the domain? Which boundaries are durable, and which ones are just artifacts of the current implementation?

Where is complexity collecting? What would make the next change easier without over-designing for an imagined future?

## Design Tool

[Paper](https://paper.design/) is the specified design tool for this project. Use Paper for brand exploration, visual design, review, and design handoff instead of Figma.

## Proposition Graph Authoring

Run `bun run graph` to open the local-only proposition graph editor. Use `bun run build:graph` for its isolated build and `bun run test:graph:e2e` for its browser and accessibility checks; none of these commands add the editor to the public portfolio build.

## TypeScript Set Atlas

Run `bun run sets` to open the local-only set-theory workbench at `/sets.html`. The tool sends TypeScript source only to its loopback Vite process, uses the workspace's TypeScript compiler to infer assignability and intersections, and turns the declared types into THOM-themed nested, disjoint, and overlapping set regions. It is a separate entry point and is not included in the public portfolio build.

The source inspector supports two workflows:

- **Paste** keeps an editable virtual `.ts` file in the browser and analyzes it after a short typing pause.
- **Project file** reads a `.ts`, `.tsx`, `.mts`, or `.cts` file inside this workspace. It uses an optional `tsconfig.json` path or discovers the nearest one, follows local imports, and never writes back to the project.

The atlas library persists document names, pasted source or project-file references, viewport, and pinned region positions in browser `localStorage`. Compiler results are regenerated rather than persisted. Use **Reset pins** to return to generated layout, **Fit** to restore the full view, and **Export** to download a self-contained SVG or a 2× PNG.

The diagrams are semantic aids rather than proofs of arbitrary TypeScript programs. Compiler-proven containment and equivalence are rendered directly; intersections that demonstrate overlap and structural or higher-order cases that cannot be represented faithfully by ellipses are marked as approximate. `unknown`, `never`, uninstantiated generics, and `any` are called out as the universe, empty set, reusable template, and set-model exception respectively. When edited source has compiler errors, the canvas preserves the last valid atlas and exposes the errors in **Issues**.

Useful commands:

- `bun run build:sets` — type-check the repository and build the isolated Sets entry point.
- `bun run test:sets:e2e` — run desktop/mobile interaction, export, and accessibility checks.
- `bun run preview:sets` — serve the isolated production build locally.

## Concepts Worth Knowing

### Software Design

- **[SOLID and dependency direction](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design):** vocabulary for responsibility boundaries, extension, substitutability, interface size, and dependency inversion.
- **[Tracer bullets, DRY, and orthogonality](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/):** ideas from *The Pragmatic Programmer* for learning through running systems, avoiding duplicated knowledge, and keeping decisions independently changeable.
- **[Deep modules and information hiding](https://web.stanford.edu/~ouster/cgi-bin/book.php):** Ousterhout's frame for reducing cognitive load: simple interfaces that hide meaningful complexity.
- **[Bounded contexts](https://martinfowler.com/bliki/BoundedContext.html):** service boundaries should follow domain language, ownership, and model boundaries rather than architecture fashion.
- **[Martin Fowler's Bliki](https://martinfowler.com/bliki/):** field notes on architecture, refactoring, delivery, and the language engineers use to reason about change.
- **[Refactoring.Guru](https://refactoring.guru/):** a practical catalog of refactoring techniques, code smells, and design patterns.
- **[Famous laws of software development](https://www.timsommer.be/famous-laws-of-software-development/):** a compact index of named heuristics like Brooks's Law, Hofstadter's Law, Conway's Law, Postel's Law, and Knuth's optimization principle.
- **[AI-ready codebases](https://wearehypercube.com/ready-for-ai-preparing-your-codebase-for-assistants/):** strong names, local context, types, tests, and explicit boundaries make code easier for people and tools to navigate.

### Delivery, Operations, and Security

- **[DORA delivery metrics](https://dora.dev/guides/dora-metrics/):** a way to inspect delivery as a system of throughput and instability, not just output.
- **[Chaos engineering and resilience](https://cloud.google.com/blog/products/devops-sre/getting-started-with-chaos-engineering):** controlled failure experiments test whether systems behave the way teams believe they do.
- **[The Twelve-Factor App](https://12factor.net/):** deployment and configuration principles for portable, service-oriented applications.
- **[OWASP Cheat Sheet Series](https://owasp.org/www-project-cheat-sheets/):** practical security reference material for common application design and implementation decisions.

### Product, UX, and Semantics

- **[Laws of UX](https://lawsofux.com/):** a compact map of psychology, perception, cognitive load, and interaction patterns that shape how interfaces feel.
- **[Atomic Design](https://atomicdesign.bradfrost.com/table-of-contents/):** a way to think about interfaces as nested systems, from small reusable parts to full product screens.
- **[Good Services](https://good.services/15-principles-of-good-service-design):** service-design principles for making products work across discovery, expectations, handoffs, decisions, support, and real user outcomes. ([🔗 scale](https://good.services/the-good-services-scale))
- **[Schema.org](https://schema.org/):** a shared vocabulary for structured data that makes entities, relationships, and actions easier for systems to understand.

## Books and Operating Models

- **[The 4 Disciplines of Execution](https://www.franklincovey.com/books/the-4-disciplines-of-execution/):** focus, lead measures, scoreboards, and accountability rhythms for making important work survive daily urgency.
- **[Shape Up](https://basecamp.com/shapeup):** project shaping as a discipline: use time constraints as planning inputs, make bets, write pitches, and explore solutions through breadboards and rough wireframes.
- **[Atomic Habits](https://jamesclear.com/atomic-habits):** small systems, environment design, and identity-based habits as a way to make change compound.
- **[Multipliers](https://thewisemangroup.com/books/multipliers/):** leadership as the practice of increasing the intelligence, ownership, and capacity of the people around you.
- **[The Infinite Game](https://simonsinek.com/books/the-infinite-game/):** long-horizon thinking, durable purpose, and playing to keep improving rather than simply to win the current round.

## Current Focus

Most current side-project energy is going into [soundsculpt.app](https://soundsculpt.app): exploring AI-assisted audio generation, creative tooling, and product workflows around prompt-driven media.

## Public Artifacts

Some are old, some are unfinished 😅. Most moonlight work goes to [soundsculpt.app](https://soundsculpt.app), and my day job gets my daylight work.

- **[firebase-typed](https://github.com/th-m/firebase-typed):** TypeScript utility layer that adds type inference and safer ergonomics to Firebase realtime database access.
- **[fullstack-code-gen](https://github.com/th-m/fullstack-code-gen):** Proto-driven generation pipeline for Go, GraphQL, OpenAPI, TypeScript, Dockerized generators, migrations, and typed database access.
- **[gambit](https://github.com/th-m/gambit):** Realtime multiplayer game architecture with React Router, TypeScript, Supabase, Netlify, database migrations, and test coverage.
- **[platonic-values](https://github.com/th-m/platonic-values):** An exploration of which values or "commodities" are fundamental: how virtues, principles, and character qualities might compose into an ontological map.
