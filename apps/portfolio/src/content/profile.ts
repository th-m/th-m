export type ReferenceItem = { title: string; href: string; description: string; extra?: { label: string; href: string } };
export type ReferenceGroup = { title: string; items: ReferenceItem[] };

export const referenceGroups: ReferenceGroup[] = [
  {
    title: "Software Design",
    items: [
      { title: "SOLID and dependency direction", href: "https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design", description: "Vocabulary for responsibility boundaries, extension, substitutability, interface size, and dependency inversion." },
      { title: "Tracer bullets, DRY, and orthogonality", href: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/", description: "Ideas from The Pragmatic Programmer for learning through running systems, avoiding duplicated knowledge, and keeping decisions independently changeable." },
      { title: "Deep modules and information hiding", href: "https://web.stanford.edu/~ouster/cgi-bin/book.php", description: "Ousterhout’s frame for reducing cognitive load: simple interfaces that hide meaningful complexity." },
      { title: "Bounded contexts", href: "https://martinfowler.com/bliki/BoundedContext.html", description: "Service boundaries should follow domain language, ownership, and model boundaries rather than architecture fashion." },
      { title: "Martin Fowler’s Bliki", href: "https://martinfowler.com/bliki/", description: "Field notes on architecture, refactoring, delivery, and the language engineers use to reason about change." },
      { title: "Refactoring.Guru", href: "https://refactoring.guru/", description: "A practical catalog of refactoring techniques, code smells, and design patterns." },
      { title: "Famous laws of software development", href: "https://www.timsommer.be/famous-laws-of-software-development/", description: "A compact index of named heuristics like Brooks’s Law, Hofstadter’s Law, Conway’s Law, Postel’s Law, and Knuth’s optimization principle." },
      { title: "AI-ready codebases", href: "https://wearehypercube.com/ready-for-ai-preparing-your-codebase-for-assistants/", description: "Strong names, local context, types, tests, and explicit boundaries make code easier for people and tools to navigate." },
    ],
  },
  {
    title: "Delivery, Operations, and Security",
    items: [
      { title: "DORA delivery metrics", href: "https://dora.dev/guides/dora-metrics/", description: "A way to inspect delivery as a system of throughput and instability, not just output." },
      { title: "Chaos engineering and resilience", href: "https://cloud.google.com/blog/products/devops-sre/getting-started-with-chaos-engineering", description: "Controlled failure experiments test whether systems behave the way teams believe they do." },
      { title: "The Twelve-Factor App", href: "https://12factor.net/", description: "Deployment and configuration principles for portable, service-oriented applications." },
      { title: "OWASP Cheat Sheet Series", href: "https://owasp.org/www-project-cheat-sheets/", description: "Practical security reference material for common application design and implementation decisions." },
    ],
  },
  {
    title: "Product, UX, and Semantics",
    items: [
      { title: "Laws of UX", href: "https://lawsofux.com/", description: "A compact map of psychology, perception, cognitive load, and interaction patterns that shape how interfaces feel." },
      { title: "Atomic Design", href: "https://atomicdesign.bradfrost.com/table-of-contents/", description: "A way to think about interfaces as nested systems, from small reusable parts to full product screens." },
      { title: "Good Services", href: "https://good.services/15-principles-of-good-service-design", description: "Service-design principles for making products work across discovery, expectations, handoffs, decisions, support, and real user outcomes.", extra: { label: "scale", href: "https://good.services/the-good-services-scale" } },
      { title: "Schema.org", href: "https://schema.org/", description: "A shared vocabulary for structured data that makes entities, relationships, and actions easier for systems to understand." },
    ],
  },
];

export const books: ReferenceItem[] = [
  { title: "The 4 Disciplines of Execution", href: "https://www.franklincovey.com/books/the-4-disciplines-of-execution/", description: "Focus, lead measures, scoreboards, and accountability rhythms for making important work survive daily urgency." },
  { title: "Shape Up", href: "https://basecamp.com/shapeup", description: "Project shaping as a discipline: use time constraints as planning inputs, make bets, write pitches, and explore solutions through breadboards and rough wireframes." },
  { title: "Atomic Habits", href: "https://jamesclear.com/atomic-habits/", description: "Small systems, environment design, and identity-based habits as a way to make change compound." },
  { title: "Multipliers", href: "https://thewisemangroup.com/books/multipliers/", description: "Leadership as the practice of increasing the intelligence, ownership, and capacity of the people around you." },
  { title: "The Infinite Game", href: "https://simonsinek.com/books/the-infinite-game/", description: "Long-horizon thinking, durable purpose, and playing to keep improving rather than simply to win the current round." },
];

export const artifacts: ReferenceItem[] = [
  { title: "firebase-typed", href: "https://github.com/th-m/firebase-typed", description: "TypeScript utility layer that adds type inference and safer ergonomics to Firebase realtime database access." },
  { title: "fullstack-code-gen", href: "https://github.com/th-m/fullstack-code-gen", description: "Proto-driven generation pipeline for Go, GraphQL, OpenAPI, TypeScript, Dockerized generators, migrations, and typed database access." },
  { title: "gambit", href: "https://github.com/th-m/gambit", description: "Realtime multiplayer game architecture with React Router, TypeScript, Supabase, Netlify, database migrations, and test coverage." },
  { title: "platonic-values", href: "https://github.com/th-m/platonic-values", description: "An exploration of which values or commodities are fundamental: how virtues, principles, and character qualities might compose into an ontological map." },
];
