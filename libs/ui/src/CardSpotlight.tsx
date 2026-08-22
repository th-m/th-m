import * as React from "react";

export interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Diameter of the spotlight circle in px. */
  spotlightRadius?: number;
}

/**
 * Aceternity-style card spotlight (https://ui.aceternity.com/components/card-spotlight),
 * restyled onto the THOM tokens: a gold radial spotlight, a matching border
 * glow, and a subtle noise grain all follow the cursor while the card is
 * hovered or focused. Overlays are opacity-only transitions, so reduced-motion
 * users still get the hover feedback without movement.
 */
export const CardSpotlight = React.forwardRef<HTMLDivElement, CardSpotlightProps>(
  ({ className, spotlightRadius = 280, onMouseMove, ...props }, ref) => {
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      onMouseMove?.(event);
    };

    return (
      <div
        ref={ref}
        className={["thom-card-spotlight", className].filter(Boolean).join(" ")}
        style={{ "--spot-radius": `${spotlightRadius}px` } as React.CSSProperties}
        onMouseMove={handleMouseMove}
        {...props}
      >
        <span className="thom-card-spotlight__spotlight" aria-hidden="true" />
        <span className="thom-card-spotlight__border" aria-hidden="true" />
        <span className="thom-card-spotlight__noise" aria-hidden="true" />
        {props.children}
      </div>
    );
  },
);
CardSpotlight.displayName = "CardSpotlight";
