import { defineArticleComponents } from "@th-m/blogs/mdx";
import articleAssets from "./article-assets";
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
import {
  AcquaintanceMapInstrument,
  SincerityAlignmentInstrument,
  TrustworthinessBalanceInstrument,
} from "./situated-truth-instruments";
import "./truth-instruments.css";

/* ------------------------------------------------------------------ */
/* Small prose primitives                                              */
/* ------------------------------------------------------------------ */

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
    icon: { asset: "assets/coherence-closure.svg", name: "coherence-closure" },
    formulation: { lens: "Coherence", question: "Does it fit?" },
    validity: "validity relative to definitions, axioms, and inference rules",
    parallel: null,
    language: "explicit premises, symbolic relationships, proof obligations",
    feedback: "counterexamples and proof assistants reject invalid derivations",
  },
  {
    label: "Empirical truth",
    icon: { asset: "assets/correspondence-target.svg", name: "correspondence-target" },
    formulation: { lens: "Correspondence", question: "Does it match?" },
    validity: "agreement with an observable state of affairs—the events, objects, properties, or relations the claim describes",
    parallel: null,
    language: "measurement, method, uncertainty, replication, counterevidence",
    feedback: "failed predictions and unreplicated results erode the claim",
  },
  {
    label: "Operational truth",
    icon: { asset: "assets/consequence-cradle.svg", name: "consequence-cradle" },
    formulation: { lens: "Consequence", question: "Does it work?" },
    validity: "reliable consequences under stated conditions—the procedure repeatedly produces its intended result within defined tolerances",
    parallel: null,
    language: "procedures, preconditions, failure modes, tolerances, observed outcomes",
    feedback: "systems that crash, stall, or cost too much are corrected or retired",
  },
  {
    label: "Relational / acquaintance",
    icon: null,
    formulation: null,
    validity: "situated significance known through direct familiarity with experiences, people, places, purposes, and relationships",
    parallel: null,
    language: "perspective, motive, consequence, interpretation, demonstration, metaphor, phenomenological description",
    feedback: "people with direct familiarity test whether a claim remains faithful to experience and its consequences",
  },
  {
    label: "Sincerity / truthfulness",
    icon: null,
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
    icon: null,
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
  },
  {
    index: "02",
    headline: "Non-deceptive fit between expression and subjective state.",
    supporting: "Sincerity tests whether inward disposition, outward expression, and conduct remain aligned.",
  },
  {
    index: "03",
    headline: "Truth is what warrants reliance.",
    supporting: "X is true if and only if X is trustworthy; X is false if and only if X is untrustworthy.",
  },
] as const;

type TruthPractice = (typeof TRUTH_PRACTICES)[number];

function SituatedTruthPracticesFigure() {
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
                  {instrument.index === "01" ? (
                    <AcquaintanceMapInstrument />
                  ) : instrument.index === "02" ? (
                    <SincerityAlignmentInstrument />
                  ) : (
                    <TrustworthinessBalanceInstrument />
                  )}
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
  assetUrl,
  ariaLabel,
  eyebrow,
  title,
  caption,
}: {
  practices: readonly TruthPractice[];
  assetUrl: (value: string) => string;
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
              className="truth-practice-card"
              style={{
                padding: "16px 18px",
                border: "1px solid var(--line)",
                background: "var(--color-card)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div className="truth-practice-card__header">
                <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".13em", textTransform: "uppercase", color: "var(--color-primary)" }}>
                  {practice.label}
                </p>
                {practice.icon ? (
                  <img
                    className="truth-practice-card__icon"
                    src={assetUrl(practice.icon.asset)}
                    alt=""
                    aria-hidden="true"
                    data-truth-practice-icon={practice.icon.name}
                  />
                ) : null}
              </div>
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

export { AcquaintanceMapInstrument, Card, CardContent, CardHeader, CardTitle, ClaimCard, compactAssumption, CONSTRAINT_STACK, ConstraintFeedbackFigure, ConstraintStackFigure, EmbeddingCompositionExplorer, FigureCaption, figureFrame, HASH_SORT_EXAMPLE, HASH_SORT_INFERRED_STRUCTURE, HoverCard, HoverCardContent, HoverCardTrigger, Link, LinkPreview, PredictionFigure, PromptExpansionFigure, RECURRING_TRUTH_PRACTICES, REGISTER_INTERPRETATIONS, RESPONSE_EVIDENCE_LABELS, RESPONSE_METHOD_LABELS, SCENARIOS, SincerityAlignmentInstrument, SITUATED_TRUTH_INSTRUMENTS, SITUATED_TRUTH_PRACTICES, SituatedTruthPracticesFigure, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TrustworthinessBalanceInstrument, TRUTH_PRACTICES, TRUTH_TO_COMPUTATION_STAGES, TruthPracticesFigure, useState };
export default defineArticleComponents(articleAssets, () => ({
  "constraint-feedback-figure": ConstraintFeedbackFigure,
  "constraint-stack-figure": ConstraintStackFigure,
  "embedding-composition-explorer": EmbeddingCompositionExplorer,
  "prediction-figure": PredictionFigure,
  "prompt-expansion-figure": PromptExpansionFigure,
  "situated-truth-practices-figure": SituatedTruthPracticesFigure,
  "truth-practices-figure": TruthPracticesFigure,
}));
