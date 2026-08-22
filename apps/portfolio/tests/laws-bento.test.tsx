import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { lawLabels } from "@th-m/laws";
import { LawsBento } from "../src/home/LawsBento";

function cards(): HTMLElement[] {
  return document.querySelectorAll(".thom-bento-grid__item") as unknown as HTMLElement[];
}

describe("LawsBento", () => {
  it("renders every law from the laws library as a bento card", () => {
    const { container } = render(<LawsBento />);
    expect(screen.getByRole("heading", { level: 2, name: "Laws" })).toBeInTheDocument();
    expect(container.querySelectorAll(".thom-bento-grid__item")).toHaveLength(42);
    expect(container.querySelectorAll(".thom-bento-grid__item--span-2")).toHaveLength(7);
  });

  it("links each law card out to its primary source", () => {
    render(<LawsBento />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(42);
    for (const link of links) {
      const href = link.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\//);
      expect(link).toHaveAttribute("target", "_blank");
    }
  });

  it("shows the law title, definition, monogram tile, and labels per card", () => {
    const { container } = render(<LawsBento />);
    expect(screen.getByText("Fitts’s Law")).toBeInTheDocument();
    expect(screen.getByText("The time to acquire a target is a function of the distance to and size of the target.")).toBeInTheDocument();
    expect(screen.getByText("Conway’s Law")).toBeInTheDocument();
    expect(container.querySelectorAll(".home-laws__tile")).toHaveLength(42);
    expect(container.querySelectorAll(".home-laws__tile")[0].textContent).toBe("AE");
    expect(screen.getAllByText("ui", { selector: ".home-laws__labels li" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("psychology", { selector: ".home-laws__labels li" }).length).toBeGreaterThan(0);
  });

  it("shows one pill per distinct label, all toggled on by default", () => {
    const { container } = render(<LawsBento />);
    expect(container.querySelectorAll(".home-laws__pill")).toHaveLength(lawLabels.length);
    for (const label of lawLabels) {
      const pill = screen.getByRole("button", { name: label });
      expect(pill).toHaveAttribute("aria-pressed", "true");
      expect(pill.className).toContain("home-laws__pill--on");
    }
  });

  it("hides only the cards whose every label pill is toggled off", () => {
    render(<LawsBento />);
    // Moore's Law carries only the "cs" label: turning cs off removes it,
    // while multi-label cs laws (e.g. Fitts's Law) stay visible.
    fireEvent.click(screen.getByRole("button", { name: "cs" }));
    expect(screen.getByRole("button", { name: "cs" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText("Moore’s Law")).not.toBeInTheDocument();
    expect(screen.getByText("Fitts’s Law")).toBeInTheDocument();
    expect(cards()).toHaveLength(41);
  });

  it("keeps a two-label card until both of its pills are off", () => {
    render(<LawsBento />);
    // Law of Prägnanz carries only "design" and "psychology".
    fireEvent.click(screen.getByRole("button", { name: "design" }));
    expect(screen.getByText("Law of Prägnanz")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "psychology" }));
    expect(screen.queryByText("Law of Prägnanz")).not.toBeInTheDocument();
    // Flipping either pill back on restores it.
    fireEvent.click(screen.getByRole("button", { name: "design" }));
    expect(screen.getByText("Law of Prägnanz")).toBeInTheDocument();
  });

  it("shows an empty state when every pill is off and restores cards when one returns", () => {
    render(<LawsBento />);
    for (const label of lawLabels) {
      fireEvent.click(screen.getByRole("button", { name: label }));
    }
    expect(cards()).toHaveLength(0);
    expect(screen.getByText(/No laws match/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "cs" }));
    expect(cards().length).toBeGreaterThan(0);
  });
});
