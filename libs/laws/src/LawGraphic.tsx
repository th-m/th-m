import * as React from "react";
import { adaptLawColor, adaptLawGraphic } from "./adapt";
import type { Law } from "./types";

export interface LawGraphicProps {
  law: Pick<Law, "graphic" | "color" | "title">;
  /** Enables the staggered shape reveal; disabled under prefers-reduced-motion. */
  animated?: boolean;
  className?: string;
}

/** Short monogram used by the fallback tile when a law has no source artwork. */
export function lawMonogram(title: string): string {
  const letters = title
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
    .filter((word) => word.length > 0)
    .map((word) => word[0])
    .join("")
    .slice(0, 3);
  return letters.toUpperCase();
}

/**
 * Renders a law's source artwork recolored onto the THOM theme:
 * eggshell shapes become brand gold, and the graphic background becomes a
 * darkened, hue-tinted tone of the law's original color. Laws without source
 * artwork get a branded fallback tile: the adapted law-color background with a
 * gold monogram.
 */
export function LawGraphic({ law, animated = false, className }: LawGraphicProps) {
  const adapted = React.useMemo(() => (law.graphic ? adaptLawGraphic(law.graphic) : null), [law.graphic]);
  const background = React.useMemo(() => adaptLawColor(law.color), [law.color]);

  return (
    <div
      className={["thom-law-graphic", animated && "thom-law-graphic--animated", className]
        .filter(Boolean)
        .join(" ")}
      style={{ "--law-color": background, "--law-source-color": law.color } as React.CSSProperties}
      role="img"
      aria-label={`${law.title} law graphic`}
    >
      {adapted ? (
        // Static, version-controlled artwork owned by this package.
        <div className="thom-law-graphic__frame" dangerouslySetInnerHTML={{ __html: adapted }} />
      ) : (
        <span className="thom-law-graphic__monogram" aria-hidden="true">
          {lawMonogram(law.title)}
        </span>
      )}
    </div>
  );
}
