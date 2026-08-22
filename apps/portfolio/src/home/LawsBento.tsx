import { useMemo, useState } from "react";
import { laws, lawLabels, type LawLabel } from "@th-m/laws";
import { adaptLawColor, lawMonogram } from "@th-m/laws";
import { BentoGrid, BentoGridItem } from "@th-m/ui";

const initialActive = (): Record<LawLabel, boolean> =>
  Object.fromEntries(lawLabels.map((label) => [label, true])) as Record<LawLabel, boolean>;

/**
 * The home-page "Laws" section: every law from @th-m/laws (the laws of UX and
 * the laws of software development) shown in a THOM-styled bento grid, filtered
 * by the label pills above it. All pills start on; a law stays visible while
 * at least one of its labels still has its pill on, so a multi-label law
 * disappears only when every one of its pills is toggled off.
 */
export function LawsBento() {
  const [active, setActive] = useState<Record<LawLabel, boolean>>(initialActive);

  const visibleLaws = useMemo(
    () => laws.filter((law) => law.labels.some((label) => active[label])),
    [active],
  );

  const toggle = (label: LawLabel) => {
    setActive((previous) => ({ ...previous, [label]: !previous[label] }));
  };

  return (
    <section className="home-laws" aria-labelledby="home-laws-title">
      <header className="home-laws__header">
        <h2 id="home-laws-title">Laws</h2>
      </header>
      <p className="home-laws__lede">
        The principles this work leans on — the laws of UX and the laws of software
        development — collected, adapted onto the THOM theme, and linked back to
        their sources.
      </p>

      <div className="home-laws__pills" role="group" aria-label="Filter laws by label">
        {lawLabels.map((label) => (
          <button
            key={label}
            type="button"
            className={["home-laws__pill", active[label] ? "home-laws__pill--on" : ""].filter(Boolean).join(" ")}
            aria-pressed={active[label]}
            onClick={() => toggle(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleLaws.length > 0 ? (
        <BentoGrid columns={4}>
          {visibleLaws.map((law, index) => (
            <BentoGridItem
              key={law.slug}
              href={law.sources[0]}
              span={index % 6 === 5 ? 2 : 1}
              header={
                <div className="home-laws__tile" style={{ background: adaptLawColor(law.color) }}>
                  <span aria-hidden="true">{lawMonogram(law.title)}</span>
                </div>
              }
              title={law.title}
              description={law.definition}
              footer={
                <ul className="home-laws__labels" aria-label="Labels">
                  {law.labels.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              }
            />
          ))}
        </BentoGrid>
      ) : (
        <p className="home-laws__empty">No laws match — turn a label back on to see them again.</p>
      )}
    </section>
  );
}
