import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createMemoryHistory, createRoute, createRouter } from "@tanstack/react-router";
import interItalicCss from "@fontsource-variable/inter/wght-italic.css?url";
import newsreaderItalicCss from "@fontsource-variable/newsreader/wght-italic.css?url";
import monoItalicCss from "@fontsource/ibm-plex-mono/400-italic.css?url";
import type { BlogManifest } from "@th-m/blogs/publish";
import { describe, expect, it } from "vitest";
import { Route } from "../src/routes/__root";

const manifest = JSON.parse(readFileSync(resolve(process.cwd(), "public/_content/manifest.json"), "utf8")) as BlogManifest;
const writingRoute = createRoute({
  getParentRoute: () => Route,
  path: "/writing/$slug",
  component: () => null,
});
const routeTree = Route.addChildren([writingRoute]);

describe("shared blog typography", () => {
  it.each(manifest.posts.map((post) => post.slug))("loads real italic fonts in the shared shell for %s", async (slug) => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: [`/writing/${slug}`] }),
    });
    await router.load();

    const rootMatch = router.state.matches.find((match) => match.routeId === Route.id);
    expect(rootMatch?.links).toEqual(expect.arrayContaining([
      { rel: "stylesheet", href: interItalicCss },
      { rel: "stylesheet", href: newsreaderItalicCss },
      { rel: "stylesheet", href: monoItalicCss },
    ]));
  });
});
