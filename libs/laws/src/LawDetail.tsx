import * as React from "react";
import type { Law } from "./types";
import { lawLabelAccents, lawLabelAccentVariable } from "./accents";
import { lawLabelAbbreviations } from "./labels";
import { lawBySlug } from "./laws";
import { LawGraphic } from "./LawGraphic";

export interface LawDetailProps {
  law: Law;
  animated?: boolean;
  className?: string;
}

/**
 * Full presentation of one law: adapted graphic, definition, labels, takeaways,
 * origins copy, source link, further reading, and related laws. Sections that
 * a law does not provide (takeaways, copy, source, further reading, related)
 * are omitted.
 */
export function LawDetail({ law, animated, className }: LawDetailProps) {
  const related = law.related
    .map((slug) => lawBySlug[slug])
    .filter((entry): entry is Law => entry !== undefined);

  return (
    <article className={["thom-law-detail", className].filter(Boolean).join(" ")}>
      <header className="thom-law-detail__header">
        <div className="thom-law-detail__intro">
          <p className="thom-law-detail__eyebrow">{law.category}</p>
          <h2 className="thom-law-detail__title">{law.title}</h2>
          <p className="thom-law-detail__definition">{law.definition}</p>
          <ul className="thom-law-detail__labels" aria-label="Labels">
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
        <LawGraphic law={law} animated={animated} className="thom-law-detail__graphic" />
      </header>

      {law.takeaways && law.takeaways.length > 0 && (
        <section className="thom-law-detail__section">
          <h3>Takeaways</h3>
          <ol className="thom-law-detail__takeaways">
            {law.takeaways.map((takeaway) => (
              <li key={takeaway}>{takeaway}</li>
            ))}
          </ol>
        </section>
      )}

      {law.copy.length > 0 && (
        <section className="thom-law-detail__section">
          <h3>Origins</h3>
          {law.copy.map((paragraph, index) => (
            <p key={index} className="thom-law-detail__copy">
              {paragraph}
            </p>
          ))}
          {law.source && (
            <p className="thom-law-detail__source">
              <a href={law.source} target="_blank" rel="noopener noreferrer">
                Source
              </a>
            </p>
          )}
        </section>
      )}

      {law.furtherReading && law.furtherReading.length > 0 && (
        <section className="thom-law-detail__section">
          <h3>Further Reading</h3>
          <ul className="thom-law-detail__reading">
            {law.furtherReading.map((entry) => (
              <li key={entry.url}>
                <a href={entry.url} target="_blank" rel="noopener noreferrer">
                  {entry.title}
                </a>
                <span className="thom-law-detail__reading-source">{entry.source}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="thom-law-detail__section">
          <h3>Related</h3>
          <ul className="thom-law-detail__related">
            {related.map((entry) => (
              <li key={entry.slug}>
                <a href={entry.sources[0]} target="_blank" rel="noopener noreferrer">
                  {entry.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
