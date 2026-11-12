import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ prisma: {} }));

import type { LibraryRepository } from "./repository";
import {
  LibraryNotFoundError,
  addTrackToPlaylist,
  reorderTracks,
} from "./use-cases";

const snapshot = {
  provider: "fixtures",
  externalId: "track-1",
  title: "Cahaya Kota",
  artists: ["Nara"],
  durationSec: 180,
};

function repository(playlist: {
  ownerId: string;
  tracks: Array<{ id: string; provider: string; externalId: string }>;
}): LibraryRepository {
  return {
    findPlaylist: vi.fn().mockResolvedValue(playlist),
    addTrack: vi.fn(),
    reorderTracks: vi.fn(),
    createPlaylist: vi.fn(),
    listPlaylists: vi.fn(),
    renamePlaylist: vi.fn(),
    deletePlaylist: vi.fn(),
    removeTrack: vi.fn(),
    findLiked: vi.fn(),
    toggleLike: vi.fn(),
    findRecentlyPlayed: vi.fn(),
    recordPlay: vi.fn(),
  };
}

describe("playlist use-cases", () => {
  it("rejects a playlist owned by another user", async () => {
    const repo = repository({ ownerId: "owner-2", tracks: [] });

    await expect(
      addTrackToPlaylist("owner-1", "playlist-1", snapshot, repo),
    ).rejects.toBeInstanceOf(LibraryNotFoundError);
  });

  it("rejects duplicate tracks in a playlist", async () => {
    const repo = repository({
      ownerId: "owner-1",
      tracks: [
        { id: "track-row-1", provider: "fixtures", externalId: "track-1" },
      ],
    });

    await expect(
      addTrackToPlaylist("owner-1", "playlist-1", snapshot, repo),
    ).rejects.toThrow("DUPLICATE_TRACK");
  });

  it("rejects reorder requests that omit tracks", async () => {
    const repo = repository({
      ownerId: "owner-1",
      tracks: [
        { id: "track-row-1", provider: "fixtures", externalId: "track-1" },
        { id: "track-row-2", provider: "fixtures", externalId: "track-2" },
      ],
    });

    await expect(
      reorderTracks("owner-1", "playlist-1", ["track-row-1"], repo),
    ).rejects.toThrow("INVALID_ORDER");
  });
});
