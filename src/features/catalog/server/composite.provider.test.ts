import { describe, expect, it, vi } from "vitest";

import { CompositeProvider } from "./composite.provider";
import type { MusicProvider } from "./music-provider";

vi.mock("server-only", () => ({}));

const track = {
  id: "one",
  provider: "test",
  source: "Test",
  title: "Same Song",
  artists: ["Artist"],
  album: "Album",
  audioUrl: "https://example.com/song.mp3",
  durationSec: 120.4,
  license: "Test license",
};

const provider = (
  searchTracks: MusicProvider["searchTracks"],
): MusicProvider => ({
  searchTracks,
  getTrack: async () => null,
  getAlbum: async () => null,
  getArtist: async () => null,
  getFeatured: async () => [],
});

describe("CompositeProvider", () => {
  it("deduplicates normalized title, artist, and duration across providers", async () => {
    const composite = new CompositeProvider([
      provider(async () => ({ items: [track] })),
      provider(async () => ({
        items: [{ ...track, id: "two", title: " same song " }],
      })),
    ]);

    const result = await composite.searchTracks("song", { limit: 10 });

    expect(result.items).toHaveLength(1);
  });

  it("returns successful provider results when another provider fails", async () => {
    const composite = new CompositeProvider([
      provider(async () => {
        throw new Error("provider unavailable");
      }),
      provider(async () => ({ items: [track] })),
    ]);

    await expect(
      composite.searchTracks("song", { limit: 10 }),
    ).resolves.toMatchObject({ items: [track] });
  });
});
