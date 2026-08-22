import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SOURCE_EGGSHELL } from "../src/adapt";
import { laws, lawBySlug } from "../src/laws";
import { LawCard } from "../src/LawCard";
import { LawDetail } from "../src/LawDetail";
import { LawGraphic } from "../src/LawGraphic";
import { LawsGrid } from "../src/LawsGrid";

const fitts = lawBySlug["fittss-law"]!;

describe("LawGraphic", () => {
  it("renders the adapted artwork with an accessible label", () => {
    const { container } = render(<LawGraphic law={fitts} />);
    const graphic = container.querySelector(".thom-law-graphic");
    expect(graphic).not.toBeNull();
    expect(graphic).toHaveAttribute("role", "img");
    expect(graphic).toHaveAttribute("aria-label", "Fitts’s Law law graphic");
    const svg = container.querySelector(".thom-law-graphic svg");
    expect(svg).not.toBeNull();
    expect(svg!.innerHTML).not.toContain(SOURCE_EGGSHELL);
  });

  it("sets the adapted law color as a background variable", () => {
    const { container } = render(<LawGraphic law={fitts} />);
    const graphic = container.querySelector(".thom-law-graphic") as HTMLElement;
    expect(graphic.style.getPropertyValue("--law-color")).toMatch(/^#[0-9a-f]{6}$/i);
    expect(graphic.style.getPropertyValue("--law-source-color")).toBe("#5d883a");
  });

  it("applies the animated modifier when requested", () => {
    const { container } = render(<LawGraphic law={fitts} animated />);
    expect(container.querySelector(".thom-law-graphic--animated")).not.toBeNull();
  });
});

describe("LawCard", () => {
  it("renders index, category, title, and definition", () => {
    render(<LawCard law={fitts} index={7} />);
    expect(screen.getByText("07")).toBeInTheDocument();
    expect(screen.getByText("theory")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Fitts’s Law" })).toBeInTheDocument();
    expect(screen.getByText("The time to acquire a target is a function of the distance to and size of the target.")).toBeInTheDocument();
  });

  it("renders as a link when href is provided", () => {
    render(<LawCard law={fitts} href="/laws/fittss-law" />);
    const link = screen.getByRole("link", { name: /Fitts’s Law/ });
    expect(link).toHaveAttribute("href", "/laws/fittss-law");
    expect(link.className).toContain("thom-law-card");
  });
});

describe("LawDetail", () => {
  it("renders definition, takeaways, and origins copy", () => {
    render(<LawDetail law={fitts} />);
    expect(screen.getByRole("heading", { level: 2, name: "Fitts’s Law" })).toBeInTheDocument();
    expect(screen.getByText("Takeaways")).toBeInTheDocument();
    expect(screen.getByText("Touch targets should be large enough for users to accurately select them.")).toBeInTheDocument();
    expect(screen.getByText("Origins")).toBeInTheDocument();
    expect(screen.getByText(/In 1954, psychologist Paul Fitts/)).toBeInTheDocument();
  });

  it("links out to the source and further reading entries", () => {
    render(<LawDetail law={fitts} />);
    const source = screen.getByRole("link", { name: "Source" });
    expect(source).toHaveAttribute("href", "https://www.interaction-design.org/literature/topics/fitts-law");
    expect(source).toHaveAttribute("target", "_blank");
    const reading = screen.getByRole("link", { name: "Fitts's Law and Its Applications in UX" });
    expect(reading).toHaveAttribute("href", "https://www.nngroup.com/articles/fitts-law/");
    expect(reading).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("Nielsen Norman Group")).toBeInTheDocument();
  });

  it("renders related laws resolved through lawBySlug", () => {
    render(<LawDetail law={fitts} />);
    expect(screen.getByText("Related")).toBeInTheDocument();
    const related = screen.getByRole("link", { name: "Choice Overload" });
    expect(related).toHaveAttribute("href", "https://lawsofux.com/choice-overload/");
  });

  it("omits the source link when a law has no source", () => {
    const doherty = lawBySlug["doherty-threshold"]!;
    render(<LawDetail law={doherty} />);
    expect(screen.queryByRole("link", { name: "Source" })).not.toBeInTheDocument();
  });
});

describe("LawsGrid", () => {
  it("renders all 30 laws as cards by default", () => {
    render(<LawsGrid />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(30);
    expect(screen.getAllByText("theory").length + screen.getAllByText("psychology").length).toBe(30);
  });

  it("honors an explicit law subset", () => {
    render(<LawsGrid laws={[fitts]} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);
  });

  it("indexes cards 01..30", () => {
    render(<LawsGrid laws={laws.slice(0, 3)} />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });
});
