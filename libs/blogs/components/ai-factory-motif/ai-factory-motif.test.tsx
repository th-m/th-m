import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AiFactoryMotif } from "./ai-factory-motif";

afterEach(cleanup);

describe("AiFactoryMotif", () => {
  it.each([
    ["vision-to-morpheme", "Vision becomes a morpheme", "Vision", "Morpheme"],
    ["refinement-and-discipline-to-term-of-art", "Refinement and discipline establish a term of art", "Refinement", "Term of art"],
    ["term-of-art-to-implementation", "Understanding carries a term into implementation", "Term of art", "Implementation"],
    ["ontology-of-terms", "Ontology coordinates terms of art", "Actor", "Constraint"],
  ] as const)("renders the %s chapter with an accessible diagram", (variant, title, firstLabel, secondLabel) => {
    render(<AiFactoryMotif variant={variant} />);

    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    const diagram = screen.getByRole("img", { name: new RegExp(title) });
    expect(diagram).toContainElement(screen.getByText(firstLabel));
    expect(diagram).toContainElement(screen.getByText(secondLabel));
    expect(diagram.querySelector("title")).toHaveTextContent(title);
    expect(diagram.querySelector("desc")).not.toBeEmptyDOMElement();
    expect(screen.getByRole("region", { name: "Scrollable AI Factory motif" })).toHaveAttribute("tabindex", "0");
  });

  it("uses four cardinal edges and a central circle for vision", () => {
    render(<AiFactoryMotif variant="vision-to-morpheme" />);

    const diagram = screen.getByRole("img", { name: /Vision becomes a morpheme/ });
    expect(diagram.querySelectorAll(".ai-factory-motif__vision-edge")).toHaveLength(4);
    expect(diagram.querySelector(".ai-factory-motif__vision-center")).toBeInstanceOf(SVGElement);
    expect(diagram.querySelector(".ai-factory-motif__vision-boundary")).not.toBeInTheDocument();
    expect(diagram.querySelector(".ai-factory-motif__morpheme--diffuse .ai-factory-motif__morpheme-core")?.tagName).toBe("circle");
  });

  it("combines refinement and discipline into a term of art with a solid boundary", () => {
    render(<AiFactoryMotif variant="refinement-and-discipline-to-term-of-art" />);

    const diagram = screen.getByRole("img", { name: /Refinement and discipline establish a term of art/ });
    expect(diagram).toHaveTextContent("definition · evidence · correction");
    expect(diagram).toHaveTextContent("continuity · clarification");
    expect(diagram).toHaveTextContent("specification");
    expect(diagram.querySelectorAll(".ai-factory-motif__practice")).toHaveLength(2);
    expect(diagram.querySelector('[data-practice="discipline"].ai-factory-motif__practice')).toBeInstanceOf(SVGElement);
    expect(diagram.querySelector('[data-practice="refinement"].ai-factory-motif__practice')).toBeInstanceOf(SVGElement);
    expect(diagram.querySelector('[data-practice="discipline"].ai-factory-motif__practice-input')).toHaveAttribute("marker-end");
    expect(diagram.querySelector('[data-practice="refinement"].ai-factory-motif__practice-input')).toHaveAttribute("marker-end");
    const termOfArt = diagram.querySelector(".ai-factory-motif__morpheme--refined");
    expect(termOfArt?.querySelector(".ai-factory-motif__morpheme-core")?.tagName).toBe("circle");
    expect(termOfArt).not.toHaveClass("ai-factory-motif__morpheme--diffuse");
  });

  it("shows understanding carrying a term of art into a concrete implementation", () => {
    render(<AiFactoryMotif variant="term-of-art-to-implementation" />);

    const diagram = screen.getByRole("img", { name: /Understanding carries a term into implementation/ });
    expect(diagram).toHaveTextContent("context · evidence · stakes");
    expect(diagram).toHaveTextContent("decision · test · artifact");
    expect(diagram.querySelector(".ai-factory-motif__understanding-glyph")).toBeInstanceOf(SVGElement);
    expect(diagram.querySelectorAll(".ai-factory-motif__understanding-vision-edge")).toHaveLength(4);
    expect(diagram.querySelector(".ai-factory-motif__understanding-vision-center")).toBeInstanceOf(SVGElement);
    expect(diagram.querySelector(".ai-factory-motif__understanding-term-boundary")).toBeInstanceOf(SVGElement);
    expect(diagram.querySelector(".ai-factory-motif__understanding-term-center")).toBeInstanceOf(SVGElement);
    expect(diagram.querySelector(".ai-factory-motif__implementation-glyph")).toBeInstanceOf(SVGElement);
  });
});
