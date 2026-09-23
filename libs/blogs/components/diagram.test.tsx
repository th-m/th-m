import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResponsiveDiagram } from "./diagram";

describe("responsive diagram detail", () => {
  it("keeps the summary and expands the same detailed scene with an accessible control", () => {
    const { container } = render(
      <ResponsiveDiagram label="Goal path" summary={<p>The main relationship</p>}>
        <p>Every branch</p>
      </ResponsiveDiagram>,
    );
    const toggle = screen.getByRole("button", { hidden: true });
    const region = screen.getByRole("region", { name: "Goal path — full diagram" });
    expect(toggle.getAttribute("aria-controls")).toBe(region.id);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector(".responsive-diagram")?.getAttribute("data-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getAllByText("Every branch")).toHaveLength(1);
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });
});
