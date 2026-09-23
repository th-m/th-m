export type ResumeRole = {
  company: string;
  title: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
};

export type PortfolioProject = {
  title: string;
  href: string;
  label: string;
  description: string;
  technologies: string[];
};

export const resumeRoles: ResumeRole[] = [
  {
    company: "Mango Voice",
    title: "Software Engineering Manager",
    period: "Oct 2023 — Present",
    location: "Remote · St. George, Utah",
    summary:
      "Lead platform architecture and cross-team delivery for a communications product serving more than 14,000 offices and 206,000 active phone lines.",
    highlights: [
      "Architected the React, TypeScript, and Nx frontend platform shared by the web product, Electron desktop app, and three administrative applications; merged pull-request throughput grew from about 8 per week to 29 per week.",
      "Designed an AWS API gateway and VPC Lattice service mesh, then helped decompose a Django monolith into independently deployable Go services using shadow writes and EventBridge eventing.",
      "Led the migration of 42+ legacy pages and 47 REST APIs from PHP while remediating SQL injection and XSS risks and completing rollout across the customer base.",
      "Architected a real-time Call-Pop system across Go Lambda, DynamoDB, SNS/SQS, WebSockets, and Electron; the work supported a major partner rollout and more than $100K in new ARR.",
    ],
  },
  {
    company: "SoundSculpt",
    title: "Co-Founder / Engineer",
    period: "Jun 2024 — Present",
    location: "Remote · St. George, Utah",
    summary:
      "Build a browser-based music production and licensing platform that helps people shape, license, and export adaptive music.",
    highlights: [
      "Architected real-time audio editing with React, TypeScript, WebAssembly, Web Audio, AudioWorklets, Web Workers, SharedArrayBuffers, and iframe isolation.",
      "Built operator-supervised AI ingest workflows with preflight checks, audit trails, deterministic reruns, caching, and recovery tooling, reducing sample preparation and review from weeks to hours.",
      "Scaled catalog operations across 434K+ source sample paths, 158K+ AI-labeled metadata rows, and 23.9K+ production sample mappings.",
    ],
  },
  {
    company: "Kolla",
    title: "Founding Engineer, Frontend",
    period: "Feb 2022 — Oct 2023",
    summary:
      "Owned the frontend platform spanning the admin portal, marketplace, embeddable widget, JavaScript SDK, and React SDK.",
    highlights: [
      "Reduced builds from more than 15 minutes to under 2 minutes by moving to Vite and adding Nx dependency-graph-aware checks.",
      "Established end-to-end TypeScript contracts across package boundaries, contributing to a 5× improvement in change failure rate and a 3× improvement in lead time.",
      "Implemented server rendering with Remix for a faster embeddable experience in third-party sites.",
    ],
  },
  {
    company: "Weave",
    title: "Software Developer → Technical Lead → Engineering Manager",
    period: "Oct 2018 — Feb 2022",
    summary:
      "Built and led scheduling, patient communication, and practice-automation products for dental offices.",
    highlights: [
      "Architected Web Assistant, an embeddable scheduling experience that let practices accept appointment requests from their own sites.",
      "Designed a scheduling platform that supported both integration-owned availability and practice-managed rules across patient-management systems.",
      "Directed rapid-response COVID product work, including a contactless patient intake flow that processed more than one million forms in a month.",
    ],
  },
];

export const earlierRoles = [
  "Full Stack Developer · ApplicantPro · 2017 — 2018",
  "Software Developer · Rumple · 2015 — 2016",
  "UI Developer · Innovation Simple · 2015 — 2016",
];

export const portfolioProjects: PortfolioProject[] = [
  {
    title: "SoundSculpt",
    href: "https://soundsculpt.app",
    label: "Product · Co-founder",
    description:
      "A browser-native adaptive music studio and licensing platform, with real-time audio systems and human-supervised AI production workflows.",
    technologies: ["React", "TypeScript", "Web Audio", "WebAssembly", "PostgreSQL"],
  },
  {
    title: "fullstack-code-gen",
    href: "https://github.com/th-m/fullstack-code-gen",
    label: "Open source · Systems",
    description:
      "A proto-driven generation pipeline spanning Go, GraphQL, OpenAPI, TypeScript, Dockerized generators, migrations, and typed database access.",
    technologies: ["Go", "TypeScript", "Protobuf", "GraphQL", "Docker"],
  },
  {
    title: "firebase-typed",
    href: "https://github.com/th-m/firebase-typed",
    label: "Open source · Developer experience",
    description:
      "A TypeScript utility layer that adds type inference and safer ergonomics to Firebase Realtime Database access.",
    technologies: ["TypeScript", "Firebase", "Type inference"],
  },
  {
    title: "gambit",
    href: "https://github.com/th-m/gambit",
    label: "Open source · Product architecture",
    description:
      "A realtime multiplayer game architecture with React Router, Supabase, Netlify, database migrations, and test coverage.",
    technologies: ["React", "Supabase", "Realtime", "Netlify"],
  },
];

export const capabilityGroups = [
  {
    title: "Platform & frontend",
    items: ["React", "TypeScript", "Nx", "Vite", "Electron", "Remix", "WebAssembly", "Web Audio"],
  },
  {
    title: "Systems & infrastructure",
    items: ["Go", "Django", "PostgreSQL", "AWS", "GCP", "Terraform", "Event-driven systems"],
  },
  {
    title: "Technical leadership",
    items: ["Architecture", "Engineering management", "Developer experience", "Hiring", "Cross-team delivery", "Security remediation"],
  },
  {
    title: "AI-enabled engineering",
    items: ["Agent workflows", "Quality gates", "Codebase indexing", "Audit trails", "Deterministic data pipelines"],
  },
];
