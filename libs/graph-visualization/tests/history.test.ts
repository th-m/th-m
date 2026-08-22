import { describe, expect, it } from "vitest";
import {
  commitHistory,
  createHistory,
  redoHistory,
  undoHistory,
} from "../src/history";

describe("graph history", () => {
  it("undoes and redoes authoring changes", () => {
    let history = createHistory(0);
    history = commitHistory(history, 1);
    history = commitHistory(history, 2);

    history = undoHistory(history);
    expect(history.present).toBe(1);
    expect(history.future).toEqual([2]);

    history = redoHistory(history);
    expect(history.present).toBe(2);
  });

  it("retains only the last 100 changes", () => {
    let history = createHistory(0);
    for (let value = 1; value <= 125; value += 1) history = commitHistory(history, value);
    expect(history.past).toHaveLength(100);
    expect(history.past[0]).toBe(25);
  });
});
