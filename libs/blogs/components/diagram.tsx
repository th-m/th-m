import { useId, useState, type ReactNode } from "react";
import { AiFactoryIcon } from "@th-m/diagram-theme/icons";
import type { AiFactoryIconKind } from "@th-m/diagram-theme/icon-catalog";
import "./diagram.css";

/** One detailed scene; a compact authored reading path on narrow screens. */
export function ResponsiveDiagram({
  label,
  summary,
  children,
}: {
  label: string;
  summary: ReactNode;
  children: ReactNode;
}) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="responsive-diagram thom-diagram" data-expanded={expanded}>
      <div className="responsive-diagram__summary">{summary}</div>
      <button
        className="responsive-diagram__toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Hide full diagram" : "View full diagram"}
        <span aria-hidden="true">{expanded ? " −" : " +"}</span>
        <span className="diagram-sr-only">: {label}</span>
      </button>
      <div
        id={id}
        className="responsive-diagram__detail"
        role="region"
        aria-label={`${label} — full diagram`}
      >
        <p className="responsive-diagram__cue">Full view · scroll horizontally to follow every branch →</p>
        {children}
      </div>
    </div>
  );
}

export interface DiagramStep {
  label: string;
  detail?: string;
  icon?: AiFactoryIconKind;
  relation?: string;
  focal?: boolean;
  disconnected?: boolean;
}
export function DiagramSummary({
  label,
  steps,
  note,
}: {
  label: string;
  steps: readonly DiagramStep[];
  note?: string;
}) {
  return (
    <div className="diagram-summary" role="group" aria-label={`${label} — simplified view`}>
      <ol className="diagram-summary__steps">
        {steps.map((step, index) => (
          <li key={`${index}-${step.label}`}>
            {index > 0 && (
              <div className="diagram-summary__relation">
                <span aria-hidden="true">{step.disconnected ? "⋯ × ⋯ " : "↓ "}</span>
                {step.relation ?? "leads to"}
              </div>
            )}
            <div className={`diagram-summary__node${step.focal ? " diagram-node--focal" : ""}`}>
              {step.icon && (
                <span className="diagram-summary__icon" aria-hidden="true">
                  <AiFactoryIcon kind={step.icon} />
                </span>
              )}
              <div>
                <strong>{step.label}</strong>
                {step.detail && <p>{step.detail}</p>}
              </div>
            </div>
          </li>
        ))}
      </ol>
      {note && <p className="diagram-summary__note">{note}</p>}
    </div>
  );
}
