import { Fragment } from "react";

const valueLadder = [
  { kind: "Value", text: "Privacy matters" },
  { kind: "Preference", text: "Prefer privacy to personalization" },
  { kind: "Priority", text: "Privacy outranks engagement" },
  { kind: "Constraint", text: "Never share data without consent" },
  { kind: "Metric", text: "Zero unconsented disclosures" },
  { kind: "Procedure", text: "If consent is uncertain, stop and escalate" },
];

export function ValueLadder() {
  return (
    <div
      className="article-stepper"
      role="region"
      tabIndex={0}
      aria-label="Value-laden language becomes progressively more operational"
    >
      {valueLadder.map((step, index) => (
        <Fragment key={step.kind}>
          {index > 0 ? <span className="article-stepper__arrow" aria-hidden="true">→</span> : null}
          <div className="article-stepper__node">
            <strong>{step.kind}</strong>
            <span>{step.text}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
