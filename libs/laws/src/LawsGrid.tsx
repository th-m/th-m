import * as React from "react";
import type { Law } from "./types";
import { laws as allLaws } from "./laws";
import { LawCard } from "./LawCard";

export interface LawsGridProps {
  /** Laws to render; defaults to all 30 in source order. */
  laws?: Law[];
  animated?: boolean;
  className?: string;
}

/** Responsive grid of law cards. */
export function LawsGrid({ laws = allLaws, animated, className }: LawsGridProps) {
  return (
    <ol className={["thom-laws-grid", className].filter(Boolean).join(" ")}>
      {laws.map((law, index) => (
        <li key={law.slug}>
          <LawCard law={law} index={index + 1} animated={animated} />
        </li>
      ))}
    </ol>
  );
}
