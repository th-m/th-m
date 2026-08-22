import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardSpotlight } from "../src";

describe("CardSpotlight", () => {
  it("renders children inside the spotlight card", () => {
    render(<CardSpotlight>Spotlight content</CardSpotlight>);
    expect(screen.getByText("Spotlight content")).toBeInTheDocument();
  });

  it("tracks the cursor position into CSS custom properties", () => {
    const { container } = render(<CardSpotlight>Spotlight content</CardSpotlight>);
    const card = container.querySelector(".thom-card-spotlight") as HTMLElement;
    fireEvent.mouseMove(card, { clientX: 120, clientY: 60 });
    expect(card.style.getPropertyValue("--spot-x")).toBe("120px");
    expect(card.style.getPropertyValue("--spot-y")).toBe("60px");
  });

  it("renders the three overlay layers and the spotlight radius variable", () => {
    const { container } = render(<CardSpotlight spotlightRadius={320}>Spotlight content</CardSpotlight>);
    const card = container.querySelector(".thom-card-spotlight") as HTMLElement;
    expect(card.querySelector(".thom-card-spotlight__spotlight")).not.toBeNull();
    expect(card.querySelector(".thom-card-spotlight__border")).not.toBeNull();
    expect(card.querySelector(".thom-card-spotlight__noise")).not.toBeNull();
    expect(card.style.getPropertyValue("--spot-radius")).toBe("320px");
    const overlays = card.querySelectorAll("[aria-hidden='true']");
    expect(overlays.length).toBe(3);
  });

  it("passes through className and mouse handlers", () => {
    const onMouseMove = () => undefined;
    const { container } = render(
      <CardSpotlight className="extra" onMouseMove={onMouseMove}>
        Spotlight content
      </CardSpotlight>,
    );
    expect(container.querySelector(".thom-card-spotlight.extra")).not.toBeNull();
  });
});
