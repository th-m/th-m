import { useId, useState, type ReactNode } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@th-m/ui";
import { BlogLink } from "@th-m/blogs/components";
import "./conspiracy-entry.css";

export function ConspiracyEntry({ name, marks, href, children }: {
  name: string;
  marks: string;
  href?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();

  return (
    <li className="conspiracy-entry">
      <HoverCard open={open} onOpenChange={setOpen} openDelay={120} closeDelay={160}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className="conspiracy-entry__trigger"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            onClick={() => setOpen(true)}
          >
            <span className="conspiracy-entry__name">{name}</span>{" "}
            <span className="conspiracy-entry__marks">{marks}</span>
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="conspiracy-entry__popover"
          align="start"
          side="bottom"
          collisionPadding={16}
        >
          <div className="conspiracy-entry__header">
            <strong id={titleId}>{href ? <BlogLink href={href}>{name}</BlogLink> : name}</strong>
            <button type="button" className="conspiracy-entry__close" aria-label="Close details" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="conspiracy-entry__details">{children}</div>
        </HoverCardContent>
      </HoverCard>
    </li>
  );
}
