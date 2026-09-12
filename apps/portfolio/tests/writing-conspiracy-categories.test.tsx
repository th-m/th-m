import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { ArticleContent } from "../src/writing/ArticleContent";
import { ToolDrawerProvider } from "../src/tools/ToolDrawerProvider";

async function renderArticle() {
  const rootRoute = createRootRoute({ component: () => <ToolDrawerProvider><Outlet /></ToolDrawerProvider> });
  const route = createRoute({
    getParentRoute: () => rootRoute,
    path: "/writing/$slug",
    component: () => <ArticleContent article={{
      slug: "conspiracy-by-categories",
      title: "Conspiracy by Categories",
      description: "Claims, institutions, financial incentives, and the relationships between powerful people.",
      publishedAt: "2026-09-12",
      tags: ["Institutions", "Conspiracies", "Society"],
      articlePath: "posts/conspiracy-by-categories/article.mdx",
      assetRegistryPath: "posts/conspiracy-by-categories/assets.json",
    }} />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([route]),
    history: createMemoryHistory({ initialEntries: ["/writing/conspiracy-by-categories"] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("Conspiracy category details", () => {
  it("shows individual names and marks while keeping descriptions in hover details", async () => {
    await renderArticle();
    const section = screen.getByRole("heading", { name: "Theories organized by institutions" }).closest("section")!;
    expect(within(section).getAllByRole("listitem")).toHaveLength(37);
    for (const name of ["Tuskegee syphilis study ✓", "St. Louis aerosol tests ✓", "MKULTRA ✓", "Hillary Clinton emails ? $", "WTC ✓ $", "Maxwell Curriculum reform ✓", "Göbekli Tepe ✓", "Titanic ?", "Human engineering ✓"]) {
      expect(within(section).getByRole("button", { name })).toHaveAttribute("aria-expanded", "false");
    }
    expect(within(section).queryByRole("button", { name: /Building 7|9\/11 orchestration/ })).not.toBeInTheDocument();
    expect(screen.queryByText("Researchers did not deliberately infect the participants.")).not.toBeInTheDocument();
    const user = userEvent.setup();
    await user.hover(screen.getByRole("button", { name: "Tuskegee syphilis study ✓" }));
    const details = await screen.findByRole("dialog", { name: "Tuskegee syphilis study" });
    expect(details).toHaveTextContent("Tuskegee, Alabama, 1932–1972: public-health researchers deceived Black men and withheld effective treatment while studying untreated syphilis.");
    expect(details).toHaveTextContent("Year / period: 1932–1972 — study period.");
    expect(within(details).queryByText("Researchers did not deliberately infect the participants.")).not.toBeInTheDocument();
    expect(within(details).queryByRole("link", { name: "CDC" })).not.toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await user.hover(screen.getByRole("button", { name: "St. Louis aerosol tests ✓" }));
    const aerosolDetails = await screen.findByRole("dialog", { name: "St. Louis aerosol tests" });
    expect(aerosolDetails).toHaveTextContent("St. Louis aerosol tests, 1950s–1960s: the Army secretly dispersed zinc cadmium sulfide to study how airborne biological-warfare agents could spread. Residents were exposed without knowing about the tests. The spraying itself is documented.");
    expect(within(aerosolDetails).getByRole("link", { name: "National Research Council" })).toHaveAttribute("href", "https://www.ncbi.nlm.nih.gov/books/NBK233549/");
  });

  it("reveals both original WTC descriptions from keyboard focus", async () => {
    await renderArticle();
    fireEvent.focus(screen.getByRole("button", { name: "WTC ✓ $" }));
    const details = await screen.findByRole("dialog", { name: "WTC" });
    expect(details).toHaveTextContent("World Trade Center Building 7 was demolished deliberately.");
    expect(details).toHaveTextContent("July 2001. Larry Silverstein’s group had insurance coverage agreements started on June 7 and closed on July 24, 2001—49 days before September 11.");
    expect(details).toHaveTextContent("Year / period: 2001 — insurance agreements and September 11 attacks.");
  });

  it("supports touch opening and closing while preserving the map wording", async () => {
    await renderArticle();
    const trigger = screen.getByRole("button", { name: "Textbook propaganda ?" });
    fireEvent.pointerDown(trigger, { pointerType: "touch" });
    fireEvent.pointerUp(trigger, { pointerType: "touch" });
    fireEvent.click(trigger);
    const details = await screen.findByRole("dialog", { name: "Textbook propaganda" });
    expect(details).toHaveTextContent("Read China's history books on WW2.");
    expect(details).toHaveTextContent("Year / period: 1939–1945 — World War II, the period discussed in the textbooks.");
    fireEvent.click(within(details).getByRole("button", { name: "Close details" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
