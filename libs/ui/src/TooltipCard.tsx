import * as React from "react";
import { cn } from "./cn";

export interface TooltipCardProps {
  /** Short inline label shown on the card itself. */
  title: string;
  /** One-line context shown on the card. */
  description: string;
  /** Heading of the floating detail panel. */
  tooltipTitle: string;
  /** Rich content of the floating detail panel. */
  tooltipDescription: React.ReactNode;
  /** Optional 1–2 character monogram or symbol in the icon well. */
  icon?: React.ReactNode;
  /** Optional footer row inside the floating detail panel. */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Port of Aceternity's tooltip-card: a compact card that reveals a floating
 * detail panel on hover or keyboard focus. The panel is always in the
 * accessibility tree and referenced from the card body.
 */
export function TooltipCard({
  title,
  description,
  tooltipTitle,
  tooltipDescription,
  icon,
  footer,
  className,
}: TooltipCardProps) {
  const panelId = React.useId();
  return (
    <div className={cn("thom-tooltip-card", className)}>
      <div className="thom-tooltip-card__body" aria-describedby={panelId}>
        {icon ? <div className="thom-tooltip-card__icon" aria-hidden="true">{icon}</div> : null}
        <h4 className="thom-tooltip-card__title">{title}</h4>
        <p className="thom-tooltip-card__description">{description}</p>
      </div>
      <div className="thom-tooltip-card__floating" id={panelId} role="tooltip">
        <p className="thom-tooltip-card__floating-title">{tooltipTitle}</p>
        <div className="thom-tooltip-card__floating-body">{tooltipDescription}</div>
        {footer ? <div className="thom-tooltip-card__floating-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
