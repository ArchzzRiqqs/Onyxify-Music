import { afterEach, describe, expect, it, vi } from "vitest";

import { AudioEngine } from "./audio-engine";
import type { Track } from "./schemas";

const track: Track = {
  id: "test",
  provider: "test",
  title: "Test",
  artists: ["Artist"],
  album: "Album",
  audioUrl: "https://example.com/test.mp3",
  durationSec: 100,
  license: "Test",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("audio engine", () => {
  it("is safe to construct during SSR", () => {
    const engine = new AudioEngine();

    expect(() => engine.load(track)).not.toThrow();
  });

  it("loads tracks and forwards audio events to listeners", () => {
    const handlers = new Map<string, () => void>();
    const audio = {
      addEventListener: vi.fn((event: string, handler: () => void) =>
        handlers.set(event, handler),
      ),
      removeEventListener: vi.fn(),
      setAttribute: vi.fn(),
      style: {},
      preload: "",
      src: "",
      currentTime: 0,
      duration: 100,
      volume: 1,
      muted: false,
      load: vi.fn(),
      play: vi.fn(async () => undefined),
      pause: vi.fn(),
      removeAttribute: vi.fn(),
    } as unknown as HTMLAudioElement;
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", { createElement: vi.fn(() => audio) });

    const engine = new AudioEngine();
    const onTimeUpdate = vi.fn();
    engine.on("timeupdate", onTimeUpdate);
    engine.load(track);
    handlers.get("timeupdate")?.();
    engine.setVolume(2);
    engine.seek(200);

    expect(audio.src).toBe(track.audioUrl);
    expect(onTimeUpdate).toHaveBeenCalledOnce();
    expect(audio.volume).toBe(1);
    expect(audio.currentTime).toBe(100);
    engine.destroy();
    expect(audio.pause).toHaveBeenCalledOnce();
    expect(audio.removeEventListener).toHaveBeenCalled();
  });
});
