import * as React from "react";
import { cn } from "./cn";

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column count at the md breakpoint (2–6); mobile stacks to one column. */
  columns?: 2 | 3 | 4 | 5 | 6;
}

/**
 * Aceternity-style bento grid (https://ui.aceternity.com/blocks/bento-grids),
 * restyled onto the THOM tokens: a responsive grid whose items may span
 * multiple columns/rows via `BentoGridItem`'s `span`/`rowSpan`.
 */
export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, columns = 3, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("thom-bento-grid", className)}
      style={{ "--bento-cols": columns } as React.CSSProperties}
      {...props}
    />
  ),
);
BentoGrid.displayName = "BentoGrid";

export interface BentoGridItemProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Visual top band (image, tile, figure). */
  header?: React.ReactNode;
  /** Small glyph or label row above the title. */
  icon?: React.ReactNode;
  /** Bottom row (metadata, chips, actions). */
  footer?: React.ReactNode;
  /** Column span at the md breakpoint. */
  span?: 1 | 2 | 3;
  /** Row span at the md breakpoint. */
  rowSpan?: 1 | 2;
  /** Renders the item as an external link to `href`. */
  href?: string;
}

/** One bento cell: a THOM surface card that may span grid tracks. */
export const BentoGridItem = React.forwardRef<HTMLElement, BentoGridItemProps>(
  ({ className, title, description, header, icon, footer, span = 1, rowSpan = 1, href, ...props }, ref) => {
    const classes = cn(
      "thom-bento-grid__item",
      span > 1 && `thom-bento-grid__item--span-${span}`,
      rowSpan > 1 && `thom-bento-grid__item--row-span-${rowSpan}`,
      className,
    );
    const body = (
      <>
        {header ? <div className="thom-bento-grid__item-header">{header}</div> : null}
        <div className="thom-bento-grid__item-body">
          {icon ? <div className="thom-bento-grid__item-icon">{icon}</div> : null}
          {title ? <h3 className="thom-bento-grid__item-title">{title}</h3> : null}
          {description ? <p className="thom-bento-grid__item-description">{description}</p> : null}
        </div>
        {footer ? <div className="thom-bento-grid__item-footer">{footer}</div> : null}
      </>
    );

    if (href) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} target="_blank" rel="noreferrer" {...props}>
          {body}
        </a>
      );
    }
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={classes} {...props}>
        {body}
      </div>
    );
  },
);
BentoGridItem.displayName = "BentoGridItem";
