# Thomas Valadez

I am interested in how software systems become understandable enough to change.

Most of the engineering questions I return to live between product intent and system design: What is the real shape of the domain? Which boundaries are durable, and which ones are just artifacts of the current implementation? Where is complexity collecting? What would make the next change easier without over-designing for an imagined future?

## Principles

- **SOLID:** keep responsibilities narrow, dependencies explicit, and extension points intentional instead of abstract by default.
- **The Pragmatic Programmer:** favor tracer bullets, fast feedback, automation, orthogonality, and fixing small design breaks before they compound.
- **A Philosophy of Software Design:** build deep modules with simple interfaces, reduce cognitive load, and avoid tactical programming that trades today for every future change.
- **DORA:** treat delivery as an engineering system; improve lead time, deployment frequency, change failure rate, and recovery time with real feedback loops.
- **AI-ready engineering:** make codebases legible to humans and tools through strong boundaries, types, tests, naming, and local context.

Useful references I keep coming back to:

- [Your codebase is NOT ready for AI](https://www.youtube.com/watch?v=uC44zFz7JSM)
- [Design Microservice Architectures the Right Way](https://www.youtube.com/watch?v=j6ow-UemzBc)
- [Mastering Chaos - A Netflix Guide to Microservices](https://www.youtube.com/watch?v=CZ3wIuvmHeM)
- [The Philosophy of Software Design - with John Ousterhout](https://www.youtube.com/watch?v=lz451zUlF-k)

## Questions I Keep Working On

- **Architecture:** When does an abstraction reduce cognitive load, and when does it only move confusion somewhere else?
- **Type systems:** How much product knowledge can be made explicit in types before the model becomes harder to use than the problem itself?
- **Realtime data:** Where should state live when many users, devices, services, and events all need to agree on what happened?
- **Developer tools:** Which repeated decisions should become code generation, conventions, checks, or internal tools?
- **Delivery systems:** What feedback loops help a team move faster without quietly trading away reliability?
- **AI-ready codebases:** What makes a codebase navigable for both humans and increasingly capable tools?

## Public Artifacts

| Artifact | What it shows |
| --- | --- |
| [firebase-typed](https://github.com/th-m/firebase-typed) | TypeScript utility layer that adds type inference and safer ergonomics to Firebase realtime database access. |
| [fullstack-code-gen](https://github.com/th-m/fullstack-code-gen) | Proto-driven generation pipeline for Go, GraphQL, OpenAPI, TypeScript, Dockerized generators, migrations, and typed database access. |
| [gambit](https://github.com/th-m/gambit) | Realtime multiplayer game architecture with React Router, TypeScript, Supabase, Netlify, database migrations, and test coverage. |
| [platonic-values](https://github.com/th-m/platonic-values) | An exploration of which values or "commodities" are fundamental: how virtues, principles, and character qualities might compose into an ontological map. |
