import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SOURCE_EGGSHELL } from "../src/adapt";
import { laws, lawBySlug } from "../src/laws";
import { LawCard } from "../src/LawCard";
import { LawDetail } from "../src/LawDetail";
import { LawGraphic, lawMonogram } from "../src/LawGraphic";
import { LawsGrid } from "../src/LawsGrid";

const fitts = lawBySlug["fittss-law"]!;
const conway = lawBySlug["conways-law"]!;
const murphy = lawBySlug["murphys-law"]!;
const norvig = lawBySlug["norvigs-law"]!;

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

  it("renders a monogram fallback tile for laws without source artwork", () => {
    const { container } = render(<LawGraphic law={conway} />);
    expect(container.querySelector(".thom-law-graphic__frame")).toBeNull();
    expect(container.querySelector(".thom-law-graphic__monogram")?.textContent).toBe("CL");
    expect(lawMonogram("Ninety-ninety rule")).toBe("NR");
  });

  it("applies the animated modifier when requested", () => {
    const { container } = render(<LawGraphic law={fitts} animated />);
    expect(container.querySelector(".thom-law-graphic--animated")).not.toBeNull();
  });
});

describe("LawCard", () => {
  it("renders index, category, title, definition, and labels", () => {
    const { container } = render(<LawCard law={fitts} index={7} />);
    expect(screen.getByText("07")).toBeInTheDocument();
    expect(screen.getByText("theory")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Fitts’s Law" })).toBeInTheDocument();
    expect(screen.getByText("The time to acquire a target is a function of the distance to and size of the target.")).toBeInTheDocument();
    const labels = Array.from(container.querySelectorAll<HTMLElement>(".thom-law-label"));
    expect(labels.map((label) => label.textContent)).toEqual(["UI", "DES", "CS"]);
    expect(labels.map((label) => label.getAttribute("aria-label"))).toEqual(["ui", "design", "cs"]);
    expect(labels.map((label) => label.title)).toEqual(["ui", "design", "cs"]);
  });

  it("renders as a link when href is provided", () => {
    render(<LawCard law={fitts} href="/laws/fittss-law" />);
    const link = screen.getByRole("link", { name: /Fitts’s Law/ });
    expect(link).toHaveAttribute("href", "/laws/fittss-law");
    expect(link.className).toContain("thom-law-card");
  });
});

describe("LawDetail", () => {
  it("renders definition, labels, takeaways, and origins copy", () => {
    render(<LawDetail law={fitts} />);
    expect(screen.getByRole("heading", { level: 2, name: "Fitts’s Law" })).toBeInTheDocument();
    expect(screen.getByText("Takeaways")).toBeInTheDocument();
    expect(screen.getByText("Touch targets should be large enough for users to accurately select them.")).toBeInTheDocument();
    expect(screen.getByText("Origins")).toBeInTheDocument();
    expect(screen.getByText(/In 1954, psychologist Paul Fitts/)).toBeInTheDocument();
    expect(screen.queryByLabelText("software-engineering")).not.toBeInTheDocument();
    expect(screen.getAllByText("CS").length).toBeGreaterThanOrEqual(1);
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

  it("renders related laws through their primary source URL", () => {
    render(<LawDetail law={fitts} />);
    expect(screen.getByText("Related")).toBeInTheDocument();
    const related = screen.getByRole("link", { name: "Choice Overload" });
    expect(related).toHaveAttribute("href", "https://lawsofux.com/choice-overload/");
  });

  it("omits sections a software law does not provide", () => {
    render(<LawDetail law={norvig} />);
    expect(screen.queryByText("Takeaways")).not.toBeInTheDocument();
    expect(screen.queryByText("Origins")).not.toBeInTheDocument();
    expect(screen.queryByText("Further Reading")).not.toBeInTheDocument();
    expect(screen.queryByText("Related")).not.toBeInTheDocument();
    expect(screen.getByLabelText("product")).toHaveTextContent("PRO");
  });

  it("omits the source link when a law has no source", () => {
    const doherty = lawBySlug["doherty-threshold"]!;
    render(<LawDetail law={doherty} />);
    expect(screen.queryByRole("link", { name: "Source" })).not.toBeInTheDocument();
  });

  it("turns Murphy's derivations into takeaways", () => {
    render(<LawDetail law={murphy} />);
    expect(screen.getByText("Takeaways")).toBeInTheDocument();
    expect(screen.getByText(/First derivation: If it works/)).toBeInTheDocument();
  });
});

describe("LawsGrid", () => {
  it("renders all 42 laws as cards by default", () => {
    render(<LawsGrid />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(42);
  });

  it("honors an explicit law subset", () => {
    render(<LawsGrid laws={[fitts]} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);
  });

  it("indexes cards 01..03 for a small subset", () => {
    render(<LawsGrid laws={laws.slice(0, 3)} />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });
});
