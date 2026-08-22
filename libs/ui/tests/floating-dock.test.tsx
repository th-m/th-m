import { fireEvent, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FloatingDock } from "../src";

const items = [
  { title: "GitHub", href: "https://github.com/th-m", icon: <span>G</span> },
  { title: "Email", href: "mailto:thom@example.com", icon: <span>@</span> },
];

describe("FloatingDock", () => {
  it("renders an icon button per item with the right destination", () => {
    render(<FloatingDock items={items} />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/th-m");
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:thom@example.com");
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("opens external http(s) links in a new tab and keeps mail links in the current tab", () => {
    render(<FloatingDock items={items} />);
    const external = screen.getByRole("link", { name: "GitHub" });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "Email" })).not.toHaveAttribute("target");
  });

  it("reveals the item label while the button is hovered and hides it on leave", async () => {
    const user = userEvent.setup();
    render(<FloatingDock items={items} />);
    const link = screen.getByRole("link", { name: "GitHub" });

    expect(screen.queryByText("GitHub", { selector: ".thom-floating-dock__label" })).not.toBeInTheDocument();
    await user.hover(link);
    expect(await screen.findByText("GitHub", { selector: ".thom-floating-dock__label" })).toBeInTheDocument();
    await user.unhover(link);
    await waitForElementToBeRemoved(() => screen.queryByText("GitHub", { selector: ".thom-floating-dock__label" }));
  });

  it("reveals the label on keyboard focus", () => {
    render(<FloatingDock items={items} />);
    const link = screen.getByRole("link", { name: "Email" });
    fireEvent.focus(link);
    expect(screen.getByText("Email", { selector: ".thom-floating-dock__label" })).toBeInTheDocument();
  });

  it("passes through the className to the dock bar", () => {
    const { container } = render(<FloatingDock items={items} className="site-dock" />);
    expect(container.querySelector(".thom-floating-dock.site-dock")).not.toBeNull();
  });
});
