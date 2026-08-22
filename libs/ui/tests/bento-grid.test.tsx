import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BentoGrid, BentoGridItem } from "../src";

describe("BentoGrid", () => {
  it("renders items inside the grid with the configured column count", () => {
    const { container } = render(
      <BentoGrid columns={4}>
        <BentoGridItem title="One" description="First cell" />
        <BentoGridItem title="Two" description="Second cell" />
      </BentoGrid>,
    );
    expect(container.querySelectorAll(".thom-bento-grid__item")).toHaveLength(2);
    const grid = container.querySelector(".thom-bento-grid") as HTMLElement;
    expect(grid.style.getPropertyValue("--bento-cols")).toBe("4");
    expect(screen.getByRole("heading", { level: 3, name: "One" })).toBeInTheDocument();
    expect(screen.getByText("Second cell")).toBeInTheDocument();
  });

  it("applies column and row span modifiers", () => {
    const { container } = render(
      <BentoGrid>
        <BentoGridItem span={2} rowSpan={2} title="Featured" description="Spans tracks" />
      </BentoGrid>,
    );
    const item = container.querySelector(".thom-bento-grid__item") as HTMLElement;
    expect(item.className).toContain("thom-bento-grid__item--span-2");
    expect(item.className).toContain("thom-bento-grid__item--row-span-2");
  });

  it("renders header, icon, and footer slots", () => {
    const { container } = render(
      <BentoGridItem
        title="Layered"
        description="Body"
        header={<div data-testid="bento-header">Header</div>}
        icon={<span data-testid="bento-icon">◎</span>}
        footer={<span data-testid="bento-footer">Footer</span>}
      />,
    );
    expect(screen.getByTestId("bento-header")).toBeInTheDocument();
    expect(screen.getByTestId("bento-icon")).toBeInTheDocument();
    expect(screen.getByTestId("bento-footer")).toBeInTheDocument();
  });

  it("renders as an external link when href is provided", () => {
    render(
      <BentoGrid>
        <BentoGridItem href="https://lawsofux.com/fittss-law/" title="Fitts's Law" description="The time to acquire a target…" />
      </BentoGrid>,
    );
    const link = screen.getByRole("link", { name: /Fitts's Law/ });
    expect(link).toHaveAttribute("href", "https://lawsofux.com/fittss-law/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });
});
