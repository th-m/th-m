import * as React from "react";
import type { Law } from "./types";
import { lawLabelAccents, lawLabelAccentVariable } from "./accents";
import { lawLabelAbbreviations } from "./labels";
import { LawGraphic } from "./LawGraphic";

export interface LawCardProps {
  law: Law;
  /** 1-based ordinal rendered as the card index eyebrow. */
  index?: number;
  /** Optional destination; renders the card as a link with hover affordance. */
  href?: string;
  animated?: boolean;
  className?: string;
}

/** Grid card for one law: adapted graphic, category index, title, definition, labels. */
export function LawCard({ law, index, href, animated, className }: LawCardProps) {
  const content = (
    <>
      <LawGraphic law={law} animated={animated} className="thom-law-card__graphic" />
      <div className="thom-law-card__body">
        <p className="thom-law-card__eyebrow">
          {index != null && <span className="thom-law-card__index">{String(index).padStart(2, "0")}</span>}
          <span>{law.category}</span>
        </p>
        <h3 className="thom-law-card__title">{law.title}</h3>
        <p className="thom-law-card__definition">{law.definition}</p>
        <ul className="thom-law-card__labels" aria-label="Labels">
          {law.labels.map((label) => (
            <li
              key={label}
              className="thom-law-label"
              aria-label={label}
              title={label}
              data-accent={lawLabelAccents[label]}
              style={{ "--law-label-accent": lawLabelAccentVariable(label) } as React.CSSProperties}
            >
              {lawLabelAbbreviations[label]}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className={["thom-law-card", className].filter(Boolean).join(" ")}>
        {content}
      </a>
    );
  }
  return <article className={["thom-law-card", className].filter(Boolean).join(" ")}>{content}</article>;
}
