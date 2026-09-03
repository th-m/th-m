import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { thomDesignTokens } from "@th-m/design-theme";
import interCss from "@fontsource-variable/inter/wght.css?url";
import interItalicCss from "@fontsource-variable/inter/wght-italic.css?url";
import newsreaderCss from "@fontsource-variable/newsreader/wght.css?url";
import newsreaderItalicCss from "@fontsource-variable/newsreader/wght-italic.css?url";
import monoCss from "@fontsource/ibm-plex-mono/400.css?url";
import monoItalicCss from "@fontsource/ibm-plex-mono/400-italic.css?url";
import appCss from "../styles.css?url";
import { Layout } from "../layout/Layout";
import { ToolDrawer } from "../tools/ToolDrawer";
import { ToolDrawerProvider } from "../tools/ToolDrawerProvider";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: thomDesignTokens.color.background },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://th-m.netlify.app/brand/thom-og.png" },
      { name: "twitter:image", content: "https://th-m.netlify.app/brand/thom-og.png" },
    ],
    links: [
      { rel: "stylesheet", href: interCss },
      { rel: "stylesheet", href: interItalicCss },
      { rel: "stylesheet", href: newsreaderCss },
      { rel: "stylesheet", href: newsreaderItalicCss },
      { rel: "stylesheet", href: monoCss },
      { rel: "stylesheet", href: monoItalicCss },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/brand/favicon.svg" },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
});

function RootLayout() {
  return (
    <ToolDrawerProvider>
      <Layout>
        <Outlet />
      </Layout>
      <ToolDrawer />
    </ToolDrawerProvider>
  );
}

function NotFoundPage() {
  return (
    <div className="route-message bg-background text-foreground">
      <p className="eyebrow">404 · Not found</p>
      <h1>This page is outside the map.</h1>
      <Link to="/">Return home</Link>
    </div>
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
