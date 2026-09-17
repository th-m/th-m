import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AudioPlayer } from "./audio-player";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
    Object.defineProperty(this, "paused", { configurable: true, value: false });
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (this: HTMLMediaElement) {
    Object.defineProperty(this, "paused", { configurable: true, value: true });
    this.dispatchEvent(new Event("pause"));
  });
});

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("AudioPlayer", () => {
  it("starts on demand at the cue, exposes native controls, and pauses/resumes", async () => {
    render(<AudioPlayer src="/recording.mp3" label="Titanic audio" startAt={6826} />);
    const audio = screen.getByLabelText("Titanic audio") as HTMLAudioElement;
    expect(audio).toHaveAttribute("preload", "none");
    expect(audio).not.toBeVisible();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Play Titanic audio" }));
    expect(audio).toBeVisible();
    expect(audio).toHaveAttribute("controls");
    Object.defineProperty(audio, "duration", { value: 9700 });
    fireEvent.loadedMetadata(audio);
    expect(audio.currentTime).toBe(6826);
    fireEvent.click(screen.getByRole("button", { name: "Pause Titanic audio" }));
    expect(audio.paused).toBe(true);
    audio.currentTime = 7000;
    fireEvent.click(screen.getByRole("button", { name: "Play Titanic audio" }));
    fireEvent.loadedMetadata(audio);
    expect(audio.currentTime).toBe(7000);
    fireEvent.ended(audio);
    expect(screen.getByRole("button", { name: "Play Titanic audio" })).toHaveAttribute("aria-pressed", "false");
  });

  it("pauses the previous player when another starts and stops on unmount", () => {
    const { unmount } = render(<><AudioPlayer src="/one.mp3" label="One" /><AudioPlayer src="/two.mp3" label="Two" /></>);
    const one = screen.getByLabelText("One") as HTMLAudioElement;
    const two = screen.getByLabelText("Two") as HTMLAudioElement;
    fireEvent.click(screen.getByRole("button", { name: "Play One" }));
    fireEvent.click(screen.getByRole("button", { name: "Play Two" }));
    expect(one.paused).toBe(true);
    expect(two.paused).toBe(false);
    expect(screen.getByRole("button", { name: "Play One" })).toHaveAttribute("aria-pressed", "false");
    unmount();
    expect(two.paused).toBe(true);
  });

  it("provides recovery controls if playback fails", async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(new Error("Failed to play"));
    render(<AudioPlayer src="/failed.mp3" label="Failed audio" />);
    fireEvent.click(screen.getByRole("button", { name: "Play Failed audio" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Audio could not play"));
    expect(screen.getByRole("link", { name: "open the recording" })).toHaveAttribute("href", "/failed.mp3");
    expect(screen.getByLabelText("Failed audio")).toBeVisible();
  });

  it("does not report a failure when switching recordings interrupts buffering", async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(new DOMException("Playback interrupted", "AbortError"));
    render(<AudioPlayer src="/buffering.mp3" label="Buffering audio" />);
    fireEvent.click(screen.getByRole("button", { name: "Play Buffering audio" }));
    await waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce());
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
