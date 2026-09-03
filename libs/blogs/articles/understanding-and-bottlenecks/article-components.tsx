import { defineArticleComponents } from "@th-m/blogs/mdx";
import articleAssets from "./article-assets";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { PublishedPost } from "@th-m/blogs/publish";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LinkPreview,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@th-m/ui";
import { NeuralInferenceFigure } from "./neural-inference-figure";
import "./understanding-figures.css";

const proofPipeline = [
  {
    label: "Generate candidate proofs",
    detail: "Conjectures, programs, counterexamples, and derivations",
    transition: "Candidate proofs can outrun verification",
    bottleneck: true,
  },
  {
    label: "Verify formal correctness",
    detail: "Expert review, tests, or a proof assistant",
    transition: "Verified proofs can outrun explanation",
    bottleneck: true,
  },
  {
    label: "Explain and evaluate meaning",
    detail: "What the result teaches, why it matters, and where it belongs",
    transition: "Published work can outrun collective absorption",
    bottleneck: true,
  },
  {
    label: "Community adoption",
    detail: "Review, teaching, attribution, and connection to other work",
    transition: "Absorbed understanding becomes reusable",
    bottleneck: false,
  },
  {
    label: "Canonical knowledge",
    detail: "A result the field can retrieve, explain, and build upon",
    transition: null,
    bottleneck: false,
  },
] as const;

const understandingLoop = [
  ["Observe", "Evidence and lived stakes"],
  ["Interpret", "What the output means"],
  ["Frame", "A testable problem"],
  ["Propose", "An intervention"],
  ["Test", "An explicit learning goal"],
  ["Revise", "The shared model and its boundaries"],
] as const;

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function Note({ term, children }: { term: ReactNode; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>
          {term}
        </span>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

function ProofPipelineFigure() {
  return (
    <figure
      className="understanding-figure understanding-pipeline"
      aria-labelledby="proof-pipeline-title"
    >
      <header className="understanding-figure__header">
        <span className="understanding-figure__kicker">Proof indigestion</span>
        <strong id="proof-pipeline-title">
          Where abundance becomes a bottleneck
        </strong>
      </header>
      <ol className="understanding-pipeline__stages">
        {proofPipeline.map((stage, index) => (
          <li key={stage.label}>
            <div className="understanding-pipeline__stage">
              <span
                className="understanding-pipeline__number"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <strong>{stage.label}</strong>
                <span>{stage.detail}</span>
              </div>
            </div>
            {stage.transition ? (
              <div
                className={`understanding-pipeline__transition${
                  stage.bottleneck
                    ? " understanding-pipeline__transition--bottleneck"
                    : ""
                }`}
              >
                <span
                  className="understanding-pipeline__arrow"
                  aria-hidden="true"
                >
                  ↓
                </span>
                <p>
                  <span>{stage.bottleneck ? "Bottleneck" : "Transition"}</span>
                  {stage.transition}
                </p>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      <figcaption>
        Formal correctness is one handoff in the pipeline. A result becomes
        shared knowledge only after people can explain, evaluate, teach, and
        reuse it.
      </figcaption>
    </figure>
  );
}

function UnderstandingLoopFigure() {
  return (
    <figure
      className="understanding-figure understanding-loop"
      aria-labelledby="understanding-loop-title"
    >
      <header className="understanding-figure__header">
        <span className="understanding-figure__kicker">
          Corrigible practice
        </span>
        <strong id="understanding-loop-title">The understanding loop</strong>
      </header>
      <ol className="understanding-loop__steps">
        {understandingLoop.map(([label, detail], index) => (
          <li key={label}>
            <span className="understanding-loop__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <strong>{label}</strong>
              <span>{detail}</span>
            </div>
            {index < understandingLoop.length - 1 ? (
              <span className="understanding-loop__arrow" aria-hidden="true">
                ↓
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="understanding-loop__return">
        <span aria-hidden="true">↺</span>
        Consequences change what the team observes next.
      </div>
      <figcaption>
        Understanding is demonstrated through prediction, bounded action, and
        revision—not by producing a persuasive explanation once.
      </figcaption>
    </figure>
  );
}

export { Card, CardContent, CardHeader, CardTitle, formatDate, Link, LinkPreview, NeuralInferenceFigure, Note, proofPipeline, ProofPipelineFigure, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, understandingLoop, UnderstandingLoopFigure };
export default defineArticleComponents(articleAssets, () => ({
  "neural-inference-figure": NeuralInferenceFigure,
  "proof-pipeline-figure": ProofPipelineFigure,
  "understanding-loop-figure": UnderstandingLoopFigure,
}));
