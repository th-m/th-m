import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FloatingDockFooter } from "../src/layout/FloatingDockFooter";

describe("global floating dock footer", () => {
  it("renders an icon button for every social link", () => {
    render(<FloatingDockFooter />);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/thomasvaladez/",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/th-m");
    expect(screen.getByRole("link", { name: "X" })).toHaveAttribute("href", "https://x.com/Thom_Sound");
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:thomvaladez@gmail.com");
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  it("opens external links in a new tab and keeps the mail link in the current tab", () => {
    render(<FloatingDockFooter />);
    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "Email" })).not.toHaveAttribute("target");
  });

  it("reveals and hides a label while hovering an icon button", async () => {
    const user = userEvent.setup();
    render(<FloatingDockFooter />);
    const link = screen.getByRole("link", { name: "GitHub" });

    await user.hover(link);
    expect(await screen.findByText("GitHub", { selector: ".thom-floating-dock__label" })).toBeInTheDocument();
    await user.unhover(link);
    await waitForElementToBeRemoved(() => screen.queryByText("GitHub", { selector: ".thom-floating-dock__label" }));
  });

  it("renders the dock with the fixed site-dock placement class", () => {
    const { container } = render(<FloatingDockFooter />);
    expect(container.querySelector(".thom-floating-dock.site-dock")).not.toBeNull();
  });
});
