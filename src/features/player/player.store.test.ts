import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePlayerStore } from "./player.store";
import type { Track } from "./schemas";

const tracks: Track[] = [
  {
    id: "one",
    provider: "test",
    title: "One",
    artists: ["Artist"],
    album: "Album",
    audioUrl: "https://example.com/one.mp3",
    durationSec: 100,
    license: "Test",
  },
  {
    id: "two",
    provider: "test",
    title: "Two",
    artists: ["Artist"],
    album: "Album",
    audioUrl: "https://example.com/two.mp3",
    durationSec: 120,
    license: "Test",
  },
  {
    id: "three",
    provider: "test",
    title: "Three",
    artists: ["Artist"],
    album: "Album",
    audioUrl: "https://example.com/three.mp3",
    durationSec: 140,
    license: "Test",
  },
];

beforeEach(() => {
  usePlayerStore.getState().clear();
  usePlayerStore.setState({
    shuffle: false,
    repeat: "off",
    position: 0,
    volume: 0.7,
    muted: false,
  });
  vi.restoreAllMocks();
});

describe("player store", () => {
  it("moves to the next track and stops at the end when repeat is off", () => {
    usePlayerStore.getState().playTrack(tracks[0]!, tracks);

    usePlayerStore.getState().next();
    expect(usePlayerStore.getState().queue[1]?.id).toBe("two");

    usePlayerStore.getState().next();
    usePlayerStore.getState().next();
    expect(usePlayerStore.getState().currentIndex).toBe(2);
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it("repeats the current track when repeat one is enabled", () => {
    usePlayerStore.getState().playTrack(tracks[0]!, tracks);
    usePlayerStore.setState({ repeat: "one" });

    usePlayerStore.getState().next();

    expect(usePlayerStore.getState().currentIndex).toBe(0);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().position).toBe(0);
  });

  it("loops to the first track when repeat all is enabled", () => {
    usePlayerStore.getState().playTrack(tracks[2]!, tracks);
    usePlayerStore.setState({ repeat: "all" });

    usePlayerStore.getState().next();

    expect(usePlayerStore.getState().currentIndex).toBe(0);
  });

  it("restarts the current track when previous is pressed after three seconds", () => {
    usePlayerStore.getState().playTrack(tracks[1]!, tracks);
    usePlayerStore.setState({ currentIndex: 1, position: 4 });

    usePlayerStore.getState().prev();

    expect(usePlayerStore.getState().currentIndex).toBe(1);
    expect(usePlayerStore.getState().position).toBe(0);
  });

  it("shuffles while keeping the active track first", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    usePlayerStore.getState().playTrack(tracks[1]!, tracks);
    usePlayerStore.setState({ currentIndex: 1 });

    usePlayerStore.getState().toggleShuffle();

    expect(usePlayerStore.getState().queue[0]?.id).toBe("two");
    expect(
      new Set(usePlayerStore.getState().queue.map((track) => track.id)).size,
    ).toBe(3);
  });

  it("enqueues, inserts next, and reorders tracks", () => {
    usePlayerStore.getState().playTrack(tracks[0]!);
    usePlayerStore.getState().enqueue(tracks[1]!);
    usePlayerStore.getState().playNext(tracks[2]!);

    expect(usePlayerStore.getState().queue.map((track) => track.id)).toEqual([
      "one",
      "three",
      "two",
    ]);

    usePlayerStore.getState().reorderQueue(2, 1);
    expect(usePlayerStore.getState().queue.map((track) => track.id)).toEqual([
      "one",
      "two",
      "three",
    ]);
  });

  it("clamps seek to the track duration", () => {
    usePlayerStore.getState().playTrack(tracks[0]!);

    usePlayerStore.getState().seek(999);

    expect(usePlayerStore.getState().position).toBe(100);
  });

  it("keeps the active track when clearing the upcoming queue", () => {
    usePlayerStore.getState().playTrack(tracks[0]!, tracks);

    usePlayerStore.getState().clearQueue();

    expect(usePlayerStore.getState().queue.map((track) => track.id)).toEqual([
      "one",
    ]);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  });

  it("stores a deadline for a timed sleep timer", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000);

    usePlayerStore.getState().setSleepTimer(5);

    expect(usePlayerStore.getState().sleepTimerEndAt).toBe(301_000);
  });
});
