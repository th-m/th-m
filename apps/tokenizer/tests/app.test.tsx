import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";

describe("tokenizer app surface", () => {
  it("mounts the reusable visualization through its public API", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: /see what the model sees/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Text to tokenize" })).toBeInTheDocument();
  });
});
