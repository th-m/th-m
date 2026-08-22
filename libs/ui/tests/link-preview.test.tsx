import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinkPreview } from "../src";

/** Radix hover cards open after `openDelay` (60ms); give the mount time under CI load. */
const HOVER_TIMEOUT = 3000;

describe("LinkPreview", () => {
  it("renders its own anchor trigger with the destination href", () => {
    render(<LinkPreview url="https://www.nngroup.com/articles/fitts-law/">Fitts's law on NN/g</LinkPreview>);
    const link = screen.getByRole("link", { name: "Fitts's law on NN/g" });
    expect(link).toHaveAttribute("href", "https://www.nngroup.com/articles/fitts-law/");
  });

  it("opens external triggers in a new tab with noreferrer", () => {
    render(<LinkPreview url="https://example.com" external>Example</LinkPreview>);
    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("reveals a destination card on hover", async () => {
    render(<LinkPreview url="https://www.smashingmagazine.com/articles/fitts-law/">Smashing Magazine</LinkPreview>);
    fireEvent.pointerEnter(screen.getByRole("link", { name: "Smashing Magazine" }));
    await waitFor(() => {
      expect(screen.getByText("smashingmagazine.com")).toBeInTheDocument();
    }, { timeout: HOVER_TIMEOUT });
  });

  it("shows the path in the destination card for deep links", async () => {
    render(<LinkPreview url="https://en.wikipedia.org/wiki/Fitts%27s_law">Wikipedia</LinkPreview>);
    fireEvent.pointerEnter(screen.getByRole("link", { name: "Wikipedia" }));
    await waitFor(() => {
      expect(screen.getByText("en.wikipedia.org")).toBeInTheDocument();
      expect(screen.getByText("/wiki/Fitts%27s_law")).toBeInTheDocument();
    }, { timeout: HOVER_TIMEOUT });
  });

  it("renders custom preview content instead of the destination card", async () => {
    render(
      <LinkPreview url="https://example.com" preview={<span data-testid="custom-preview">Custom preview</span>}>
        Example
      </LinkPreview>,
    );
    fireEvent.pointerEnter(screen.getByRole("link", { name: "Example" }));
    await waitFor(() => {
      expect(screen.getByTestId("custom-preview")).toBeInTheDocument();
    }, { timeout: HOVER_TIMEOUT });
    expect(screen.queryByText("example.com")).not.toBeInTheDocument();
  });

  it("renders a static image preview when imageSrc is provided", async () => {
    render(
      <LinkPreview url="https://example.com" imageSrc="/preview.png" imageAlt="Preview of example.com">
        Example
      </LinkPreview>,
    );
    fireEvent.pointerEnter(screen.getByRole("link", { name: "Example" }));
    await waitFor(() => {
      const image = screen.getByRole("img", { name: "Preview of example.com" });
      expect(image).toHaveAttribute("src", "/preview.png");
    }, { timeout: HOVER_TIMEOUT });
  });

  it("keeps an asChild trigger element (SPA link) as the hover target", async () => {
    render(
      <LinkPreview url="/writing/fittss-law" asChild>
        <a href="/writing/fittss-law" data-spa>Internal essay</a>
      </LinkPreview>,
    );
    const link = screen.getByRole("link", { name: "Internal essay" });
    expect(link).toHaveAttribute("data-spa", "true");
    fireEvent.pointerEnter(link);
    await waitFor(() => {
      expect(screen.getByText("/writing/fittss-law")).toBeInTheDocument();
    }, { timeout: HOVER_TIMEOUT });
  });
});
