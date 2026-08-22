import type { CSSProperties } from "react";
import {
  lawLabelAccents,
  lawLabelAccentVariable,
  type Law,
} from "@th-m/laws";
import { BentoGrid, BentoGridItem } from "@th-m/ui";

export interface LawCardGridProps {
  items: Law[];
}

/** Portfolio-owned presentation for a collection of laws. */
export function LawCardGrid({ items }: LawCardGridProps) {
  return (
    <BentoGrid columns={4}>
      {items.map((law) => (
        <BentoGridItem
          key={law.slug}
          className="home-laws__card"
          href={law.sources[0]}
          title={law.title}
          description={law.definition}
          footer={
            <ul className="home-laws__labels" aria-label="Labels">
              {law.labels.map((label) => (
                <li
                  key={label}
                  data-accent={lawLabelAccents[label]}
                  style={{ "--law-label-accent": lawLabelAccentVariable(label) } as CSSProperties}
                >
                  {label}
                </li>
              ))}
            </ul>
          }
        />
      ))}
    </BentoGrid>
  );
}
