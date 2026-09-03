import { defineArticleComponents } from "@th-m/blogs/mdx";
import articleAssets from "./article-assets";
import type { ReactNode } from "react";
import type { PublishedPost } from "@th-m/blogs/publish";
import {
  Card,
  CardContent,
  CardHeader,
  LinkPreview,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@th-m/ui";
import "./ai-consciousness-article.css";

function formatDate(value: string): string {
  return new Date(value + "T00:00:00.000Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function AccessManeuverFigure() {
  return (
    <figure className="ai-consciousness-figure access-maneuver-figure">
      <div
        className="access-maneuver"
        role="img"
        aria-label="Phenomenal consciousness is replaced with measurable information access, access is measured, and the word consciousness is restored to the result"
      >
        <div className="access-maneuver__node access-maneuver__node--target">
          <span>Original target</span>
          <strong>Phenomenal consciousness</strong>
          <small>felt experience</small>
        </div>
        <span className="access-maneuver__arrow" aria-hidden="true">→</span>
        <div className="access-maneuver__node">
          <span>Substitution</span>
          <strong>Information access</strong>
          <small>report, memory, control</small>
        </div>
        <span className="access-maneuver__arrow" aria-hidden="true">→</span>
        <div className="access-maneuver__node">
          <span>Measurement</span>
          <strong>Access detected</strong>
          <small>observable function</small>
        </div>
        <span className="access-maneuver__arrow" aria-hidden="true">→</span>
        <div className="access-maneuver__node access-maneuver__node--warning">
          <span>Unsupported return</span>
          <strong>“Consciousness”</strong>
          <small>phenomenality implied</small>
        </div>
      </div>
      <figcaption>
        The measurable target changes, but the original word is restored after measurement.
      </figcaption>
    </figure>
  );
}

function EvidenceBridgeFigure() {
  return (
    <figure className="ai-consciousness-figure evidence-bridge-figure">
      <div className="evidence-bridge">
        <section className="evidence-bridge__lane evidence-bridge__lane--human">
          <header><span>Validated domain</span><strong>Human attribution</strong></header>
          <div className="evidence-bridge__chain" aria-label="Human phenomenal attribution evidence chain">
            <span>First-person report</span>
            <span aria-hidden="true">+</span>
            <span>Shared biology</span>
            <span aria-hidden="true">+</span>
            <span>Neural and behavioral intervention</span>
          </div>
          <p>Convergent phenomenal attribution</p>
        </section>
        <section className="evidence-bridge__lane evidence-bridge__lane--ai">
          <header><span>Unvalidated domain</span><strong>AI attribution</strong></header>
          <div className="evidence-bridge__chain" aria-label="AI phenomenal attribution evidence chain">
            <span>Behavior or architecture</span>
            <span aria-hidden="true">+</span>
            <span>Disputed theory</span>
            <span aria-hidden="true">→</span>
            <span className="evidence-bridge__missing">No phenomenal bridge</span>
          </div>
          <p>Hypothesis, not empirical counterpart</p>
        </section>
      </div>
      <figcaption>
        Similar reports do not carry similar evidence when one report has a validated biological
        bridge and the other does not.
      </figcaption>
    </figure>
  );
}

function TheoryDilemmaFigure() {
  return (
    <figure className="ai-consciousness-figure theory-dilemma-figure">
      <div
        className="theory-dilemma"
        role="img"
        aria-label="The functionalist causal-organization claim either includes biological causal processes that current AI does not reproduce or excludes them and assumes they are irrelevant"
      >
        <div className="theory-dilemma__root">
          <span>Functionalist condition</span>
          <strong>“Sufficiently fine-grained causal organization”</strong>
        </div>
        <div className="theory-dilemma__branches">
          <section>
            <span>Include biological causal powers</span>
            <strong>Current AI does not reproduce the condition.</strong>
          </section>
          <section>
            <span>Exclude biological causal powers</span>
            <strong>The theory assumes they are irrelevant.</strong>
          </section>
        </div>
      </div>
      <figcaption>
        One branch defeats the present AI comparison. The other assumes the disputed conclusion.
      </figcaption>
    </figure>
  );
}

function LogicPlate() {
  return (
    <div className="ai-consciousness-logic" role="region" aria-label="Logical form of the argument">
      <div><span>Observed in humans</span><code>E(H) ⇒ N(H) is associated with P(H)</code></div>
      <div><span>Observed in AI</span><code>E(AI) ⇒ selected capacities A(AI)</code></div>
      <div className="ai-consciousness-logic__blocked">
        <span>Does not follow</span><code>E(AI) ⇏ P(AI)</code>
      </div>
    </div>
  );
}

export { AccessManeuverFigure, Card, CardContent, CardHeader, EvidenceBridgeFigure, formatDate, LinkPreview, LogicPlate, TheoryDilemmaFigure, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
export default defineArticleComponents(articleAssets, () => ({
  "access-maneuver-figure": AccessManeuverFigure,
  "evidence-bridge-figure": EvidenceBridgeFigure,
  "logic-plate": LogicPlate,
  "theory-dilemma-figure": TheoryDilemmaFigure,
}));
