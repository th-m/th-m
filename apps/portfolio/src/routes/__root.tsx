import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import interCss from "@fontsource-variable/inter/wght.css?url";
import newsreaderCss from "@fontsource-variable/newsreader/wght.css?url";
import monoCss from "@fontsource/ibm-plex-mono/400.css?url";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#050505" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://th-m.netlify.app/brand/thom-og.png" },
      { name: "twitter:image", content: "https://th-m.netlify.app/brand/thom-og.png" },
    ],
    links: [
      { rel: "stylesheet", href: interCss },
      { rel: "stylesheet", href: newsreaderCss },
      { rel: "stylesheet", href: monoCss },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/brand/favicon.svg" },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
});

function NotFoundPage() {
  return (
    <main className="route-message" id="main">
      <p className="eyebrow">404 · Not found</p>
      <h1>This page is outside the map.</h1>
      <Link to="/">Return home</Link>
    </main>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
