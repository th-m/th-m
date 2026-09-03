import { useId, type ReactNode } from "react";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@th-m/ui";

/** A click/touch/keyboard-accessible reference that keeps the article in view. */
export function DocumentPopover({ title, trigger, children }: {
  title: string;
  trigger: ReactNode;
  children: ReactNode;
}) {
  const titleId = useId();
  return (
    <Popover>
      <PopoverTrigger className="article-document-popover__trigger">{trigger}</PopoverTrigger>
      <PopoverContent
        className="article-document-popover"
        aria-labelledby={titleId}
        side="bottom"
        align="start"
      >
        <div className="article-document-popover__header">
          <h2 id={titleId}>{title}</h2>
          <PopoverClose className="article-document-popover__close" aria-label="Close reference">
            <span aria-hidden="true">×</span>
          </PopoverClose>
        </div>
        <div
          className="article-document-popover__body article-outline__content"
          role="document"
          aria-label={title}
          tabIndex={0}
        >
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}
