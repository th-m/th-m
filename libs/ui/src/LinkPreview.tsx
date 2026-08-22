import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "./cn";

export interface LinkPreviewProps {
  /** Destination the link points to. */
  url: string;
  /** The link content: link text, or a full link element when `asChild`. */
  children: React.ReactNode;
  className?: string;
  /** Opens the rendered anchor in a new tab with rel=noreferrer. */
  external?: boolean;
  /**
   * Render the trigger as `children` instead of an anchor — use with a
   * TanStack Router `Link` (or any link element) to keep SPA navigation.
   */
  asChild?: boolean;
  /** Custom floating preview content; defaults to a destination card. */
  preview?: React.ReactNode;
  /** Optional static preview image (Aceternity's image variant). */
  imageSrc?: string;
  imageAlt?: string;
}

/** Default preview: the destination hostname, path, and an external arrow. */
function LinkDestination({ url }: { url: string }) {
  const absolute = /^https?:\/\//i.test(url);
  let hostname = "";
  let path = url;
  if (absolute) {
    try {
      const parsed = new URL(url);
      hostname = parsed.hostname.replace(/^www\./, "");
      path = `${parsed.pathname}${parsed.search}`;
    } catch {
      hostname = url;
      path = "";
    }
  }
  return (
    <span className="thom-link-preview__destination">
      <span className="thom-link-preview__host">{hostname || (path && path !== "/" ? path : "Link")}</span>
      {absolute && path && path !== "/" ? <span className="thom-link-preview__path">{path}</span> : null}
      {absolute ? <span className="thom-link-preview__arrow" aria-hidden="true">↗</span> : null}
    </span>
  );
}

/**
 * Port of Aceternity's link-preview: an inline link that reveals a small
 * floating card above it on hover or focus. The card previews where the link
 * goes — a destination card by default (hostname + path), or any custom
 * `preview` / static `imageSrc`. Built on the Radix hover card so the trigger
 * stays a real link, the preview is keyboard-reachable, and `asChild` keeps
 * SPA navigation for internal links.
 */
export function LinkPreview({
  url,
  children,
  className,
  external = false,
  asChild = false,
  preview,
  imageSrc,
  imageAlt = "",
}: LinkPreviewProps) {
  const trigger = asChild ? (
    children
  ) : (
    <a
      href={url}
      className={cn("thom-link-preview__trigger", className)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );

  const previewContent = imageSrc ? (
    <img src={imageSrc} alt={imageAlt} className="thom-link-preview__image" />
  ) : (
    preview ?? <LinkDestination url={url} />
  );

  return (
    <HoverCardPrimitive.Root openDelay={60} closeDelay={100}>
      <HoverCardPrimitive.Trigger asChild className={asChild ? className : undefined}>
        {trigger}
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          side="top"
          align="center"
          sideOffset={10}
          collisionPadding={16}
          className="thom-link-preview__content"
        >
          {previewContent}
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}
