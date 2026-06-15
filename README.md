# Thomas Valadez

I am interested in how software systems become understandable enough to change.

Most of the engineering questions I return to live between product intent and system design: What is the real shape of the domain? Which boundaries are durable, and which ones are just artifacts of the current implementation? Where is complexity collecting? What would make the next change easier without over-designing for an imagined future?

## Concepts Worth Knowing

- **[SOLID and dependency direction](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design):** vocabulary for responsibility boundaries, extension, substitutability, interface size, and dependency inversion.
- **[Tracer bullets, DRY, and orthogonality](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/):** ideas from *The Pragmatic Programmer* for learning through running systems, avoiding duplicated knowledge, and keeping decisions independently changeable.
- **[Deep modules and information hiding](https://web.stanford.edu/~ouster/cgi-bin/book.php):** Ousterhout's frame for reducing cognitive load: simple interfaces that hide meaningful complexity.
- **[DORA delivery metrics](https://dora.dev/guides/dora-metrics/):** a way to inspect delivery as a system of throughput and instability, not just output.
- **[Microservice boundaries](https://samnewman.io/books/building_microservices_2nd_edition/):** services should follow ownership, data, deployment, and change patterns, not architecture fashion.
- **[Martin Fowler's Bliki](https://martinfowler.com/bliki/):** field notes on architecture, refactoring, delivery, and the language engineers use to reason about change.
- **[Refactoring.Guru](https://refactoring.guru/):** a practical catalog of refactoring techniques, code smells, and design patterns.
- **[Chaos engineering and resilience](https://cloud.google.com/blog/products/devops-sre/getting-started-with-chaos-engineering):** controlled failure experiments test whether systems behave the way teams believe they do.
- **[The Twelve-Factor App](https://12factor.net/):** deployment and configuration principles for portable, service-oriented applications.
- **[OWASP Cheat Sheet Series](https://owasp.org/www-project-cheat-sheets/):** practical security reference material for common application design and implementation decisions.
- **[AI-ready codebases](https://wearehypercube.com/ready-for-ai-preparing-your-codebase-for-assistants/):** strong names, local context, types, tests, and explicit boundaries make code easier for people and tools to navigate.
- **[Laws of UX](https://lawsofux.com/):** a compact map of psychology, perception, cognitive load, and interaction patterns that shape how interfaces feel.
- **[Schema.org](https://schema.org/):** a shared vocabulary for structured data that makes entities, relationships, and actions easier for systems to understand.

## Books I Return To

- **[The 4 Disciplines of Execution](https://www.franklincovey.com/books/the-4-disciplines-of-execution/):** focus, lead measures, scoreboards, and accountability rhythms for making important work survive daily urgency.
- **[Shape Up](https://basecamp.com/shapeup):** project shaping as a discipline: use time constraints as planning inputs, make bets, write pitches, and explore solutions through breadboards and rough wireframes.
- **[Atomic Habits](https://jamesclear.com/atomic-habits):** small systems, environment design, and identity-based habits as a way to make change compound.
- **[Multipliers](https://thewisemangroup.com/books/multipliers/):** leadership as the practice of increasing the intelligence, ownership, and capacity of the people around you.
- **[The Infinite Game](https://simonsinek.com/books/the-infinite-game/):** long-horizon thinking, durable purpose, and playing to keep improving rather than simply to win the current round.

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
