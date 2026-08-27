import { fireEvent, render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { laws, lawLabelAbbreviations, lawLabelAccents, lawLabels } from "@th-m/laws";
import { LawsBento, featuredLaws } from "../src/home/LawsBento";
import { LawsCatalog } from "../src/laws/LawsCatalog";

function cards(): HTMLElement[] {
  return document.querySelectorAll(".thom-bento-grid__item") as unknown as HTMLElement[];
}

async function renderHomeLaws() {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: LawsBento,
  });
  const lawsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/laws",
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, lawsRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("LawsBento", () => {
  it("renders a curated twelve-law home collection", async () => {
    const { container } = await renderHomeLaws();
    expect(screen.getByRole("heading", { level: 2, name: "Laws" })).toBeInTheDocument();
    expect(container.querySelectorAll(".thom-bento-grid__item")).toHaveLength(12);
    expect(container.querySelectorAll(".home-laws__card")).toHaveLength(featuredLaws.length);
    expect(container.querySelectorAll(".home-laws__pill")).toHaveLength(0);
    const firstLawLabels = Array.from(
      container.querySelectorAll<HTMLElement>(".home-laws__card:first-child .home-laws__labels li"),
    );
    expect(firstLawLabels.map((label) => label.textContent)).toEqual(
      featuredLaws[0]!.labels.map((label) => lawLabelAbbreviations[label]),
    );
    expect(firstLawLabels.map((label) => label.getAttribute("aria-label"))).toEqual(featuredLaws[0]!.labels);
  });

  it("hands off from the curated collection to the complete catalog", async () => {
    await renderHomeLaws();
    expect(screen.getByRole("link", { name: /View all laws/ })).toHaveAttribute("href", "/laws");
  });

  it("keeps featured law cards linked to their primary sources", async () => {
    await renderHomeLaws();
    const externalLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("target") === "_blank");
    expect(externalLinks).toHaveLength(featuredLaws.length);
    for (const link of externalLinks) expect(link.getAttribute("href")).toMatch(/^https?:\/\//);
  });
});

describe("LawsCatalog", () => {
  it("renders the complete collection with filtering off by default", () => {
    const { container } = render(<LawsCatalog />);
    expect(container.querySelectorAll(".thom-bento-grid__item")).toHaveLength(laws.length);
    expect(screen.getByText(`All ${laws.length} laws`)).toBeInTheDocument();
    for (const label of lawLabels) {
      const pill = screen.getByRole("button", { name: label });
      expect(pill).toHaveAttribute("aria-pressed", "false");
      expect(pill).toHaveTextContent(lawLabelAbbreviations[label]);
      expect(pill).toHaveAttribute("title", label);
      expect(pill.className).not.toContain("home-laws__pill--selected");
    }
  });

  it("uses outline pills with the label accent contract", () => {
    render(<LawsCatalog />);
    for (const label of lawLabels) {
      const pill = screen.getByRole("button", { name: label });
      expect(pill).toHaveAttribute("data-accent", lawLabelAccents[label]);
      expect(pill.style.getPropertyValue("--law-label-accent")).toBe(
        `var(--color-accent-${lawLabelAccents[label]})`,
      );
    }
  });

  it("immediately focuses on the first selected type", () => {
    render(<LawsCatalog />);
    fireEvent.click(screen.getByRole("button", { name: "cs" }));

    const expected = laws.filter((law) => law.labels.includes("cs"));
    const selected = screen.getByRole("button", { name: "cs" });
    expect(selected).toHaveAttribute("aria-pressed", "true");
    expect(selected.className).toContain("home-laws__pill--selected");
    expect(selected.style.background).toBe(
      `var(--color-accent-${lawLabelAccents.cs})`,
    );
    expect(selected.style.color).toBe("var(--color-accent-foreground)");
    expect(selected.style.opacity).toBe("1");
    expect(cards()).toHaveLength(expected.length);
  });

  it("matches any selected type and turns filtering off when the last is cleared", () => {
    render(<LawsCatalog />);
    fireEvent.click(screen.getByRole("button", { name: "cs" }));
    fireEvent.click(screen.getByRole("button", { name: "design" }));

    const expectedUnion = laws.filter((law) => law.labels.some((label) => label === "cs" || label === "design"));
    expect(cards()).toHaveLength(expectedUnion.length);

    fireEvent.click(screen.getByRole("button", { name: "cs" }));
    expect(cards()).toHaveLength(laws.filter((law) => law.labels.includes("design")).length);

    fireEvent.click(screen.getByRole("button", { name: "design" }));
    expect(cards()).toHaveLength(laws.length);
    expect(screen.getByText(`All ${laws.length} laws`)).toBeInTheDocument();
  });
});
