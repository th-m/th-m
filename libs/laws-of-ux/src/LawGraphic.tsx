import * as React from "react";
import { adaptLawColor, adaptLawGraphic } from "./adapt";
import type { Law } from "./types";

export interface LawGraphicProps {
  law: Pick<Law, "graphic" | "color" | "title">;
  /** Enables the staggered shape reveal; disabled under prefers-reduced-motion. */
  animated?: boolean;
  className?: string;
}

/**
 * Renders one law's source artwork recolored onto the THOM theme:
 * eggshell shapes become brand gold, and the graphic background becomes a
 * darkened, hue-tinted tone of the law's original color.
 */
export function LawGraphic({ law, animated = false, className }: LawGraphicProps) {
  const adapted = React.useMemo(() => adaptLawGraphic(law.graphic), [law.graphic]);
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
      {/* Static, version-controlled artwork owned by this package. */}
      <div className="thom-law-graphic__frame" dangerouslySetInnerHTML={{ __html: adapted }} />
    </div>
  );
}
