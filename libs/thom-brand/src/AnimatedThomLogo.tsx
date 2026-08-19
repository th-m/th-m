import { useCallback, useState } from "react";
import { HeroOrbit } from "./HeroOrbit";
import { ThomLogo, type MotionLevel } from "./ThomLogo";
import type { ThomGlyph } from "./threeScene";

export interface AnimatedThomLogoProps {
  ariaLabel?: string;
  assetBasePath?: string;
  className?: string;
  markClassName?: string;
  motion?: MotionLevel;
  onActiveGlyphChange?: (glyph: ThomGlyph | null) => void;
}

export function AnimatedThomLogo({
  ariaLabel = "THOM — Thomas Valadez",
  assetBasePath = "/brand",
  className = "",
  markClassName = "",
  motion = "full",
  onActiveGlyphChange,
}: AnimatedThomLogoProps) {
  const [activeGlyph, setActiveGlyph] = useState<ThomGlyph | null>(null);
  const handleActiveGlyphChange = useCallback((glyph: ThomGlyph | null) => {
    setActiveGlyph(glyph);
    onActiveGlyphChange?.(glyph);
  }, [onActiveGlyphChange]);

  return (
    <div className={`animated-thom-logo ${className}`} data-active-glyph={activeGlyph ?? "idle"}>
      <HeroOrbit activeGlyph={activeGlyph} />
      <div className={`animated-thom-logo__mark ${markClassName}`}>
        <ThomLogo
          variant="hero"
          assetBasePath={assetBasePath}
          motion={motion}
          interactive
          ariaLabel={ariaLabel}
          onActiveGlyphChange={handleActiveGlyphChange}
        />
      </div>
    </div>
  );
}
