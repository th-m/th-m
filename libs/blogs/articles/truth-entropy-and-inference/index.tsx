import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { PublishedPost } from "@th-m/blogs/publish";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkPreview,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@th-m/ui";
import { EmbeddingCompositionExplorer } from "@th-m/embedding-space/composition";
import "./truth-instruments.css";

/* ------------------------------------------------------------------ */
/* Small prose primitives                                              */
/* ------------------------------------------------------------------ */

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="article-outline__section">
      <p className="article-outline__index">{index}</p>
      <div className="article-outline__content">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

/** Inline jargon gloss: dotted-underline tooltip, no links, ≤45 words. */
function Term({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger">{label}</span>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

/** Structured gloss: hover card with a definition plus a link. */
function Gloss({
  label,
  title,
  children,
  href,
  linkLabel,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <HoverCard openDelay={120} closeDelay={120}>
      <HoverCardTrigger asChild>
        <span
          style={{
            cursor: "help",
            textDecoration: "underline dotted",
            textUnderlineOffset: ".22em",
            textDecorationColor: "var(--color-primary)",
          }}
        >
          {label}
        </span>
      </HoverCardTrigger>
      <HoverCardContent>
        <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 430, lineHeight: 1.15 }}>
          {title}
        </p>
        <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, color: "var(--color-hover-card-foreground)" }}>
          {children}
          {href ? (
            <p style={{ margin: "10px 0 0" }}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: ".18em" }}
              >
                {linkLabel ?? "Read more"} ↗
              </a>
            </p>
          ) : null}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function ClaimCard({ eyebrow, title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <Card style={{ margin: "1.5em 0" }}>
      <CardHeader>
        {eyebrow ? (
          <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".13em", textTransform: "uppercase", color: "var(--color-primary)" }}>
            {eyebrow}
          </p>
        ) : null}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent style={{ fontFamily: "var(--font-display)", fontSize: "clamp(17px, 1.7vw, 19px)", lineHeight: 1.6, color: "var(--color-foreground)" }}>
        {children}
      </CardContent>
    </Card>
  );
}

function FigureCaption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption
      style={{
        margin: "14px 0 0",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: ".08em",
        lineHeight: 1.7,
        textTransform: "uppercase",
        color: "var(--color-foreground-muted)",
      }}
    >
      {children}
    </figcaption>
  );
}

const figureFrame: React.CSSProperties = {
  margin: "1.75em 0",
  padding: "22px",
  border: "1px solid var(--line)",
  background: "var(--color-surface)",
};

/* ------------------------------------------------------------------ */
/* F1 — Truth practices and their feedback                             */
/* ------------------------------------------------------------------ */

const TRUTH_PRACTICES = [
  {
    label: "Formal truth",
    formulation: { lens: "Coherence", question: "Does it fit?" },
    validity: "validity relative to definitions, axioms, and inference rules",
    parallel: null,
    language: "explicit premises, symbolic relationships, proof obligations",
    feedback: "counterexamples and proof assistants reject invalid derivations",
  },
  {
    label: "Empirical truth",
    formulation: { lens: "Correspondence", question: "Does it match?" },
    validity: "agreement with an observable state of affairs—the events, objects, properties, or relations the claim describes",
    parallel: null,
    language: "measurement, method, uncertainty, replication, counterevidence",
    feedback: "failed predictions and unreplicated results erode the claim",
  },
  {
    label: "Operational truth",
    formulation: { lens: "Consequence", question: "Does it work?" },
    validity: "reliable consequences under stated conditions—the procedure repeatedly produces its intended result within defined tolerances",
    parallel: null,
    language: "procedures, preconditions, failure modes, tolerances, observed outcomes",
    feedback: "systems that crash, stall, or cost too much are corrected or retired",
  },
  {
    label: "Relational / acquaintance",
    formulation: null,
    validity: "situated significance known through direct familiarity with experiences, people, places, purposes, and relationships",
    parallel: null,
    language: "perspective, motive, consequence, interpretation, demonstration, metaphor, phenomenological description",
    feedback: "people with direct familiarity test whether a claim remains faithful to experience and its consequences",
  },
  {
    label: "Sincerity / truthfulness",
    formulation: null,
    validity: "non-deceptive fit between an expression and the speaker's subjective state",
    parallel: {
      label: "Classical Confucian parallel",
      text: "One East Asian parallel, not an equivalence: chéng (誠) joins freedom from deceit to integrity between inward disposition and outward conduct. The Doctrine of the Mean calls sincerity the Way of Heaven and becoming sincere the human way.",
      linkLabel: "Chéng in classical Chinese thought",
      url: "https://www.chinesethought.cn/EN/shuyu_show.aspx?shuyu_id=2126",
    },
    language: "first-person avowal, disclosure, qualification, acknowledged uncertainty",
    feedback: "mismatches among avowal, conduct, and context expose deception or self-deception",
  },
  {
    label: "Trustworthiness Theory",
    formulation: null,
    validity: "X is true if and only if X is trustworthy; X is false if and only if X is untrustworthy",
    parallel: {
      label: "Biblical Hebrew parallel",
      text: "A close parallel, not an equivalence: ʾemet (אֱמֶת) can mean truth, faithfulness, firmness, or reliability. Applied to a person, word, promise, or God, being ‘true’ includes being dependable enough to warrant trust.",
      linkLabel: "ʾEmet in biblical Hebrew",
      url: "https://www.thetorah.com/article/torat-emet-truth-spoken-through-the-humble-human-experience",
    },
    language: "warranted reliance, reliability, evidence, risk, dependence, justified trust",
    feedback: "failures of warranted reliance expose what ought not be trusted, including failures without deception",
  },
] as const;

const RECURRING_TRUTH_PRACTICES = TRUTH_PRACTICES.slice(0, 3);
const SITUATED_TRUTH_PRACTICES = TRUTH_PRACTICES.slice(3);

const SITUATED_TRUTH_INSTRUMENTS = [
  {
    index: "01",
    headline: "Situated significance known through direct familiarity.",
    supporting: "Experiences, people, places, purposes, and relationships establish the relevant context.",
    asset: "assets/acquaintance-map.svg",
    alt: "A relational map connecting a person with place, experience, and consequence",
  },
  {
    index: "02",
    headline: "Non-deceptive fit between expression and subjective state.",
    supporting: "Sincerity tests whether inward disposition, outward expression, and conduct remain aligned.",
    asset: "assets/sincerity-alignment.svg",
    alt: "An alignment instrument balancing inner state with outward expression",
  },
  {
    index: "03",
    headline: "Truth is what warrants reliance.",
    supporting: "X is true if and only if X is trustworthy; X is false if and only if X is untrustworthy.",
    asset: "assets/trustworthiness-balance.svg",
    alt: "A balance comparing evidence and reliance while marking the risk of being wrong",
  },
] as const;

type TruthPractice = (typeof TRUTH_PRACTICES)[number];

function SituatedTruthPracticesFigure({ assetUrl }: { assetUrl: (value: string) => string }) {
  return (
    <figure
      className="truth-instruments"
      aria-label="Three situated truth practices shaped by experience, belief, and value"
    >
      <div className="truth-instruments__frame">
        <header className="truth-instruments__header">
          <p className="truth-instruments__eyebrow">Semantic instruments</p>
          <h3>Experience, belief, and value</h3>
          <p>
            Three situated truth practices for navigating meaning, action, and evaluation. Each instrument names a
            core proposition and the linguistic habits that sustain it.
          </p>
        </header>

        <div className="truth-instruments__list">
          {SITUATED_TRUTH_PRACTICES.map((practice, practiceIndex) => {
            const instrument = SITUATED_TRUTH_INSTRUMENTS[practiceIndex];
            if (!instrument) return null;
            const headingId = `truth-instrument-${instrument.index}`;
            return (
              <section className="truth-instrument" aria-labelledby={headingId} key={practice.label}>
                <div className="truth-instrument__intro">
                  <p className="truth-instrument__label">
                    <span>{instrument.index}</span>
                    {practice.label}
                  </p>
                  <h4 id={headingId}>{instrument.headline}</h4>
                  <p className="truth-instrument__supporting">{instrument.supporting}</p>
                </div>

                <div className="truth-instrument__visual">
                  <img src={assetUrl(instrument.asset)} alt={instrument.alt} loading="lazy" />
                </div>

                <div className="truth-instrument__notes">
                  <div className="truth-instrument__note">
                    <p>Language favors</p>
                    <span>{practice.language}</span>
                  </div>
                  <div className="truth-instrument__note">
                    <p>Feedback</p>
                    <span>{practice.feedback}</span>
                  </div>
                </div>

                {practice.parallel ? (
                  <aside className="truth-instrument__parallel">
                    <p>{practice.parallel.label}</p>
                    <div>
                      <span>{practice.parallel.text}</span>{" "}
                      <a href={practice.parallel.url} target="_blank" rel="noreferrer">
                        {practice.parallel.linkLabel} ↗
                      </a>
                    </div>
                  </aside>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
      <FigureCaption>
        Situated truth — constrained through faithful experience, good-faith expression, and warranted reliance.
      </FigureCaption>
    </figure>
  );
}

function TruthPracticesFigure({
  practices,
  ariaLabel,
  eyebrow,
  title,
  caption,
}: {
  practices: readonly TruthPractice[];
  ariaLabel: string;
  eyebrow: string;
  title: string;
  caption: string;
}) {
  return (
    <figure aria-label={ariaLabel}>
      <div style={figureFrame}>
        <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--color-primary)" }}>
          {eyebrow}
        </p>
        <h3 style={{ margin: "7px 0 0", fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 470, lineHeight: 1.2, color: "var(--color-foreground-strong)" }}>
          {title}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginTop: 16,
          }}
        >
          {practices.map((practice) => (
            <div
              key={practice.label}
              style={{
                padding: "16px 18px",
                border: "1px solid var(--line)",
                background: "var(--color-card)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".13em", textTransform: "uppercase", color: "var(--color-primary)" }}>
                {practice.label}
              </p>
              {practice.formulation ? (
                <p
                  style={{
                    margin: 0,
                    padding: "9px 10px",
                    borderLeft: "2px solid var(--color-primary)",
                    background: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                    fontSize: 13,
                    lineHeight: 1.45,
                    color: "var(--color-foreground)",
                  }}
                >
                  <strong>{practice.formulation.lens}</strong> — {practice.formulation.question}
                </p>
              ) : null}
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-foreground)" }}>
                {practice.validity}
              </p>
              {practice.parallel ? (
                <p
                  style={{
                    margin: 0,
                    padding: "10px 11px",
                    borderLeft: "2px solid color-mix(in srgb, var(--color-primary) 65%, transparent)",
                    background: "color-mix(in srgb, var(--color-primary) 5%, transparent)",
                    fontSize: 11,
                    lineHeight: 1.55,
                    color: "var(--color-foreground-muted)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      marginBottom: 4,
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--color-primary)",
                    }}
                  >
                    {practice.parallel.label}
                  </span>
                  {practice.parallel.text}{" "}
                  <a href={practice.parallel.url} target="_blank" rel="noreferrer">
                    {practice.parallel.linkLabel} ↗
                  </a>
                </p>
              ) : null}
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: "var(--color-foreground-muted)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase" }}>Language favors — </span>
                {practice.language}
              </p>
              <p style={{ margin: 0, paddingTop: 8, borderTop: "1px solid var(--line)", fontSize: 12, lineHeight: 1.55, color: "var(--color-foreground-muted)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-primary)" }}>Feedback — </span>
                {practice.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>
      <FigureCaption>{caption}</FigureCaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* F3 — Prompt direction and remaining ambiguity                       */
/* ------------------------------------------------------------------ */

type ScenarioConstraint = {
  label: string;
  technicalLabel: string;
  metaDescription: string;
  multiplier: number;
};

type LanguageOption = {
  register: "Plain language" | "Slang" | "Colloquial" | "Adjacent domain" | "Term of art";
  term: string;
};

type Scenario = {
  id:
    | "sorting"
    | "design"
    | "business"
    | "cybersecurity"
    | "manufacturing"
    | "inventory"
    | "error-recovery"
    | "information-scent"
    | "visual-hierarchy"
    | "readable-measure"
    | "branding";
  label: string;
  requestBase: string;
  targetResponse: string;
  languageOptions: LanguageOption[];
  constraints: ScenarioConstraint[];
  /** Index of the language option a model would reflexively pick with no constraints. */
  naiveGuess: number;
  /** Index of the domain-correct term of art. */
  termOfArt: number;
};

const SCENARIOS: Scenario[] = [
  {
    id: "sorting",
    label: "Sorting",
    requestBase: "Organize this list",
    targetResponse:
      "Use a stable counting sort for bounded integer keys: count values, accumulate positions, and place items into an output array from right to left so equal keys retain their input order.",
    languageOptions: [
      { register: "Plain language", term: "put the numbers in order" },
      { register: "Slang", term: "clean this list up" },
      { register: "Colloquial", term: "sort it out" },
      { register: "Adjacent domain", term: "rank the entries" },
      { register: "Term of art", term: "stable counting sort" },
    ],
    naiveGuess: 0,
    termOfArt: 4,
    constraints: [
      {
        label: "The domain is bounded integer keys",
        technicalLabel: "domain",
        metaDescription: "The universe of values the request is allowed to touch.",
        multiplier: 6,
      },
      {
        label: "The family is stable counting sort",
        technicalLabel: "family",
        metaDescription: "The established algorithm family that matches bounded integer keys and stable output.",
        multiplier: 5,
      },
      {
        label: "The key range is known and compact",
        technicalLabel: "precondition",
        metaDescription: "The condition that makes counting sort efficient instead of wasteful.",
        multiplier: 3,
      },
      {
        label: "Memory safety and stability are required",
        technicalLabel: "invariant",
        metaDescription: "Properties the result must preserve — and the failure modes when it does not.",
        multiplier: 3,
      },
      {
        label: "Examples and counterexamples are included",
        technicalLabel: "example",
        metaDescription: "Concrete cases that must work, and cases that must not.",
        multiplier: 2,
      },
      {
        label: "Tests define what counts as success",
        technicalLabel: "test",
        metaDescription: "The observable condition the result is judged against.",
        multiplier: 2,
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    requestBase: "Make the checkout easier to use",
    targetResponse:
      "Redesign the checkout flow around keyboard operation, visible focus, labeled controls, accessible errors, WCAG AA contrast, and a mobile task-flow test.",
    languageOptions: [
      { register: "Plain language", term: "make the checkout easier to use" },
      { register: "Slang", term: "give it some polish" },
      { register: "Colloquial", term: "clean up the checkout" },
      { register: "Adjacent domain", term: "optimize the conversion funnel" },
      { register: "Term of art", term: "accessible checkout-flow redesign" },
    ],
    naiveGuess: 0,
    termOfArt: 4,
    constraints: [
      {
        label: "The domain is the checkout screen",
        technicalLabel: "domain",
        metaDescription: "The universe of values the request is allowed to touch.",
        multiplier: 6,
      },
      {
        label: "The family is a tokenized design system",
        technicalLabel: "family",
        metaDescription: "The class of solutions the request selects — shared tokens instead of one-off styling.",
        multiplier: 5,
      },
      {
        label: "Contrast passes WCAG AA and focus states stay visible",
        technicalLabel: "invariant",
        metaDescription: "Properties the result must preserve — and the failure modes when it does not.",
        multiplier: 3,
      },
      {
        label: "Show the mobile viewport before and after",
        technicalLabel: "example",
        metaDescription: "Concrete cases that must work, and cases that must not.",
        multiplier: 3,
      },
      {
        label: "Success is a usability test: task time and error rate",
        technicalLabel: "test",
        metaDescription: "The observable condition the result is judged against.",
        multiplier: 5,
      },
    ],
  },
  {
    id: "business",
    label: "Business strategy",
    requestBase: "Grow the business",
    targetResponse:
      "Calculate net revenue retention by cohort as starting recurring revenue plus expansion, minus contraction and churn, divided by starting recurring revenue; diagnose each component before proposing pricing or retention changes.",
    languageOptions: [
      { register: "Plain language", term: "make more money" },
      { register: "Slang", term: "pour gas on growth" },
      { register: "Colloquial", term: "grow the customer base" },
      { register: "Adjacent domain", term: "increase throughput" },
      { register: "Term of art", term: "net revenue retention" },
    ],
    naiveGuess: 0,
    termOfArt: 4,
    constraints: [
      {
        label: "The domain is the B2B SaaS segment",
        technicalLabel: "domain",
        metaDescription: "The universe of values the request is allowed to touch.",
        multiplier: 6,
      },
      {
        label: "The family is pricing and packaging strategy",
        technicalLabel: "family",
        metaDescription: "The class of strategies the request selects — how the offer is priced and packaged.",
        multiplier: 5,
      },
      {
        label: "Gross margin stays above 75% and monthly churn below 3%",
        technicalLabel: "invariant",
        metaDescription: "Properties the result must preserve — and the failure modes when it does not.",
        multiplier: 3,
      },
      {
        label: "Counterexample: last year's blanket discount did not lift volume",
        technicalLabel: "example",
        metaDescription: "Concrete cases that must work, and cases that must not.",
        multiplier: 3,
      },
      {
        label: "Success is NRR ≥ 110% measured over two quarters",
        technicalLabel: "test",
        metaDescription: "The observable condition the result is judged against.",
        multiplier: 3,
      },
    ],
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    requestBase: "A stolen password should not be enough to get in",
    targetResponse:
      "Require phishing-resistant MFA for administrative access with WebAuthn or hardware-backed passkeys, and ensure account recovery cannot fall back to phishable factors.",
    languageOptions: [
      { register: "Plain language", term: "require another proof of identity" },
      { register: "Slang", term: "lock down admin login" },
      { register: "Colloquial", term: "add a security key at sign-in" },
      { register: "Adjacent domain", term: "put a second gate in front of access" },
      { register: "Term of art", term: "phishing-resistant MFA" },
    ],
    naiveGuess: 0,
    termOfArt: 4,
    constraints: [
      {
        label: "The domain is administrative access",
        technicalLabel: "scope",
        metaDescription: "The accounts and privileges to which the authentication requirement applies.",
        multiplier: 6,
      },
      {
        label: "The control is phishing-resistant MFA",
        technicalLabel: "control",
        metaDescription: "The security family selected to prevent a captured password from being sufficient.",
        multiplier: 5,
      },
      {
        label: "Hardware-backed authentication is required",
        technicalLabel: "mechanism",
        metaDescription: "The concrete mechanism that binds authentication to the legitimate service.",
        multiplier: 3,
      },
      {
        label: "Weaker fallback methods cannot bypass the control",
        technicalLabel: "invariant",
        metaDescription: "The guarantee that recovery or fallback does not silently reopen the protected path.",
        multiplier: 3,
      },
      {
        label: "Lost-device and account-recovery cases are tested",
        technicalLabel: "test",
        metaDescription: "The exceptional paths that must preserve both access and the security guarantee.",
        multiplier: 3,
      },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    requestBase: "Make it impossible to install this part backward",
    targetResponse:
      "Poka-yoke the assembly step with a keyed fixture or interlock that permits only the correct orientation, stops incomplete insertion, and rejects reversed or missing components.",
    languageOptions: [
      { register: "Plain language", term: "make the part fit only one way" },
      { register: "Slang", term: "make the station foolproof" },
      { register: "Colloquial", term: "stop backward assembly" },
      { register: "Adjacent domain", term: "constrain the affordance" },
      { register: "Term of art", term: "poka-yoke the assembly step" },
    ],
    naiveGuess: 0,
    termOfArt: 4,
    constraints: [
      {
        label: "The domain is the connector assembly station",
        technicalLabel: "scope",
        metaDescription: "The exact operation in which orientation errors must be prevented.",
        multiplier: 6,
      },
      {
        label: "The method is a keyed physical fixture",
        technicalLabel: "method",
        metaDescription: "The error-proofing mechanism that permits only the correct orientation.",
        multiplier: 5,
      },
      {
        label: "Incomplete insertion stops the cycle",
        technicalLabel: "invariant",
        metaDescription: "The behavioral guarantee that a second assembly error cannot pass unnoticed.",
        multiplier: 3,
      },
      {
        label: "Reversed and missing components are counterexamples",
        technicalLabel: "counterexample",
        metaDescription: "Known incorrect states the fixture must reject rather than merely discourage.",
        multiplier: 3,
      },
      {
        label: "Every known assembly error is validated",
        technicalLabel: "test",
        metaDescription: "The acceptance criterion that turns error-proofing into an inspectable result.",
        multiplier: 3,
      },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    requestBase: "Do not run out, but do not fill the warehouse",
    targetResponse:
      "Set the reorder point to expected lead-time demand plus safety stock, using measured demand and lead-time variability while preserving case-quantity, shelf-life, and service-level constraints.",
    languageOptions: [
      { register: "Plain language", term: "order before stock gets too low" },
      { register: "Slang", term: "keep some cushion on the shelf" },
      { register: "Colloquial", term: "carry enough for a busy week" },
      { register: "Adjacent domain", term: "maintain a reserve margin" },
      { register: "Term of art", term: "reorder point with safety stock" },
    ],
    naiveGuess: 0,
    termOfArt: 4,
    constraints: [
      {
        label: "The domain is a perishable SKU with variable demand",
        technicalLabel: "scope",
        metaDescription: "The item and demand pattern to which the stocking policy applies.",
        multiplier: 6,
      },
      {
        label: "The method is a reorder point with safety stock",
        technicalLabel: "method",
        metaDescription: "The inventory model that combines expected lead-time demand with a variability buffer.",
        multiplier: 5,
      },
      {
        label: "Lead-time demand and variability are measured",
        technicalLabel: "precondition",
        metaDescription: "The observations needed to calculate the policy instead of guessing a buffer.",
        multiplier: 3,
      },
      {
        label: "Case quantities and shelf life remain constraints",
        technicalLabel: "invariant",
        metaDescription: "The operational limits the replenishment policy must not optimize away.",
        multiplier: 3,
      },
      {
        label: "The target service level is explicit and reviewed monthly",
        technicalLabel: "test",
        metaDescription: "The measurable availability goal and cadence for checking whether the policy still fits.",
        multiplier: 3,
      },
    ],
  },
  {
    id: "error-recovery",
    label: "Error recovery",
    requestBase: "Do not punish people for making a mistake",
    targetResponse:
      "Design for error recovery: preserve entered data, offer undo for reversible actions, explain how to repair validation failures, and confirm only destructive actions that cannot be reversed.",
    languageOptions: [
      { register: "Plain language", term: "let people fix mistakes without starting over" },
      { register: "Slang", term: "give people a way back" },
      { register: "Colloquial", term: "make mistakes easy to undo" },
      { register: "Adjacent domain", term: "build in a safety net" },
      { register: "Term of art", term: "design for error recovery" },
    ],
    naiveGuess: 0,
    termOfArt: 4,
    constraints: [
      {
        label: "The domain is a content-publishing workflow",
        technicalLabel: "scope",
        metaDescription: "The sequence of editing, validating, publishing, and deleting content where recovery matters.",
        multiplier: 6,
      },
      {
        label: "Reversible actions provide undo",
        technicalLabel: "reversibility",
        metaDescription: "The recovery mechanism that restores the prior state without forcing users to reconstruct it.",
        multiplier: 5,
      },
      {
        label: "Validation failures preserve entered data",
        technicalLabel: "invariant",
        metaDescription: "The guarantee that an error does not destroy valid work completed elsewhere in the flow.",
        multiplier: 3,
      },
      {
        label: "Every error explains how to repair it",
        technicalLabel: "guidance",
        metaDescription: "The information users need to recognize the problem and take a successful next action.",
        multiplier: 3,
      },
      {
        label: "Irreversible destructive actions require confirmation",
        technicalLabel: "guardrail",
        metaDescription: "The prevention reserved for consequential actions that the recovery system cannot undo.",
        multiplier: 3,
      },
    ],
  },
  {
    id: "information-scent",
    label: "Information scent",
    requestBase: "Help people understand what will happen before they click",
    targetResponse:
      "Strengthen information scent with destination-specific link labels and previews that expose content type and scope, then test whether people can predict each destination before clicking.",
    languageOptions: [
      { register: "Plain language", term: "make link destinations easier to understand" },
      { register: "Slang", term: "make the links less mysterious" },
      { register: "Colloquial", term: "show people where each link goes" },
      { register: "Adjacent domain", term: "improve the wayfinding cues" },
      { register: "Term of art", term: "strengthen information scent" },
    ],
    naiveGuess: 0,
    termOfArt: 4,
    constraints: [
      {
        label: "The domain is resource-library navigation",
        technicalLabel: "scope",
        metaDescription: "The collection in which users must choose among similar-looking destinations.",
        multiplier: 6,
      },
      {
        label: "Links use destination-specific labels",
        technicalLabel: "cue",
        metaDescription: "The language that predicts the destination instead of relying on generic calls to action.",
        multiplier: 5,
      },
      {
        label: "Previews expose content type and scope",
        technicalLabel: "preview",
        metaDescription: "The additional evidence users can inspect before committing to navigation.",
        multiplier: 3,
      },
      {
        label: "Generic Learn more links are counterexamples",
        technicalLabel: "counterexample",
        metaDescription: "A common label that provides too little evidence when several destinations are plausible.",
        multiplier: 3,
      },
      {
        label: "Participants can predict each destination before clicking",
        technicalLabel: "test",
        metaDescription: "The observable condition that distinguishes a strong cue from a merely descriptive label.",
        multiplier: 3,
      },
    ],
  },
  {
    id: "visual-hierarchy",
    label: "Visual hierarchy",
    requestBase: "Make it obvious what people should notice first",
    targetResponse:
      "Establish a clear visual hierarchy with one dominant action, discoverable secondary actions, and a reading order that survives mobile layouts; verify the intended priority with a first-click test.",
    languageOptions: [
      { register: "Plain language", term: "make the main action stand out" },
      { register: "Slang", term: "make the CTA pop" },
      { register: "Colloquial", term: "draw the eye to the next step" },
      { register: "Adjacent domain", term: "establish a focal point" },
      { register: "Term of art", term: "establish a clear visual hierarchy" },
    ],
    naiveGuess: 0,
    termOfArt: 4,
    constraints: [
      {
        label: "The domain is a pricing-selection screen",
        technicalLabel: "scope",
        metaDescription: "The decision surface whose plans, details, and actions require an intentional reading order.",
        multiplier: 6,
      },
      {
        label: "One action is visually dominant",
        technicalLabel: "priority",
        metaDescription: "The single next action that receives the strongest position, scale, contrast, and spacing cues.",
        multiplier: 5,
      },
      {
        label: "Secondary actions remain discoverable without competing",
        technicalLabel: "invariant",
        metaDescription: "The balance between emphasizing the primary path and preserving legitimate alternatives.",
        multiplier: 3,
      },
      {
        label: "The reading order survives mobile widths",
        technicalLabel: "responsive behavior",
        metaDescription: "The guarantee that hierarchy follows meaning when the spatial composition changes.",
        multiplier: 3,
      },
      {
        label: "A first-click test confirms the intended next action",
        technicalLabel: "test",
        metaDescription: "The behavioral evidence that visual emphasis directs attention toward the intended choice.",
        multiplier: 3,
      },
    ],
  },
  {
    id: "readable-measure",
    label: "Readable measure",
    requestBase: "Make the text easier and more comfortable to read",
    targetResponse:
      "Set a readable measure of roughly 55–75 characters per body line, with line height, contrast, and responsive type settings that support sustained reading at every supported width.",
    languageOptions: [
      { register: "Plain language", term: "keep the lines from getting too long" },
      { register: "Slang", term: "give the copy room to breathe" },
      { register: "Colloquial", term: "make the article easier on the eyes" },
      { register: "Adjacent domain", term: "control the reading rhythm" },
      { register: "Term of art", term: "set a readable measure" },
    ],
    naiveGuess: 0,
    termOfArt: 4,
    constraints: [
      {
        label: "The domain is long-form article text",
        technicalLabel: "scope",
        metaDescription: "The sustained reading context in which line length and rhythm have compounding effects.",
        multiplier: 6,
      },
      {
        label: "Body lines stay between 55 and 75 characters",
        technicalLabel: "measure",
        metaDescription: "The target line length that constrains the text column rather than the entire page shell.",
        multiplier: 5,
      },
      {
        label: "Line height and contrast support sustained reading",
        technicalLabel: "legibility",
        metaDescription: "The related typographic conditions that line length alone cannot guarantee.",
        multiplier: 3,
      },
      {
        label: "Type and measure adapt across supported widths",
        technicalLabel: "responsive behavior",
        metaDescription: "The guarantee that the reading experience survives changes in viewport and font size.",
        multiplier: 3,
      },
      {
        label: "Every supported viewport is checked for overflow and measure",
        technicalLabel: "test",
        metaDescription: "The acceptance check for layout failures and lines that fall outside the intended range.",
        multiplier: 3,
      },
    ],
  },
  {
    id: "branding",
    label: "Branding",
    requestBase: "Make this feel more like our brand",
    targetResponse:
      "Activate a coordinated system of distinctive color, typography, shape, imagery, motion, and voice cues that remains recognizable without the logo and survives different formats.",
    languageOptions: [
      { register: "Plain language", term: "make everything feel consistent" },
      { register: "Slang", term: "make it feel more us" },
      { register: "Colloquial", term: "bring it on-brand" },
      { register: "Adjacent domain", term: "use a recognizable signature" },
      { register: "Term of art", term: "activate distinctive brand assets" },
    ],
    naiveGuess: 0,
    termOfArt: 4,
    constraints: [
      {
        label: "Recognition works without the logo",
        technicalLabel: "scope",
        metaDescription: "The recognition problem includes executions where the primary identifying mark is absent.",
        multiplier: 6,
      },
      {
        label: "Color, typography, shape, imagery, motion, and voice work together",
        technicalLabel: "system",
        metaDescription: "The coordinated asset system that creates recognition instead of relying on a single cue.",
        multiplier: 5,
      },
      {
        label: "Assets differ from category conventions",
        technicalLabel: "distinction",
        metaDescription: "The requirement that brand cues identify this brand rather than merely signaling its market category.",
        multiplier: 3,
      },
      {
        label: "Recognition survives different formats and campaigns",
        technicalLabel: "invariant",
        metaDescription: "The guarantee that the system remains attributable while individual executions change.",
        multiplier: 3,
      },
      {
        label: "Branded and unbranded examples are included",
        technicalLabel: "evidence",
        metaDescription: "The comparison set used to separate genuine recognition from recognition supplied by the logo.",
        multiplier: 3,
      },
      {
        label: "Success is unaided recognition and correct brand attribution",
        technicalLabel: "test",
        metaDescription: "The observable result that determines whether the assets form a distinctive, recognizable system.",
        multiplier: 3,
      },
    ],
  },
];

const REGISTER_INTERPRETATIONS: Record<LanguageOption["register"], number> = {
  "Plain language": 4.8,
  Slang: 5.2,
  Colloquial: 4.4,
  "Adjacent domain": 3.6,
  "Term of art": 1.8,
};

const RESPONSE_METHOD_LABELS = new Set(["family", "method", "control", "system"]);
const RESPONSE_EVIDENCE_LABELS = new Set(["example", "counterexample", "evidence", "test"]);

function compactAssumption(label: string): string {
  return label
    .replace(/^The domain is /i, "")
    .replace(/^The scope is /i, "")
    .replace(/^The /i, "")
    .replace(/\bis known\b/i, "known")
    .replace(/\bare required\b/i, "required")
    .replace(/\bis required\b/i, "required")
    .replace(/^./, (character) => character.toUpperCase());
}

function PredictionFigure() {
  const [scenarioId, setScenarioId] = useState<Scenario["id"]>("sorting");
  const [languageIndex, setLanguageIndex] = useState(SCENARIOS[0].naiveGuess);

  const scenario = SCENARIOS.find((entry) => entry.id === scenarioId) ?? SCENARIOS[0];
  const selectedOption = scenario.languageOptions[languageIndex] ?? scenario.languageOptions[scenario.naiveGuess];
  const termOfArt = scenario.languageOptions[scenario.termOfArt];
  const possibleInterpretations = REGISTER_INTERPRETATIONS[selectedOption.register];
  const entropy = Math.log2(possibleInterpretations);
  const ambiguityPercent = Math.max(
    2,
    ((possibleInterpretations - 1) / (REGISTER_INTERPRETATIONS.Slang - 1)) * 100,
  );

  const selectScenario = (id: Scenario["id"]) => {
    const nextScenario = SCENARIOS.find((entry) => entry.id === id) ?? SCENARIOS[0];
    setScenarioId(id);
    setLanguageIndex(nextScenario.naiveGuess);
  };

  const termSelected = languageIndex === scenario.termOfArt;
  const targetActivated = termSelected;
  const activatedAssumptions = scenario.constraints
    .filter(
      (constraint) =>
        !RESPONSE_METHOD_LABELS.has(constraint.technicalLabel) &&
        !RESPONSE_EVIDENCE_LABELS.has(constraint.technicalLabel),
    )
    .slice(0, 3)
    .map((constraint) => compactAssumption(constraint.label));

  const responseText = targetActivated
    ? scenario.targetResponse
    : `“${selectedOption.term}” changes the phrasing, but it does not yet select the governing domain method. Several response families remain plausible.`;

  return (
    <figure aria-label="How prompt language directs a response">
      <div style={figureFrame}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(180px, .6fr)", gap: 14, alignItems: "end", marginBottom: 14 }}>
          <div>
            <label
              htmlFor="prediction-example-domain"
              style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-foreground-muted)" }}
            >
              Example domain
            </label>
            <p style={{ margin: "5px 0 0", fontSize: 12, lineHeight: 1.45, color: "var(--color-foreground-muted)" }}>
              Sets the problem context only; it does not choose the interpretation.
            </p>
          </div>
          <select
            id="prediction-example-domain"
            value={scenarioId}
            onChange={(event) => selectScenario(event.currentTarget.value as Scenario["id"])}
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "1px solid var(--line)",
              borderRadius: 4,
              background: "var(--color-surface)",
              color: "var(--color-foreground)",
              fontFamily: "inherit",
              fontSize: 12,
            }}
          >
            {SCENARIOS.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            padding: "12px 14px",
            border: "1px solid var(--line)",
            background: "var(--color-card)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--color-foreground-muted)",
            }}
          >
            Starting request
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.5, color: "var(--color-foreground)" }}>
            “{scenario.requestBase}.”
          </p>
        </div>

        <h4
          style={{
            margin: "18px 0 0",
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 480,
            letterSpacing: "-.01em",
            lineHeight: 1.25,
            color: "var(--color-foreground-strong)",
          }}
        >
          Choose the language that directs the response
        </h4>
        <div
          role="radiogroup"
          aria-label="Prompt language"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 8,
            margin: "12px 0 0",
          }}
        >
          {scenario.languageOptions.map((option, index) => {
            const isSelected = index === languageIndex;
            const isTermOfArt = index === scenario.termOfArt;
            return (
              <button
                key={`${option.register}-${option.term}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${option.register}: ${option.term}`}
                onClick={() => setLanguageIndex(index)}
                style={{
                  minWidth: 0,
                  padding: "11px 12px",
                  border: `1px solid ${isSelected ? "var(--color-primary)" : "var(--line)"}`,
                  borderRadius: 4,
                  background: isSelected ? "var(--color-card)" : "var(--color-surface)",
                  color: "var(--color-foreground)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: 8,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: isTermOfArt ? "var(--color-primary)" : "var(--color-foreground-muted)",
                    lineHeight: 1.35,
                  }}
                >
                  {option.register}
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: 5,
                    fontSize: 12,
                    lineHeight: 1.4,
                    color: "var(--color-foreground)",
                  }}
                >
                  {option.term}
                </span>
                {isTermOfArt ? (
                  <span style={{ display: "block", marginTop: 6, fontSize: 9, lineHeight: 1.35, color: "var(--color-primary)" }}>
                    Domain-specific direction
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 14, padding: "12px 14px", border: "1px solid var(--line)", background: "var(--color-card)" }}>
          <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-primary)" }}>
            Composed prompt
          </p>
          <dl style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", columnGap: 12, rowGap: 6, margin: "9px 0 0" }}>
            <dt style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--color-foreground-muted)" }}>
              Task
            </dt>
            <dd style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--color-foreground)" }}>{scenario.requestBase}</dd>
            <dt style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--color-foreground-muted)" }}>
              Direction
            </dt>
            <dd style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--color-foreground)" }}>{selectedOption.term}</dd>
          </dl>
        </div>

        <div style={{ margin: "14px 0 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-foreground-muted)" }}>
              Possible response directions
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-primary)" }}>
              ≈ {possibleInterpretations.toFixed(1)}
            </p>
          </div>
          <div
            role="meter"
            aria-label="Possible response directions"
            aria-valuemin={1}
            aria-valuemax={REGISTER_INTERPRETATIONS.Slang}
            aria-valuenow={Number(possibleInterpretations.toFixed(1))}
            aria-valuetext={`Approximately ${possibleInterpretations.toFixed(1)} plausible response directions; relative ambiguity ${entropy.toFixed(2)} bits`}
            style={{ height: 8, marginTop: 8, border: "1px solid var(--line)", background: "var(--color-surface)" }}
          >
            <div
              aria-hidden="true"
              style={{
                width: `${ambiguityPercent}%`,
                height: "100%",
                background: "var(--color-primary)",
                transition: "width 180ms var(--ease-draw)",
              }}
            />
          </div>
          <p style={{ margin: "7px 0 0", fontSize: 11, lineHeight: 1.45, color: "var(--color-foreground-muted)" }}>
            Relative ambiguity H ≈ {entropy.toFixed(2)} bits. This is an illustrative proxy, not a measured model
            probability.
          </p>
        </div>

        <div aria-live="polite" style={{ marginTop: 14, padding: "14px", border: `1px solid ${targetActivated ? "var(--color-primary)" : "var(--line)"}`, background: "var(--color-surface)" }}>
          <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: targetActivated ? "var(--color-primary)" : "var(--color-foreground-muted)" }}>
            {targetActivated ? `Domain response activated — ${termOfArt.term}` : "Broad response"}
          </p>
          <p style={{ margin: "7px 0 0", fontSize: 13, lineHeight: 1.55, color: "var(--color-foreground)" }}>
            {responseText}
          </p>
          {termSelected ? (
            <div
              aria-label="Assumptions activated"
              style={{
                marginTop: 11,
                paddingTop: 10,
                borderTop: "1px solid var(--line)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--color-primary)",
                }}
              >
                Assumptions activated
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 11, lineHeight: 1.5, color: "var(--color-foreground-muted)" }}>
                {activatedAssumptions.join(" · ")}
              </p>
            </div>
          ) : null}
          <p style={{ margin: "9px 0 0", fontSize: 11, lineHeight: 1.45, color: "var(--color-foreground-muted)" }}>
            Specific valid terms activate structure; jargon without valid assumptions does not.
          </p>
        </div>
      </div>
      <FigureCaption>
        Prompt direction and ambiguity — the scenario sets context, the selected phrase directs the response, and a
        valid term reveals the assumptions that make its direction meaningful.
      </FigureCaption>
    </figure>
  );
}

const HASH_SORT_EXAMPLE = `type SortOrder =
  | "ascending"
  | "descending";

export function hashSort(
  values: readonly number[],
  order: SortOrder = "ascending",
): number[] {
  const frequencyByValue =
    new Map<number, number>();

  for (const value of values) {
    if (!Number.isSafeInteger(value)) {
      throw new TypeError("hashSort accepts safe integers only");
    }

    frequencyByValue.set(
      value,
      (frequencyByValue.get(value) ?? 0) + 1,
    );
  }

  const keys = [...frequencyByValue.keys()].sort((left, right) =>
    order === "ascending" ? left - right : right - left,
  );

  return keys.flatMap((value) =>
    Array.from(
      { length: frequencyByValue.get(value)! },
      () => value,
    ),
  );
}

const input = [7, 2, 7, 1, 4, 2];
hashSort(input); // [1, 2, 2, 4, 7, 7]`;

const HASH_SORT_INFERRED_STRUCTURE = [
  "Map-based frequency buckets",
  "Ascending numeric order",
  "Duplicate preservation",
  "Immutable input",
  "Safe-integer validation",
] as const;

function PromptExpansionFigure() {
  return (
    <figure aria-label="Generative decompression from a compact prompt to a TypeScript implementation">
      <div style={{ ...figureFrame, padding: "clamp(14px, 3vw, 22px)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "var(--color-primary)",
              }}
            >
              Generative decompression
            </p>
            <h4
              style={{
                margin: "6px 0 0",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 470,
                letterSpacing: "-.015em",
                lineHeight: 1.15,
                color: "var(--color-foreground-strong)",
              }}
            >
              A small address opens a large structure
            </h4>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--color-foreground-muted)",
            }}
          >
            4 words → many output tokens
          </p>
        </div>

        <div
          aria-label="Compact prompt"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
            alignItems: "stretch",
            gap: 10,
            marginTop: 18,
          }}
        >
          <div style={{ padding: "14px", border: "1px solid var(--color-primary)", background: "var(--color-card)" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-foreground-muted)" }}>
              Algorithm family
            </p>
            <code style={{ display: "block", marginTop: 7, fontSize: "clamp(14px, 2vw, 18px)", color: "var(--color-foreground-strong)" }}>
              hash sort
            </code>
          </div>
          <span aria-hidden="true" style={{ alignSelf: "center", color: "var(--color-primary)", fontFamily: "var(--font-mono)", fontSize: 18 }}>
            +
          </span>
          <div style={{ padding: "14px", border: "1px solid var(--color-primary)", background: "var(--color-card)" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-foreground-muted)" }}>
              Language and form
            </p>
            <code style={{ display: "block", marginTop: 7, fontSize: "clamp(14px, 2vw, 18px)", color: "var(--color-foreground-strong)" }}>
              in TypeScript
            </code>
          </div>
        </div>

        <div style={{ display: "grid", justifyItems: "center", gap: 7, margin: "13px 0" }}>
          <span aria-hidden="true" style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)", fontSize: 18, lineHeight: 1 }}>
            ↓
          </span>
          <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", textAlign: "center", color: "var(--color-foreground-muted)" }}>
            Selects a learned response family
          </p>
        </div>

        <div
          aria-label="Defaults inferred while expanding the prompt"
          style={{ padding: "13px 14px", border: "1px solid var(--line)", background: "var(--color-surface)" }}
        >
          <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-primary)" }}>
            Learned conventions supplied during expansion
          </p>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 7,
              margin: "10px 0 0",
              padding: 0,
              listStyle: "none",
            }}
          >
            {HASH_SORT_INFERRED_STRUCTURE.map((item) => (
              <li
                key={item}
                style={{
                  padding: "5px 8px",
                  border: "1px solid var(--line)",
                  background: "var(--color-card)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 8,
                  letterSpacing: ".04em",
                  lineHeight: 1.4,
                  color: "var(--color-foreground-muted)",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: "grid", justifyItems: "center", gap: 7, margin: "13px 0" }}>
          <span aria-hidden="true" style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)", fontSize: 18, lineHeight: 1 }}>
            ↓
          </span>
          <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", textAlign: "center", color: "var(--color-foreground-muted)" }}>
            Expands into an explicit, testable artifact
          </p>
        </div>

        <div aria-label="Expanded TypeScript response" style={{ border: "1px solid var(--line)", background: "var(--color-card)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "10px 13px", borderBottom: "1px solid var(--line)" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-primary)" }}>
              Example TypeScript implementation
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--color-foreground-muted)" }}>
              Response length depends on tokenizer
            </p>
          </div>
          <pre
            style={{
              maxWidth: "100%",
              margin: 0,
              padding: "16px",
              overflowX: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(9px, 1.35vw, 12px)",
              lineHeight: 1.65,
              color: "var(--color-foreground)",
              tabSize: 2,
            }}
          >
            <code>{HASH_SORT_EXAMPLE}</code>
          </pre>
          <div style={{ padding: "11px 13px", borderTop: "1px solid var(--line)" }}>
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.5, color: "var(--color-foreground-muted)" }}>
              The generated answer makes the chosen defaults inspectable: duplicates survive, the input is unchanged,
              and the cost is <code>O(n + k log k)</code> time with <code>O(k)</code> additional space for <code>k</code>{" "}
              distinct values.
            </p>
          </div>
        </div>
      </div>
      <FigureCaption>
        Prompt expansion — the four-word instruction preserves a compact direction, while the response supplies
        learned conventions and inferred defaults. This is generative reconstruction, not lossless decoding of
        information literally stored in four words.
      </FigureCaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* F4 — The code constraint stack                                      */
/* ------------------------------------------------------------------ */

const CONSTRAINT_STACK = [
  { layer: "Corpus", rejects: "accumulates what practitioners wrote under real conditions" },
  { layer: "Syntax", rejects: "invalid token sequences before anything else runs" },
  { layer: "Types", rejects: "invalid relationships between values and operations" },
  { layer: "Tests", rejects: "specified behavioral failures" },
  { layer: "Runtime", rejects: "crashes, latency, and resource misuse" },
  { layer: "Users", rejects: "behavior that fails in the world — physical, economic, human" },
] as const;

function ConstraintStackFigure() {
  return (
    <figure aria-label="The code constraint stack from corpus to user consequences">
      <div
        style={{
          ...figureFrame,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 560,
        }}
      >
        {CONSTRAINT_STACK.map((entry, index) => (
          <div
            key={entry.layer}
            style={{
              display: "grid",
              gridTemplateColumns: "110px minmax(0, 1fr)",
              gap: 14,
              alignItems: "center",
              padding: "10px 14px",
              border: "1px solid var(--line)",
              background: index === 0 ? "var(--color-card)" : "var(--color-surface)",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--color-primary)" }}>
              {entry.layer}
            </span>
            <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-foreground-muted)" }}>
              {index === 0 ? "contains the patterns" : "rejects"}&nbsp;{entry.rejects}
            </span>
          </div>
        ))}
      </div>
      <FigureCaption>
        The code constraint stack — every layer filters invalid expressions, which is why the language that survives is unusually pattern-dense.
      </FigureCaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* F5 — How constraints become language and return to practice         */
/* ------------------------------------------------------------------ */

const TRUTH_TO_COMPUTATION_STAGES = [
  {
    phase: "Labeling",
    lens: "Correspondence · Does it match?",
    title: "Labels are tested against the world",
    body: "Observation, measurement, and counterexamples correct names that fail to track events, objects, properties, or relations.",
    signal: "observe + name + correct",
  },
  {
    phase: "Operationalization",
    lens: "Consequence · Does it work?",
    title: "Useful distinctions become efficient terms",
    body: "Repeated practice compresses successful inputs, operations, boundaries, and failure modes into terms of art that guide action.",
    signal: "execute + select + compress",
  },
  {
    phase: "Formalization",
    lens: "Coherence · Does it fit?",
    title: "Explicit rules make labels compositional",
    body: "Mathematics, logic, type systems, and programming languages specify how symbols may combine and what follows.",
    signal: "abstract + relate + derive",
  },
] as const;

function ConstraintFeedbackFigure() {
  return (
    <figure aria-label="Working hypothesis from correspondence through consequence and coherence to computation">
      <div style={{ ...figureFrame, padding: "clamp(14px, 3vw, 22px)" }}>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--color-primary)",
          }}
        >
          Working hypothesis
        </p>
        <h4
          style={{
            margin: "6px 0 0",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(21px, 3vw, 29px)",
            fontWeight: 470,
            letterSpacing: "-.015em",
            lineHeight: 1.15,
            color: "var(--color-foreground-strong)",
          }}
        >
          From labeling the world to computation
        </h4>
        <p style={{ margin: "9px 0 0", fontSize: 12, lineHeight: 1.55, color: "var(--color-foreground-muted)" }}>
          Read downward. Correspondence grounds labels; consequence operationalizes and compresses those that work;
          coherence formalizes their relations; computation applies the resulting structure.
        </p>

        <ol style={{ margin: "18px 0 0", padding: 0, listStyle: "none" }}>
          {TRUTH_TO_COMPUTATION_STAGES.map((stage, index) => (
            <li key={stage.phase}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "38px minmax(0, 1fr)",
                  gap: 12,
                  alignItems: "stretch",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 34,
                    height: 34,
                    marginTop: 2,
                    border: "1px solid var(--color-primary)",
                    borderRadius: "50%",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "var(--color-primary)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div style={{ padding: "13px 14px", border: "1px solid var(--line)", background: "var(--color-surface)" }}>
                  <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".11em", textTransform: "uppercase", color: "var(--color-primary)" }}>
                    {stage.phase}
                  </p>
                  <p style={{ margin: "5px 0 0", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".04em", lineHeight: 1.45, color: "var(--color-foreground-muted)" }}>
                    {stage.lens}
                  </p>
                  <p style={{ margin: "5px 0 0", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 470, lineHeight: 1.25, color: "var(--color-foreground-strong)" }}>
                    {stage.title}
                  </p>
                  <p style={{ margin: "6px 0 0", fontSize: 11, lineHeight: 1.55, color: "var(--color-foreground-muted)" }}>
                    {stage.body}
                  </p>
                  <code style={{ display: "inline-block", marginTop: 9, padding: "4px 7px", border: "1px solid var(--line)", fontSize: 8, lineHeight: 1.4, color: "var(--color-foreground)" }}>
                    {stage.signal}
                  </code>
                </div>
              </div>
              {index < TRUTH_TO_COMPUTATION_STAGES.length - 1 ? (
                <div
                  aria-hidden="true"
                  style={{
                    width: 1,
                    height: 18,
                    margin: "4px 0 4px 17px",
                    background: "var(--color-primary)",
                    position: "relative",
                  }}
                >
                  <span style={{ position: "absolute", left: -4, bottom: -5, color: "var(--color-primary)", fontSize: 11 }}>↓</span>
                </div>
              ) : null}
            </li>
          ))}
        </ol>

        <div
          aria-hidden="true"
          style={{
            width: 1,
            height: 18,
            margin: "4px 0 4px 17px",
            background: "var(--color-primary)",
            position: "relative",
          }}
        >
          <span style={{ position: "absolute", left: -4, bottom: -5, color: "var(--color-primary)", fontSize: 11 }}>↓</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "38px minmax(0, 1fr)",
            gap: 12,
            alignItems: "stretch",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              display: "grid",
              placeItems: "center",
              width: 34,
              height: 34,
              marginTop: 2,
              border: "1px solid var(--line)",
              borderRadius: "50%",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              color: "var(--color-primary)",
            }}
          >
            →
          </div>
          <div style={{ padding: "13px 14px", border: "1px solid var(--color-primary)", background: "var(--color-card)" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".11em", textTransform: "uppercase", color: "var(--color-primary)" }}>
              Computation
            </p>
            <p style={{ margin: "5px 0 0", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".04em", lineHeight: 1.45, color: "var(--color-foreground-muted)" }}>
              Resulting capability — not a fourth theory of truth
            </p>
            <p style={{ margin: "5px 0 0", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 470, lineHeight: 1.25, color: "var(--color-foreground-strong)" }}>
              Formal relations become machine-operable
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 11, lineHeight: 1.55, color: "var(--color-foreground-muted)" }}>
              Machines can generate synthetic cases, type-check programs, prove derivations, simulate models, and
              execute tests.
            </p>
            <code style={{ display: "inline-block", marginTop: 9, padding: "4px 7px", border: "1px solid var(--line)", fontSize: 8, lineHeight: 1.4, color: "var(--color-foreground)" }}>
              generate + derive + execute
            </code>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto minmax(0, 1fr)",
            gap: 10,
            alignItems: "center",
            marginTop: 14,
            padding: "11px 13px",
            border: "1px solid var(--color-primary)",
            background: "var(--color-card)",
          }}
        >
          <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--color-primary)" }}>
            ↺
          </span>
          <p style={{ margin: 0, fontSize: 11, lineHeight: 1.5, color: "var(--color-foreground-muted)" }}>
            <strong style={{ color: "var(--color-foreground-strong)" }}>Regrounding closes the loop.</strong>{" "}
            A proof establishes derivability from stated premises; a program may compile and pass its tests. Neither
            result alone shows that the premises model the world, the synthetic data are representative, or the outcome
            is worth pursuing.
          </p>
        </div>
      </div>
      <FigureCaption>
        Hypothesis — correspondence grounds labels; consequence selects and compresses those that work; coherence
        formalizes their relations. Computation uses that structure, but its results must be regrounded.
      </FigureCaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ArticlePage({
  post,
  assetUrl,
}: {
  post: PublishedPost;
  assetUrl: (value: string) => string;
}) {
  const publishedLabel = new Date(`${post.publishedAt}T00:00:00.000Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <TooltipProvider delayDuration={600}>
      <div className="article-outline">
        <header className="article-outline__header">
          <p className="eyebrow">Essay</p>
          <h1>{post.title}</h1>
          <p className="article-description">{post.description}</p>
          <div className="article-meta">
            <span>Published {publishedLabel}</span>
          </div>
          {post.tags.length > 0 ? (
            <ul className="article-tags" aria-label="Topics">
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}

          <div className="article-outline__lede">
            <p>Consider two prompts that ask for the same outcome:</p>
            <blockquote>
              <p>Implement hash-based sorting for this array.</p>
            </blockquote>
            <blockquote>
              <p>Efficiently organize these numbers.</p>
            </blockquote>
            <p>
              Both ask for an efficient ordering. Only the first identifies a known problem space. Used correctly,
              that identification carries a higher and more useful information density: it activates shared
              assumptions, methods, and tradeoffs, sharply narrowing what a competent response should contain. The
              terminology is not a guarantee; its assumptions still have to fit the problem.
            </p>
            <ClaimCard eyebrow="Core thesis" title="Fluency follows constraint.">
              <p style={{ margin: 0 }}>
                Language records what a domain rewards and rejects. Models learn those patterns. Strong feedback makes
                fluent output informative; weak feedback makes it merely plausible.
              </p>
            </ClaimCard>
            <p>
              The question driving this essay is: <strong>how do communities compress tested distinctions into
              language, and how do models use that language to narrow plausible continuations?</strong> The answer
              connects forms of truth to embeddings, entropy, and prompting.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-foreground-muted)" }}>
              Building on{" "}
              <LinkPreview url="/writing/goals-solutions-and-value" asChild>
                <Link to="/writing/$slug" params={{ slug: "goals-solutions-and-value" }}>Goals, Solutions &amp; Value</Link>
              </LinkPreview>
              {", this essay leads into "}
              <LinkPreview url="/writing/understanding-is-the-bottleneck" asChild>
                <Link to="/writing/$slug" params={{ slug: "understanding-is-the-bottleneck" }}>The Understanding Bottleneck</Link>
              </LinkPreview>
              {" and "}
              <LinkPreview url="/writing/the-knowledge-factory" asChild>
                <Link to="/writing/$slug" params={{ slug: "the-knowledge-factory" }}>The Knowledge Factory</Link>
              </LinkPreview>
              {". Together, the sequence moves from human stakes to evaluated, reusable knowledge."}
            </p>
          </div>
        </header>

        <Section index="01" title="Truth and Propositional Formulations">
          <p>
            Six overlapping truth practices shape the language around us. Treat them as an editorial framework, not
            a universal philosophical taxonomy: the same claim can participate in several practices at once.
          </p>
          <p>
            Begin with three practices most visibly entangled with subjective experience, belief, and personal or
            communal value: relational acquaintance, sincerity, and trustworthiness. They ask whether an
            account remains faithful to lived experience, whether expression aligns with inward state, whether
            reliance is warranted, and how those judgments reflect what people value. This is the territory of{" "}
            <LinkPreview url="/writing/goals-solutions-and-value" asChild>
              <Link to="/writing/$slug" params={{ slug: "goals-solutions-and-value" }}>
                Goals, Solutions &amp; Value
              </Link>
            </LinkPreview>
            {": what matters, what ought to be trusted, and whose purposes count cannot be supplied by formalism alone. "}
            These practices are situated and value-laden, but that does not make them arbitrary.
          </p>
          <SituatedTruthPracticesFigure assetUrl={assetUrl} />
          <p>
            Their feedback remains substantive: people with direct acquaintance can challenge an account; conduct can
            contradict an avowal; and reliance can fail. The
            stage-door example in Kane Baker&apos;s{" "}
            <LinkPreview url="https://www.youtube.com/watch?v=c9BFn4Kqj0E&t=1954s" external>
              “Nonpropositional Truth”
            </LinkPreview>{" "}
            makes the distinction concrete: a door that ought not be trusted by either Sienna or Pearl counts as false
            in this normative sense regardless of anyone&apos;s intent to deceive. The language of a domain records which
            of these checks have been running — and how hard they bite.
          </p>
          <p>
            Three other practices become the recurring thread of this article: formal truth as coherence, empirical
            truth as correspondence, and operational truth as consequence. Their memorable questions — does it fit,
            does it match, and does it work? — separate internal validity, contact with the world, and successful
            action.
          </p>
          <TruthPracticesFigure
            practices={RECURRING_TRUTH_PRACTICES}
            ariaLabel="Three recurring truth practices that compose reusable problem-solving formulations"
            eyebrow="Recurring thread"
            title="Coherence · Correspondence · Consequence"
            caption="Recurring truth practices — correspondence grounds labels, consequence tests operations, and coherence makes the surviving relationships compositional."
          />
          <p>
            Together, the three can compose into patterned formulations. Correspondence gives stable labels to
            recurring observable features; consequence preserves procedures that repeatedly produce useful outputs;
            coherence abstracts those labels and operations into definitions, algorithms, and proofs. A community can
            therefore build a reusable problem-solving pattern before the next concrete problem instance is known.
            When a new situation is recognized as an instance of that pattern, its terminology retrieves candidate
            operations and exposes assumptions for testing. The pattern does not solve an unknown problem by magic; it
            gives future problems a tested structure into which they may fit.
          </p>
        </Section>

        <Section index="02" title="From Context to Coordinates to Probabilities">
          <p>
            J. R. Firth&apos;s maxim, “You shall know a word by the company it keeps,” captured the distributional premise
            later formalized by Zellig Harris&apos;s{" "}
            <LinkPreview
              url="https://www.its.caltech.edu/~matilde/ZelligHarrisDistributionalStructure1954.pdf"
              external
            >
              <em>Distributional Structure</em>
            </LinkPreview>
            . Modern embeddings operationalize a limited version of that idea: repeated context becomes geometry, not a
            complete theory of meaning. In Word2Vec&apos;s skip-gram objective, target and context tables{" "}
            <code>Wᵢₙ</code> and <code>Wₒᵤₜ</code> are scored by a dot product. Training raises scores for observed pairs
            and lowers them for sampled non-neighbors; rows of <code>Wᵢₙ</code> become the embeddings described in the{" "}
            <LinkPreview
              url="https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/"
              external
            >
              2013 Word2Vec paper
            </LinkPreview>
            . Firth&apos;s original formulation appears in{" "}
            <LinkPreview url="https://languagelog.ldc.upenn.edu/myl/Firth1957.pdf" external>
              <em>A Synopsis of Linguistic Theory, 1930–1955</em>
            </LinkPreview>
            .
          </p>
          <EmbeddingCompositionExplorer />
          <p>
            A tokenizer assigns each token an integer ID. For vocabulary <code>V</code> and width <code>d</code>, the
            learned table <code>E ∈ ℝ^&#123;|V|×d&#125;</code> maps token <code>xᵢ</code> to{" "}
            <code>eᵢ = E[xᵢ] ∈ ℝᵈ</code>. A phrase may span several tokens and therefore enters as several vectors. The
            rows begin as arbitrary values and acquire predictive structure during training; a decoder transformer
            learns them inside its next-token objective rather than in a separate Word2Vec task.
          </p>
          <p>
            Cosine similarity and distance make neighborhoods visible: nearby points are close under learned usage, not
            necessarily true in the world. Recurring offsets can also suggest directions such as{" "}
            <code>man + royal ≈ king</code>. The explorer compresses a much larger space into three hand-authored
            dimensions. Its equations are geometric intuition, not measured Word2Vec identities or guaranteed semantic
            arithmetic.
          </p>
          <p>
            An input embedding is only the starting state. Position, attention, and feed-forward layers transform it
            into a{" "}
            <Term label="contextual hidden state">
              A vector for one token position after the model combines that token with the surrounding prompt.
            </Term>{" "}
            that changes with context. <em>Stable</em> therefore produces different states in <em>stable counting sort</em>{" "}
            and <em>stable employment</em>.
          </p>
          <details style={{ margin: "1.5em 0" }}>
            <summary
              style={{
                padding: "13px 16px",
                border: "1px solid var(--line)",
                background: "var(--color-card)",
                color: "var(--color-primary)",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: ".13em",
                textTransform: "uppercase",
              }}
            >
              Engram metaphor
            </summary>
            <ClaimCard eyebrow="A helpful engram" title="Three kinds of memory — keep them distinct">
              <p style={{ margin: 0 }}>
                Use this card as a small <em>engram about engrams</em>: a compact cue for recalling three mechanisms that
                are often gathered under the metaphor of memory.
              </p>
              <ul style={{ display: "grid", gap: 10, margin: "14px 0 0", paddingLeft: "1.2em" }}>
                <li>
                  <strong>Biological engram — trace.</strong> A physical change in living neural tissue associated with
                  storing and later reactivating an experience.{" "}
                  <LinkPreview url="https://www.nature.com/articles/nrn4000" external>
                    Engram research
                  </LinkPreview>
                  .
                </li>
                <li>
                  <strong>Token embedding — parameter.</strong> A learned row in a model&apos;s embedding table. Training
                  makes it predictively useful, but it is neither an episodic memory nor a stored source record.
                </li>
                <li>
                  <strong>Vector-indexed record — record and address.</strong> Durable application content stored beside
                  an embedding; similarity search uses the vector as an address for retrieving the record.
                </li>
              </ul>
              <p style={{ margin: "14px 0 0", color: "var(--color-foreground-muted)" }}>
                The useful metaphor is that past structure can guide later activation. The mechanisms remain different.
                Remember: <strong style={{ color: "var(--color-foreground-strong)" }}>trace · parameter · record</strong>.
              </p>
            </ClaimCard>
          </details>

          <p>
            <code>Token ID → input embedding → contextual hidden state → output logits → next-token probabilities.</code>
          </p>

          <p>
            At the final prompt position, an output projection produces one{" "}
            <Term label="logit">An unnormalized score for a possible next token.</Term> per vocabulary token.{" "}
            <Term label="Softmax">A normalization that turns logits into probabilities that add to one.</Term> converts
            those scores into <code>P(next token | prompt)</code>. A decoder chooses or samples a token, appends it, and
            repeats.
          </p>
          <ClaimCard eyebrow="Important boundary" title="Embedding geometry is not output probability">
            <p style={{ margin: 0 }}>
              Similar input embeddings can reveal learned relationships, but they do not determine the next token. The
              full prompt, transformer layers, and output projection intervene before softmax produces a distribution.
            </p>
          </ClaimCard>
          <p>
            A valid term of art steers a response by shifting contextual states toward learned technical patterns; the
            prompt must still supply the assumptions that make those patterns applicable. The next section examines how
            that shift narrows uncertainty. For the cross-entropy and backpropagation that shaped these weights, see the{" "}
            <LinkPreview url="/writing/goals-solutions-and-value" asChild>
              <Link to="/writing/$slug" params={{ slug: "goals-solutions-and-value" }}>
                training walkthrough in Goals, Solutions &amp; Value
              </Link>
            </LinkPreview>
            .
          </p>
        </Section>

        <Section index="03" title="Entropy, Surprise, and Conditional Prediction">
          <p>
            Information theory gives us a precise way to talk about the uncertainty a request leaves behind. A{" "}
            <Term label="probability distribution">
              A description of how much weight a system assigns to each possible outcome; outcomes with more weight
              are considered more likely.
            </Term>{" "}
            represents uncertainty among possible messages or symbols. A less probable observation carries more{" "}
            <Term label="surprise">
              A measure of how unlikely an observation is under a distribution; rarer outcomes are more surprising.
            </Term>{" "}
            under that distribution. <Term label="Entropy">
              Shannon entropy summarizes the expected uncertainty of a distribution in bits; it is not a claim about
              disorder in the world.
            </Term>{" "}
            is the expected surprise — a summary of how much the system still has to learn before it can pick an
            outcome confidently. <Term label="Conditional prediction">
              Asking how the distribution changes when prior context is known, rather than predicting from nothing.
            </Term>{" "}
            asks how that distribution changes when prior context is known.
          </p>
          <p>
            Modern language modeling operationalizes these ideas directly. A next-token model estimates a{" "}
            <Term label="distribution">
              A description of how much weight a system assigns to each possible outcome; outcomes with more weight
              are considered more likely.
            </Term>{" "}
            over possible continuations given the preceding context. Training penalizes probability assigned away
            from observed continuations, commonly through a <Term label="cross-entropy">
              A loss that scores how well the model's predicted distribution matches the observed next token; lower
              values mean the model assigned the observed token more probability.
            </Term>{" "}
            objective. The result is not a database of sentences; it is a learned structure of conditional
            regularities.
          </p>
          <p>
            The lineage here matters. Claude Shannon did not invent language models, and next-token prediction does
            not follow automatically from his work. In{" "}
            <LinkPreview url="https://doi.org/10.1002/j.1538-7305.1948.tb01338.x" external>
              “A Mathematical Theory of Communication”
            </LinkPreview>
            , Shannon defined entropy as uncertainty in a probability distribution; in{" "}
            <LinkPreview url="https://doi.org/10.1002/j.1538-7305.1951.tb01366.x" external>
              “Prediction and Entropy of Printed English”
            </LinkPreview>
            , he had human subjects repeatedly guess the next letter of unfamiliar passages and used their prediction
            performance to estimate the redundancy of English. That is a genuine intellectual ancestor of statistical
            language modeling — and it is historical intuition, not proof that human language or thought is only
            next-token prediction.
          </p>
          <PredictionFigure />
          <p>
            The figure above is the article’s core move in miniature. An ambiguous request leaves a broad
            distribution — high entropy, many plausible continuations. A fitting term of art selects a response
            family, and valid assumptions narrow it into a handful of testable continuations. The scenario, selected
            phrase, and ambiguity meter have separate roles; the meter is an illustrative proxy, not a measured model
            probability. The model did not become smarter between the two prompts; the second prompt simply selected
            more of the structure the model had learned.
          </p>
          <p>
            Compression also runs in the other direction. The four words <code>hash sort in TypeScript</code> do not
            contain an implementation verbatim; they address a learned network of algorithmic and language
            conventions. Expanding that address can produce a much denser response while preserving the prompt’s
            direction and making its inferred choices visible.
          </p>
          <PromptExpansionFigure />
        </Section>

        <Section index="04" title="Language Patterns Carry the History of Constraint">
          <p>
            Patterns become meaningful when practices repeatedly reward some distinctions and reject others.
            Technical terms survive because they compress a history of use:
          </p>
          <ul>
            <li>a term names a distinction practitioners repeatedly needed;</li>
            <li>surrounding syntax records typical relationships;</li>
            <li>examples teach ordinary cases;</li>
            <li>failures and counterexamples define boundaries; and</li>
            <li>institutions, tools, and consequences reinforce the usage.</li>
          </ul>
          <p>
            This is why language can contain more knowledge than a glossary reveals. A term of art can point into a
            network of assumptions and operations — a <Gloss label="bounded context" title="Bounded context">
              A boundary around a set of terms and rules that keeps them consistent with each other; outside the
              boundary the same word may mean something different. Coined in domain-driven design to keep models
              honest.
            </Gloss>{" "}
            that a dictionary entry cannot enumerate. But it also explains stale or harmful fluency: language
            faithfully records fashionable habits, institutional blind spots, and repeated mistakes too.
          </p>
          <p>
            The figure below states a working hypothesis, not a settled law of language: domains subjected to repeated
            correspondence and consequence checks tend to preserve the distinctions that make those checks efficient.
            Their terms of art become compact addresses into a much larger body of inputs, operations, boundaries, and
            known failures.
          </p>
          <ConstraintFeedbackFigure />
          <p className="article-outline__flow">
            Label. Operationalize. Formalize. Compute.
          </p>
          <p>
            At the third truth-linked stage, mathematics, logic, type systems, and programming languages make
            relationships explicit enough to compose and calculate. This makes a fourth step possible: systems can
            generate synthetic cases, derive consequences, check proofs, type-check programs, and execute tests.
            These operations can supply strong evidence of coherence — and, when execution is part of the check,
            operational success — but they do not establish correspondence by themselves. The formal result must
            still be regrounded in observation, measurement, and consequence.
          </p>
          <p>
            This computational ladder does not absorb the other truth practices introduced earlier. Relational and
            acquaintance-based truth remains anchored in first-person experience, as does sincerity; trustworthiness
            depends on judgments about warranted reliance and what ought to count as dependable. Religious and
            theological traditions have often supplied languages and communities for making those judgments, but the
            practices are neither exclusively theological nor merely private. Personal values are tested and
            negotiated through relationships, shared norms, testimony, and consequences. Their constraints can be
            rigorous without becoming fully reducible to formal proof.
          </p>
        </Section>

        <Section index="05" title="Why Code Is So Pattern-Dense">
          <p>
            The practical constraints that enforce programming-language patterns form a stack. Each layer rejects
            invalid expressions before the next one ever sees them:
          </p>
          <ConstraintStackFigure />
          <p>
            These filters produce large corpora in which many patterns map to executable behavior. That makes code
            unusually compatible with predictive generation. It does not guarantee that the requested behavior was
            the right behavior — and it does not make code fully objective. Requirements, architecture, naming,
            product behavior, and acceptable tradeoffs remain human judgments.
          </p>
          <p>
            Formal mathematics intensifies the same pattern density. Definitions restrict meaning, proof rules
            constrain inference, counterexamples eliminate false generalizations, and{" "}
            <Term label="proof assistant">
              A tool like Lean that mechanically checks derivations and rejects invalid proofs.
            </Term>{" "}
            such as{" "}
            <LinkPreview url="https://lean-lang.org/" external>
              Lean
            </LinkPreview>{" "}
            can mechanically reject invalid derivations. Models can therefore search a dense field of candidate steps
            and receive sharper feedback than most natural-language domains provide. Even so, a verified derivation
            does not decide whether the formal statement captures the intended problem, or whether the result
            matters. That consequence becomes a case study in The Understanding Bottleneck.
          </p>
          <p>
            The deeper contrast is what the notes for this essay call{" "}
            <Gloss label="evaluative closure" title="Evaluative closure">
              Whether a task supplies enough evidence, constraints, feedback, and authority to determine whether a
              change is better. Code optimization usually closes the loop; strategy usually cannot.
            </Gloss>
            . A coding task often gives the system enough evidence, constraints, feedback, and authority to determine
            whether its change is better — the tests and benchmarks value the result on the system’s behalf. A
            strategy task often asks the system to define “better” while simultaneously guessing the world, the
            values, and the acceptable tradeoffs. The repository contains much of the relevant state for one; the
            decisive facts for the other may be tacit, private, or still being discovered.
          </p>
        </Section>

        <Section index="06" title="A Map of Domain Fluency">
          <p>
            When you need to know whether a model can be trusted in a domain, look for evidence that the domain’s
            language is well grounded:
          </p>
          <ul>
            <li>stable vocabulary inside a bounded context;</li>
            <li>repeated relationships among named concepts;</li>
            <li>examples and counterexamples;</li>
            <li>external checks or observable consequences;</li>
            <li>explicit uncertainty and disagreement;</li>
            <li>maintained standards, tests, or professional practices; and</li>
            <li>enough representative source material to expose variation.</li>
          </ul>
          <p>
            The warning signs are the mirror image: overloaded terms, fashionable but untested narratives, hidden
            value conflicts, sparse evidence, no corrective feedback, and evaluation that depends entirely on whether
            an answer sounds right. Fluency is domain- and task-specific, not one global measure of intelligence —
            the same model can be sharp in a strongly constrained domain and glib in a weakly constrained one.
          </p>
          <h3>Vibes to a Typographic Specification</h3>
          <p>
            Vibe designing this site’s logo exposed the point. Broad prompts produced plausible marks, but not
            controllable typography. Once I operationalized the prompt in typography’s domain language — optical
            profiles, stroke hierarchy, glyph silhouette, spacing, and construction-line density — I could make
            specific changes: detail the Bézier curves that define the iconic T shape, align stroke thickness across
            the characters at the median line, add irregular traces around the compact M used in the header and
            footer, preserve its legible ivory core, and leave the jumbo display mark untouched.
          </p>
          <p>
            You can probably tell it was vibe designed. It is still better than I thought I could make, because the
            prompt stopped asking for taste in the abstract and started defining a bounded typographic problem with
            observable constraints.
          </p>
        </Section>

        <Section index="07" title="From Abstract to Actual">
          <p>
            Close by running the three truth practices in reverse — from abstract structure back to actual conditions
            and effects:
          </p>
          <Card style={{ margin: "1.5em 0" }}>
            <CardHeader>
              <CardTitle>Coherence · Consequence · Correspondence</CardTitle>
            </CardHeader>
            <CardContent>
              <table>
                <thead>
                  <tr>
                    <th>Truth lens</th>
                    <th>Question</th>
                    <th>What the evidence establishes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Coherence</strong></td>
                    <td>Is it correct within its semantic logic?</td>
                    <td>The result follows from the system’s definitions, premises, syntax, and inference rules.</td>
                  </tr>
                  <tr>
                    <td><strong>Consequence</strong></td>
                    <td>Does it produce the intended outputs and survive the domain’s tests?</td>
                    <td>Execution and evaluation show that it works under the stated conditions.</td>
                  </tr>
                  <tr>
                    <td><strong>Correspondence</strong></td>
                    <td>Does it map back to an identifiable problem and its claimed real-world impact?</td>
                    <td>Observation, measurement, and affected people show whether the model and result track reality.</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p>
            AI can help at all three, but success at an earlier stage can simulate success at the next. A result can be
            coherent within a semantic system yet fail to produce the intended outputs. It can pass domain tests yet
            optimize a proxy that does not correspond to the actual problem or impact. The loop closes only when
            formal claims and operational results are regrounded in observable conditions and consequences for the
            people affected. Work backward from abstraction: does it fit, does it work, and does it match?
          </p>
        </Section>

        <div className="article-outline__closing">
          <blockquote>
            A model is fluent where language has learned to carry the constraints. Our work is to follow that fluency
            back through consequence to correspondence: does it fit, does it work, and does it match the world we mean
            to change?
          </blockquote>
          <p>Closing line</p>
        </div>

        <Section index="08" title="Sources">
          <ul>
            <li>
              Claude E. Shannon, {" "}
              <LinkPreview url="https://doi.org/10.1002/j.1538-7305.1948.tb01338.x" external>
                “A Mathematical Theory of Communication”
              </LinkPreview>{" "}
              (1948). Defines information entropy and conditional uncertainty.
            </li>
            <li>
              Claude E. Shannon, {" "}
              <LinkPreview url="https://doi.org/10.1002/j.1538-7305.1951.tb01366.x" external>
                “Prediction and Entropy of Printed English”
              </LinkPreview>{" "}
              (1951). Uses next-character prediction to estimate the redundancy of English.
            </li>
            <li>
              Yoshua Bengio, Réjean Ducharme, Pascal Vincent, and Christian Jauvin, {" "}
              <LinkPreview url="https://www.jmlr.org/papers/v3/bengio03a.html" external>
                “A Neural Probabilistic Language Model”
              </LinkPreview>{" "}
              (2003). Connects conditional word-sequence probabilities with learned distributed representations.
            </li>
            <li>
              Tomas Mikolov, Kai Chen, Greg Corrado, and Jeffrey Dean,{" "}
              <LinkPreview
                url="https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/"
                external
              >
                “Efficient Estimation of Word Representations in Vector Space”
              </LinkPreview>{" "}
              (2013). Introduces efficient continuous bag-of-words and skip-gram architectures for learning word vectors
              at scale.
            </li>
            <li>
              Ashish Vaswani et al., {" "}
              <LinkPreview url="https://arxiv.org/abs/1706.03762" external>
                “Attention Is All You Need”
              </LinkPreview>{" "}
              (2017). Describes learned token embeddings, contextual transformation through attention, and projection
              plus softmax into output-token probabilities.
            </li>
            <li>
              Eric Evans, {" "}
              <LinkPreview url="https://www.domainlanguage.com/ddd/reference/" external>
                <em>Domain-Driven Design Reference</em>
              </LinkPreview>
              . Defines bounded contexts and model-aligned domain language.
            </li>
            <li>
              Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein, {" "}
              <LinkPreview url="https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" external>
                <em>Introduction to Algorithms</em>
              </LinkPreview>
              . Provides the sorting and algorithmic assumptions referenced in the essay.
            </li>
            <li>
              Jeremy Avigad, Leonardo de Moura, Soonho Kong, and Sebastian Ullrich, {" "}
              <LinkPreview url="https://docs.lean-lang.org/theorem_proving_in_lean4/" external>
                <em>Theorem Proving in Lean 4</em>
              </LinkPreview>
              . Documents mechanically checked propositions and proof objects.
            </li>
            <li>
              Microsoft, {" "}
              <LinkPreview url="https://www.typescriptlang.org/docs/handbook/" external>
                <em>The TypeScript Handbook</em>
              </LinkPreview>
              . Provides an official example of a type checker rejecting invalid program relationships.
            </li>
            <li>
              Stanford Encyclopedia of Philosophy, {" "}
              <LinkPreview url="https://plato.stanford.edu/entries/truth-correspondence/" external>
                “The Correspondence Theory of Truth”
              </LinkPreview>
              . Surveys facts, states of affairs, events, objects, and properties as possible correspondence relata.
            </li>
            <li>
              Stanford Encyclopedia of Philosophy, {" "}
              <LinkPreview url="https://plato.stanford.edu/entries/truth-pragmatic/" external>
                “The Pragmatic Theory of Truth”
              </LinkPreview>
              . Surveys accounts that test truth through practical consequences and the outcomes of inquiry.
            </li>
            <li>
              Stanford Encyclopedia of Philosophy, {" "}
              <LinkPreview url="https://plato.stanford.edu/entries/habermas/" external>
                “Jürgen Habermas”
              </LinkPreview>
              . Distinguishes sincerity or truthfulness from propositional truth and normative rightness as a validity
              claim of speech.
            </li>
            <li>
              Stanford Encyclopedia of Philosophy, {" "}
              <LinkPreview url="https://plato.stanford.edu/entries/knowledge-acquaindescrip/" external>
                “Knowledge by Acquaintance vs. Description”
              </LinkPreview>
              . Surveys direct, non-propositional acquaintance and its distinction from descriptive knowledge.
            </li>
            <li>
              Key Concepts in Chinese Thought and Culture, {" "}
              <LinkPreview url="https://www.chinesethought.cn/EN/shuyu_show.aspx?shuyu_id=2126" external>
                “Chéng (誠): Sincerity”
              </LinkPreview>
              . Relates freedom from deceit and consistency of conduct to the Way of Heaven and human moral
              cultivation.
            </li>
            <li>
              TheTorah.com, {" "}
              <LinkPreview
                url="https://www.thetorah.com/article/torat-emet-truth-spoken-through-the-humble-human-experience"
                external
              >
                “Torat Emet: Truth Spoken through the Humble Human Experience”
              </LinkPreview>
              . Explains the biblical Hebrew sense of <em>ʾemet</em> as truth and trustworthiness.
            </li>
            <li>
              Kane Baker, {" "}
              <LinkPreview url="https://www.youtube.com/watch?v=c9BFn4Kqj0E&t=1954s" external>
                “Nonpropositional Truth” — Trustworthiness Theory
              </LinkPreview>
              . Presents trustworthiness as warranted reliance.
            </li>
          </ul>
        </Section>
      </div>
    </TooltipProvider>
  );
}
