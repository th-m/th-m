import { useMemo, useState } from "react";
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
  useToolDrawer,
} from "@th-m/ui";
import { PropositionGraphFigure } from "@th-m/graph-visualization";
import type { GraphDocument } from "@th-m/graph-visualization";

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

/** Gold affordance that opens a registered tool in the global drawer. */
function Explore({ toolId, children }: { toolId: string; children: React.ReactNode }) {
  const { openTool } = useToolDrawer();
  return (
    <button type="button" className="article-tool-trigger" onClick={() => openTool(toolId)}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </button>
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
    validity: "validity relative to definitions, axioms, and inference rules",
    language: "explicit premises, symbolic relationships, proof obligations",
    feedback: "counterexamples and proof assistants reject invalid derivations",
  },
  {
    label: "Empirical truth",
    validity: "correspondence with observations",
    language: "measurement, method, uncertainty, replication, counterevidence",
    feedback: "failed predictions and unreplicated results erode the claim",
  },
  {
    label: "Operational truth",
    validity: "reliability in action",
    language: "procedures, preconditions, failure modes, tolerances, observed outcomes",
    feedback: "systems that crash, stall, or cost too much are corrected or retired",
  },
  {
    label: "Relational truth",
    validity: "significance within human purposes and relationships",
    language: "perspective, motive, consequence, interpretation, accountability",
    feedback: "people who bear the consequences accept, resist, or repair the claim",
  },
  {
    label: "Sincerity / truthfulness",
    validity: "non-deceptive fit between an expression and the speaker's subjective state",
    language: "first-person avowal, disclosure, qualification, acknowledged uncertainty",
    feedback: "mismatches among avowal, conduct, and context expose deception or self-deception",
  },
  {
    label: "Knowledge by acquaintance",
    validity: "direct familiarity with an experience, person, place, or quality",
    language: "demonstration, metaphor, example, gesture, phenomenological description",
    feedback: "repeated experience and situated witnesses expose descriptions that flatten or distort what is encountered",
  },
] as const;

function TruthPracticesFigure() {
  return (
    <figure aria-label="Six truth practices and the feedback that constrains their language">
      <div
        style={{
          ...figureFrame,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {TRUTH_PRACTICES.map((practice) => (
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
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-foreground)" }}>
              {practice.validity}
            </p>
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
      <FigureCaption>
        Truth practices and their feedback — each form of truth produces a language, and an institution or consequence that rejects what does not survive it.
      </FigureCaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* F2 — Prompt direction and remaining ambiguity                       */
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
    requestBase: "Make this page look better",
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

/** Join clause strings with commas and an Oxford "and" so they read as one sentence. */
function joinClauses(clauses: string[]): string {
  if (clauses.length === 0) return "";
  if (clauses.length === 1) return clauses[0];
  if (clauses.length === 2) return `${clauses[0]} and ${clauses[1]}`;
  return `${clauses.slice(0, -1).join(", ")}, and ${clauses[clauses.length - 1]}`;
}

function PredictionFigure() {
  const [scenarioId, setScenarioId] = useState<Scenario["id"]>("sorting");
  const [languageIndex, setLanguageIndex] = useState(SCENARIOS[0].naiveGuess);
  const [active, setActive] = useState<Set<number>>(new Set());
  const [infoIndex, setInfoIndex] = useState<number | null>(null);

  const scenario = SCENARIOS.find((entry) => entry.id === scenarioId) ?? SCENARIOS[0];
  const selectedOption = scenario.languageOptions[languageIndex] ?? scenario.languageOptions[scenario.naiveGuess];
  const termOfArt = scenario.languageOptions[scenario.termOfArt];

  const { possibleInterpretations, entropy, ambiguityPercent } = useMemo(() => {
    const totalConstraintWeight = scenario.constraints.reduce((sum, constraint) => sum + constraint.multiplier, 0);
    const activeConstraintWeight = scenario.constraints.reduce(
      (sum, constraint, index) => sum + (active.has(index) ? constraint.multiplier : 0),
      0,
    );
    const constraintCoverage = totalConstraintWeight === 0 ? 0 : activeConstraintWeight / totalConstraintWeight;
    const baseInterpretations = REGISTER_INTERPRETATIONS[selectedOption.register];
    const interpretations = 1 + (baseInterpretations - 1) * (1 - constraintCoverage);
    const percent = ((interpretations - 1) / (REGISTER_INTERPRETATIONS.Slang - 1)) * 100;

    return {
      possibleInterpretations: interpretations,
      entropy: Math.log2(interpretations),
      ambiguityPercent: Math.max(2, percent),
    };
  }, [active, scenario, selectedOption.register]);

  const toggle = (index: number) => {
    setActive((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectScenario = (id: Scenario["id"]) => {
    const nextScenario = SCENARIOS.find((entry) => entry.id === id) ?? SCENARIOS[0];
    setScenarioId(id);
    setLanguageIndex(nextScenario.naiveGuess);
    setActive(new Set());
    setInfoIndex(null);
  };

  const termSelected = languageIndex === scenario.termOfArt;
  const strongDomainCueSelected = [...active].some((index) => scenario.constraints[index]?.multiplier >= 5);
  const targetActivated = termSelected || strongDomainCueSelected;

  const checkedLabels = scenario.constraints
    .filter((_, index) => active.has(index))
    .map((constraint) => constraint.label.charAt(0).toLowerCase() + constraint.label.slice(1));

  const responseText = targetActivated
    ? termSelected
      ? scenario.targetResponse
      : `The supporting concepts point to “${termOfArt.term}.” ${scenario.targetResponse}`
    : `“${selectedOption.term}” changes the phrasing, but it does not yet select the governing domain method. Several response families remain plausible.`;

  return (
    <figure aria-label="How a term of art directs a response and valid assumptions narrow it">
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
            {checkedLabels.length > 0 ? (
              <>
                <dt style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--color-foreground-muted)" }}>
                  Assumptions
                </dt>
                <dd style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--color-foreground)" }}>{joinClauses(checkedLabels)}</dd>
              </>
            ) : null}
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
          <p style={{ margin: "9px 0 0", fontSize: 11, lineHeight: 1.45, color: "var(--color-foreground-muted)" }}>
            Specific valid terms activate structure; jargon without valid assumptions does not.
          </p>
        </div>

        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 14 }}>
          <p style={{ margin: "0 0 10px", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-foreground-muted)" }}>
            Add supporting concepts — assumptions make the direction valid
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {scenario.constraints.map((constraint, index) => {
              const isActive = active.has(index);
              const isInfo = infoIndex === index;
              return (
                <button
                  key={constraint.label}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={constraint.label}
                  onClick={() => {
                    toggle(index);
                    setInfoIndex(index);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    border: `1px solid ${isActive ? "var(--color-primary)" : "var(--line)"}`,
                    borderRadius: 999,
                    background: isActive ? "var(--color-card)" : "var(--color-surface)",
                    color: "var(--color-foreground)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 12,
                    lineHeight: 1.45,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 8,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: isActive || isInfo ? "var(--color-primary)" : "var(--color-foreground-muted)",
                    }}
                  >
                    {constraint.technicalLabel}
                  </span>
                  <span aria-hidden="true">{constraint.label}</span>
                </button>
              );
            })}
          </div>

          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 10,
              padding: "10px 12px",
              border: "1px dashed var(--line)",
              background: "var(--color-surface)",
              fontSize: 12,
              lineHeight: 1.55,
              color: "var(--color-foreground-muted)",
            }}
          >
            {infoIndex !== null ? (
              <>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-primary)" }}>
                  technical label — {scenario.constraints[infoIndex].technicalLabel}
                </span>
                <span style={{ marginLeft: 8 }}>{scenario.constraints[infoIndex].metaDescription}</span>
              </>
            ) : (
              <>Choose a supporting concept to see the structure it contributes.</>
            )}
          </div>
        </div>
      </div>
      <FigureCaption>
        Prompt direction and ambiguity — the scenario sets context, the selected phrase directs the response, and
        valid assumptions narrow it further.
      </FigureCaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* F3 — The code constraint stack                                      */
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
/* F4 — Concept graph (revised proposition/relationship visual)        */
/* ------------------------------------------------------------------ */

const constraintGraphDocument: GraphDocument = {
  schemaVersion: 1,
  id: "truth-entropy-constraints",
  name: "How language carries constraints",
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-22T00:00:00.000Z",
  themeId: "thom-dark",
  layoutMode: "editorial",
  propositions: [
    {
      id: "prompt-hash",
      statement: "Prompt: “Implement hash-based sorting for these bounded integer keys.”",
      emphasis: true,
      pinned: false,
    },
    {
      id: "prompt-organize",
      statement: "Prompt: “Organize this list really fast.”",
      emphasis: false,
      pinned: false,
    },
    {
      id: "patterns",
      statement: "Technical language activates named patterns and assumptions",
      emphasis: true,
      pinned: false,
    },
    {
      id: "feedback",
      statement: "Feedback systems reject invalid expressions",
      emphasis: true,
      pinned: false,
    },
    {
      id: "code",
      statement: "Parsers, types, tests, runtimes, and consequences filter candidate continuations",
      emphasis: false,
      pinned: false,
    },
    {
      id: "coherence",
      statement: "Coherence is evidence about a pattern, not the world",
      emphasis: true,
      pinned: false,
    },
  ],
  relationships: [
    {
      id: "activates",
      statement: "activates a region of precise language",
      participants: [
        { nodeId: "prompt-hash", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "patterns", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
    {
      id: "guesses",
      statement: "leaves the ordering rule and costs unspecified — the model guesses",
      participants: [
        { nodeId: "prompt-organize", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "coherence", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
    {
      id: "shapes",
      statement: "rewards stable distinctions and rejects noise",
      participants: [
        { nodeId: "feedback", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "patterns", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
    {
      id: "corpora",
      statement: "produces pattern-dense corpora a model can learn",
      participants: [
        { nodeId: "feedback", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "code", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
    {
      id: "checks",
      statement: "lets patterns be checked against executable behavior",
      participants: [
        { nodeId: "code", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "coherence", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
    {
      id: "selects",
      statement: "constrains which continuations are plausible",
      participants: [
        { nodeId: "patterns", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "coherence", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
  ],
  poster: {
    kicker: "TRUTH, ENTROPY & INFERENCE",
    title: "How language carries constraints",
    footer: "THOM · PROPOSITION GRAPH 02",
    showLegend: true,
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ArticlePage({ post }: { post: PublishedPost }) {
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
            <p>
              Language models generate coherent continuations by learning patterns in language. Those patterns are not
              arbitrary. Different truth-seeking practices produce different forms of discourse: a proof, an
              experimental report, a program, a legal argument, and a product narrative each carry different
              constraints, conventions, and signals of validity.
            </p>
            <p>
              This article connects three ideas. First, communities encode meaningful distinctions into recurring
              language. Second, information theory gives us a way to reason about uncertainty, surprise, and
              prediction — which machine-learning systems later operationalize through conditional token prediction.
              Third, some domains, especially code, produce unusually dense and reliable patterns because syntax,
              compilers, types, tests, runtimes, and physical consequences continually reject invalid expressions.
            </p>
            <p>
              The practical destination is an intuition for working with AI: recognize when a domain has enough
              linguistic and operational structure for a model to be fluent, choose language that activates the
              relevant structure, and distinguish a coherent continuation from a correct or meaningful answer.
            </p>
            <ClaimCard eyebrow="Core thesis" title="Fluency follows structure — not the other way around">
              <p style={{ margin: 0 }}>
                Language becomes predictively useful when a domain repeatedly encodes stable distinctions,
                constraints, relationships, and consequences into its patterns of expression. A language model can
                learn those patterns and infer plausible continuations, but the reliability of that inference depends
                on the structure that produced the language. Code is a strong case because incorrect expressions
                encounter layers of mechanical rejection; loosely specified strategy, taste, or human meaning often
                lacks comparable enforcement. The difference is not that one domain contains truth and the other does
                not — it is that their language has been shaped by different feedback systems.
              </p>
            </ClaimCard>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-foreground-muted)" }}>
              This is the second essay in a coordinated sequence:{" "}
              <LinkPreview url="/writing/goals-solutions-and-value" asChild>
                <Link to="/writing/$slug" params={{ slug: "goals-solutions-and-value" }}>Goals, Solutions &amp; Value</Link>
              </LinkPreview>{" "}
              establishes that valuable opportunities are grounded in human stakes; this essay explains why learned
              language patterns are powerful, when they carry constraints, and where fluency breaks;{" "}
              <LinkPreview url="/writing/understanding-is-the-bottleneck" asChild>
                <Link to="/writing/$slug" params={{ slug: "understanding-is-the-bottleneck" }}>The Understanding Bottleneck</Link>
              </LinkPreview>{" "}
              asks how teams turn abundant output into better problem solving; and{" "}
              <LinkPreview url="/writing/the-knowledge-factory" asChild>
                <Link to="/writing/$slug" params={{ slug: "the-knowledge-factory" }}>The Knowledge Factory</Link>
              </LinkPreview>{" "}
              introduces the organizational system that makes that understanding reusable.
            </p>
          </div>
        </header>

        <Section index="01" title="The Mystery of the Plausible Continuation">
          <p>Consider two prompts that are grammatically similar but structurally very different:</p>
          <blockquote>
            <p>Implement hash-based sorting for these bounded integer keys.</p>
          </blockquote>
          <blockquote>
            <p>Organize this list really fast.</p>
          </blockquote>
          <p>
            Both ask for organization and speed. The first activates a technical region of language containing named
            assumptions, known implementation patterns, and recognizable tradeoffs. The second leaves the ordering
            rule, data type, size, stability, memory budget, and meaning of “fast” unspecified. A model can answer
            both fluently; only one prompt gives it much of a correctness surface.
          </p>
          <p>
            The governing question is: <strong>what happened in the world that made one pattern of language more
            informative than the other?</strong> It was not that one sentence was longer or cleverer. The
            informativity came from outside the sentence — from a community of practice that had spent decades
            encoding its distinctions into words, syntax, and standards.
          </p>
        </Section>

        <Section index="02" title="Forms of Truth Produce Forms of Language">
          <p>
            Six overlapping truth practices shape the language around us. Treat them as an editorial framework, not
            a universal philosophical taxonomy: the same claim can participate in several practices at once.
          </p>
          <ul>
            <li>
              <strong>Formal truth</strong> is validity relative to definitions, axioms, and inference rules. Its
              language favors explicit premises, symbolic relationships, and proof obligations.
            </li>
            <li>
              <strong>Empirical truth</strong> is correspondence with observations. Its language favors measurement,
              method, uncertainty, replication, and counterevidence.
            </li>
            <li>
              <strong>Operational truth</strong> is reliability in action. Its language favors procedures,
              preconditions, failure modes, tolerances, and observed outcomes.
            </li>
            <li>
              <strong>Relational truth</strong> is significance within human purposes, identities, histories, and
              relationships. Its language favors perspective, motive, consequence, interpretation, and
              accountability.
            </li>
            <li>
              <strong>Sincerity, or truthfulness,</strong> is the good-faith, non-deceptive fit between what someone
              expresses and their subjective state. Its language favors first-person avowal, disclosure,
              qualification, and acknowledged uncertainty because inner landscapes are laden with self-deception,
              ambiguity, and interpretive booby traps.
            </li>
            <li>
              <strong>Knowledge by acquaintance</strong> is direct familiarity with an experience, person, place, or
              quality before that familiarity is reduced to a claim. Its language favors demonstration, metaphor,
              example, gesture, and careful phenomenological description.
            </li>
          </ul>
          <p>
            A temperature reading can be empirically calibrated and operationally relevant to a machine; someone can
            sincerely report that the same room feels oppressive while knowing its heat by acquaintance before
            converting that experience into a claim. The categories describe different constraint and meaning systems,
            not sealed kinds of sentence.
          </p>
          <TruthPracticesFigure />
          <p>
            Each practice is also a feedback system. Formal work is checked by counterexamples and proof obligations;
            empirical work by failed predictions and unreplicated results; operational work by systems that crash,
            stall, or cost too much; relational work by the people who accept, resist, or repair a claim because they
            bear its consequences; sincerity by whether avowal, conduct, and context remain in good-faith alignment;
            knowledge by acquaintance by whether a description or demonstration remains faithful to experience. The
            language of a domain records which of these checks have been running — and how hard they bite.
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
          <PropositionGraphFigure
            document={constraintGraphDocument}
            title="How language carries constraints"
            className="article-outline__figure"
          />
          <p className="article-outline__flow">Language = pattern + constraint + feedback. Fluency rides on the constraint.</p>
          <p>
            This graph is a map of the argument, not a claim about which sentences are true. The relationships it
            draws — a precise prompt activating named patterns, feedback systems shaping those patterns, and
            executable checks grounding coherence — are the linguistic constraints this article is about. You can{" "}
            <Explore toolId="relationship-graph">Explore the relationship graph</Explore>{" "}
            in the tool drawer, or open the full{" "}
            <LinkPreview url="/relationship-graph" asChild>
              <Link to="/relationship-graph">relationship graph editor</Link>
            </LinkPreview>{" "}
            on its own route.
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

        <Section index="06" title="“Hash Sort” Versus “Organize This List Really Fast”">
          <p>
            The two prompts from the opening are a lesson in semantic compression. An algorithm name can activate
            expectations about input shape, complexity, memory, stability, and implementation. But{" "}
            <Gloss label="hash sort" title="Hash sort is a family, not one algorithm">
              Any sorting approach that partitions keys by hash or bucket rather than comparing them pairwise —
              counting sort, bucket sort, radix passes. Which one is best depends on key range, distribution,
              stability, and memory budget, so the name alone is not precise.
            </Gloss>{" "}
            is not one universally standard optimal algorithm. The article must state the intended variant and
            assumptions — such as bounded integer keys and hash- or bucket-based partitioning — before treating the
            name as precise. The reference family is classic material; see, for example, Cormen, Leiserson, Rivest,
            and Stein,{" "}
            <LinkPreview url="https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" external>
              Introduction to Algorithms
            </LinkPreview>
            , for the conditions under which these approaches outperform comparison sorts.
          </p>
          <p>
            “Organize this list really fast” predicts a generic response because the prompt contains almost no domain
            constraints. The model must guess what organization means and will often converge on a familiar default —
            likely a comparison sort by value, whether or not that is what you wanted. The lesson is not “use
            jargon.” It is: <strong>use the most specific valid concept available, then state the conditions that
            make it valid.</strong>
          </p>
        </Section>

        <Section index="07" title="A Map of Domain Fluency">
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
        </Section>

        <Section index="08" title="Prompting as Constraint Selection">
          <p>
            While vibe designing a web logo, I realized I needed to eat my own dog food. My early prompts described
            the result I wanted in broad visual language, but they left too many consequential choices ambiguous. The
            model could produce plausible variations without reliably producing the typography I had in mind.
          </p>
          <p>
            I then pulled in visual references, established guidelines, and principles of typography. I also began
            prompting with the specific language used in bona fide typography work. The model performed much more
            accurately — not because the terminology was a magic incantation, but because the prompt now selected a
            more structured domain and supplied distinctions against which the result could be judged. The original
            failure was not a lack of prompt cleverness; I had supplied an underspecified problem. References
            narrowed the visual possibility space, typography principles supplied constraints, and professional
            vocabulary activated patterns connected to established relationships and practices. The model still
            required human evaluation, but it no longer had to guess what kind of work I meant.
          </p>
          <p>A practical sequence falls out of that experience:</p>
          <ol>
            <li>Name the domain and bounded context.</li>
            <li>Use established terms of art only when their assumptions apply.</li>
            <li>State invariants, inputs, outputs, and unacceptable failure modes.</li>
            <li>Provide representative examples and counterexamples.</li>
            <li>Define what evidence or test would count as success.</li>
            <li>Ask the model to identify missing distinctions before generating the answer.</li>
            <li>Route the result to an evaluator capable of checking the relevant truth practice.</li>
          </ol>
          <p>
            Prompt quality is not ornamental phrasing. It is the selection and compression of the context that should
            govern inference. The same move that makes prompts work also explains the article’s asymmetry: the{" "}
            <Term label="cross-entropy">
              A loss that scores how well the model's predicted distribution matches the observed next token; lower
              values mean the model assigned the observed token more probability.
            </Term>{" "}
            objective rewards the model for predicting what the training text actually contains, and training text
            from strongly constrained domains contains fewer plausible continuations to choose between.
          </p>
        </Section>

        <Section index="09" title="Coherence Is Evidence About a Pattern, Not the World">
          <p>Close by separating three judgments that are easy to conflate:</p>
          <Card style={{ margin: "1.5em 0" }}>
            <CardHeader>
              <CardTitle>Coherence · Correctness · Meaning</CardTitle>
            </CardHeader>
            <CardContent>
              <table>
                <thead>
                  <tr>
                    <th>Judgment</th>
                    <th>Question</th>
                    <th>Can AI help?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Coherence</strong></td>
                    <td>Does the response fit the language patterns of the requested domain?</td>
                    <td>Yes — this is what predictive generation is good at.</td>
                  </tr>
                  <tr>
                    <td><strong>Correctness</strong></td>
                    <td>Does it survive that domain’s tests and evidence?</td>
                    <td>Yes, when the domain has mechanical checks and the checks are run.</td>
                  </tr>
                  <tr>
                    <td><strong>Meaning</strong></td>
                    <td>Does it solve a problem that matters to the people who bear the consequences?</td>
                    <td>Only with human judgment about stakes, values, and context.</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p>
            AI can help with all three, but success at the first can simulate success at the other two. A response
            that sounds exactly like the domain — right vocabulary, right shape, right cadence — is evidence that the
            model has learned the pattern. It is not evidence that the pattern survived the domain’s tests, and it is
            not evidence that the answer matters to anyone. Recognizing that gap is the intuition this article is
            trying to leave you with: distinguish a coherent continuation from a correct answer, and both from a
            meaningful one.
          </p>
        </Section>

        <div className="article-outline__closing">
          <blockquote>
            A model is fluent where language has learned to carry the constraints. Our work is to know when those
            patterns are evidence — and when they are only the shape of an answer.
          </blockquote>
          <p>Closing line</p>
        </div>

        <Section index="10" title="Sources">
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
          </ul>
        </Section>
      </div>
    </TooltipProvider>
  );
}
