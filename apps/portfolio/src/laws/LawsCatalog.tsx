import { useMemo, useState, type CSSProperties } from "react";
import {
  laws,
  lawLabelAccents,
  lawLabelAccentVariable,
  lawLabels,
  type LawLabel,
} from "@th-m/laws";
import { LawCardGrid } from "./LawCardGrid";

/**
 * The complete Laws collection. No selected labels means filtering is off;
 * once any label is selected, laws matching any selected label remain visible.
 */
export function LawsCatalog() {
  const [activeLabels, setActiveLabels] = useState<ReadonlySet<LawLabel>>(() => new Set());

  const visibleLaws = useMemo(() => {
    if (activeLabels.size === 0) return laws;
    return laws.filter((law) => law.labels.some((label) => activeLabels.has(label)));
  }, [activeLabels]);

  const toggle = (label: LawLabel) => {
    setActiveLabels((previous) => {
      const next = new Set(previous);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <>
      <div className="home-laws__pills" role="group" aria-label="Filter laws by label">
        {lawLabels.map((label) => {
          const selected = activeLabels.has(label);
          return (
            <button
              key={label}
              type="button"
              className={[
                "home-laws__pill",
                selected ? "home-laws__pill--selected" : "",
              ].filter(Boolean).join(" ")}
              aria-pressed={selected}
              data-accent={lawLabelAccents[label]}
              style={{
                "--law-label-accent": lawLabelAccentVariable(label),
                ...(selected
                  ? {
                      background: `color-mix(in srgb, ${lawLabelAccentVariable(label)} 18%, transparent)`,
                      color: lawLabelAccentVariable(label),
                      opacity: 0.94,
                    }
                  : {}),
              } as CSSProperties}
              onClick={() => toggle(label)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="laws-catalog__status" aria-live="polite">
        {activeLabels.size === 0
          ? `All ${laws.length} laws`
          : `${visibleLaws.length} laws matching ${activeLabels.size} selected ${activeLabels.size === 1 ? "type" : "types"}`}
      </p>

      <LawCardGrid items={visibleLaws} />
    </>
  );
}
