import "server-only";

import type { Track } from "@/features/player";

import type { FeaturedSection, MusicProvider } from "./music-provider";
import type { AlbumWithTracks, ArtistWithTopTracks, Page } from "./types";

function dedupeTracks(tracks: Track[]) {
  const seen = new Set<string>();
  return tracks.filter((track) => {
    const key = [
      track.title.trim().toLocaleLowerCase(),
      track.artists.join(",").trim().toLocaleLowerCase(),
      Math.round(track.durationSec),
    ].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export class CompositeProvider implements MusicProvider {
  constructor(private readonly providers: MusicProvider[]) {}

  async searchTracks(
    q: string,
    opts: { limit: number; cursor?: string },
  ): Promise<Page<Track>> {
    const results = await Promise.allSettled(
      this.providers.map((provider) => provider.searchTracks(q, opts)),
    );
    const items = results.flatMap((result) =>
      result.status === "fulfilled" ? result.value.items : [],
    );
    return { items: dedupeTracks(items).slice(0, opts.limit) };
  }

  async getTrack(id: string) {
    const results = await Promise.allSettled(
      this.providers.map((provider) => provider.getTrack(id)),
    );
    return (
      results.find(
        (result): result is PromiseFulfilledResult<Track | null> =>
          result.status === "fulfilled" && result.value !== null,
      )?.value ?? null
    );
  }

  async getAlbum(id: string): Promise<AlbumWithTracks | null> {
    const results = await Promise.allSettled(
      this.providers.map((provider) => provider.getAlbum(id)),
    );
    return (
      results.find(
        (result): result is PromiseFulfilledResult<AlbumWithTracks | null> =>
          result.status === "fulfilled" && result.value !== null,
      )?.value ?? null
    );
  }

  async getArtist(id: string): Promise<ArtistWithTopTracks | null> {
    const results = await Promise.allSettled(
      this.providers.map((provider) => provider.getArtist(id)),
    );
    return (
      results.find(
        (
          result,
        ): result is PromiseFulfilledResult<ArtistWithTopTracks | null> =>
          result.status === "fulfilled" && result.value !== null,
      )?.value ?? null
    );
  }

  async getFeatured(): Promise<FeaturedSection[]> {
    const results = await Promise.allSettled(
      this.providers.map((provider) => provider.getFeatured()),
    );
    return results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : [],
    );
  }
}

export { dedupeTracks };
