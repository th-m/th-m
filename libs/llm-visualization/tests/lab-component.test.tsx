import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LanguageModelWorkbench, TransformerLab } from "../src";

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  cleanup();
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: originalMatchMedia });
  vi.useRealTimers();
});

describe("TransformerLab", () => {
  it("exposes editable transforms, architecture metrics, training separation, and scientific caveats", () => {
    render(<TransformerLab />);

    const lab = screen.getByRole("region", { name: "Interactive deterministic transformer lab" });
    expect(lab).toHaveAttribute("data-phase", "tokenize");
    expect(screen.getByLabelText("Prompt")).toHaveValue("The model learns to");
    expect(within(screen.getByLabelText("Tokenized prompt")).getByText("▁model")).toBeInTheDocument();
    expect(within(screen.getByLabelText("Illustrative transformer architecture metrics")).getByText("32.7K")).toBeInTheDocument();
    expect(screen.getByText("Not inference")).toBeInTheDocument();
    expect(screen.getByText(/no model weights are trained/i)).toBeInTheDocument();
    expect(screen.getAllByText("Persistent learned parameter").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Temporary activation").length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText("Prompt"), { target: { value: "Story next" } });
    expect(within(screen.getByLabelText("Tokenized prompt")).getByText("▁story")).toBeInTheDocument();
    expect(within(screen.getByLabelText("Tokenized prompt")).getByText("▁next")).toBeInTheDocument();
  });

  it("supports guided phase playback, direct selection, keyboard stepping, and reset", () => {
    vi.useFakeTimers();
    render(<TransformerLab />);
    const lab = screen.getByRole("region", { name: "Interactive deterministic transformer lab" });

    fireEvent.click(screen.getByRole("button", { name: "Next lab phase" }));
    expect(lab).toHaveAttribute("data-phase", "initialize");

    fireEvent.keyDown(lab, { key: "ArrowRight" });
    expect(lab).toHaveAttribute("data-phase", "forward");

    fireEvent.click(screen.getByRole("button", { name: "Play lab animation" }));
    expect(screen.getByRole("button", { name: "Pause lab animation" })).toHaveAttribute("aria-pressed", "true");
    act(() => vi.advanceTimersByTime(1_700));
    expect(lab).toHaveAttribute("data-phase", "loss");

    fireEvent.click(screen.getByRole("button", { name: /Go to lab phase 7:/ }));
    expect(lab).toHaveAttribute("data-phase", "sample");

    fireEvent.click(screen.getByRole("button", { name: "Reset transformer lab" }));
    expect(lab).toHaveAttribute("data-phase", "tokenize");
  });

  it("recomputes model metrics from controls and marks reduced and compact states", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: query === "(max-width: 760px)",
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });

    render(<TransformerLab autoplay reducedMotion="always" />);
    const lab = screen.getByRole("region", { name: "Interactive deterministic transformer lab" });
    expect(lab).toHaveAttribute("data-layout", "compact");
    expect(lab).toHaveAttribute("data-motion", "reduced");
    expect(screen.getByRole("button", { name: "Play lab animation" })).toHaveAttribute("aria-pressed", "false");

    fireEvent.change(screen.getByLabelText("Decoder layers"), { target: { value: "6" } });
    expect(within(screen.getByLabelText("Illustrative transformer architecture metrics")).getByText("83.6K")).toBeInTheDocument();
  });
});

describe("LanguageModelWorkbench", () => {
  it("switches between the reusable inference trace and transformer lab", () => {
    render(<LanguageModelWorkbench />);
    const workbench = screen.getByRole("region", { name: "Language model learning workbench" });

    expect(workbench).toHaveAttribute("data-experience", "trace");
    expect(screen.getByRole("region", { name: "Interactive decoder-only language model visualization" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Transformer lab/i }));
    expect(workbench).toHaveAttribute("data-experience", "lab");
    expect(screen.getByRole("region", { name: "Interactive deterministic transformer lab" })).toBeInTheDocument();
  });
});
