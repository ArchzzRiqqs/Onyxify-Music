import "server-only";

import { TrackSchema, type Track } from "@/features/player";
import { env } from "@/lib/env";
import { z } from "zod";

import { MusicProvider, type FeaturedSection } from "./music-provider";
import { ProviderError } from "./provider-error";
import type {
  Album,
  AlbumWithTracks,
  ArtistWithTopTracks,
  Page,
} from "./types";

const jamendoTrackSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  artist_name: z.string(),
  album_name: z.string().optional().default("Single"),
  album_image: z.string().url().optional(),
  audio: z.string().url(),
  duration: z.number().nonnegative().optional().default(0),
  license_ccurl: z.string().url().optional(),
});

const jamendoAlbumSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  artist_name: z.string(),
  image: z.string().url().optional(),
  license_ccurl: z.string().url().optional(),
  tracks: z.array(jamendoTrackSchema).optional().default([]),
});

const jamendoArtistSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  image: z.string().url().optional(),
});

const jamendoResponseSchema = <T extends z.ZodType>(result: T) =>
  z.object({
    results: z.array(result),
    headers: z.object({ results_count: z.number().optional() }).optional(),
  });

type JamendoTrack = z.infer<typeof jamendoTrackSchema>;

const mapTrack = (track: JamendoTrack): Track =>
  TrackSchema.parse({
    id: String(track.id),
    provider: "jamendo",
    title: track.name,
    artists: [track.artist_name],
    album: track.album_name,
    coverUrl: track.album_image,
    audioUrl: track.audio,
    durationSec: track.duration,
    license: track.license_ccurl ?? "Creative Commons",
  });

const mapAlbum = (
  album: z.infer<typeof jamendoAlbumSchema>,
): AlbumWithTracks => ({
  id: String(album.id),
  title: album.name,
  artist: album.artist_name,
  coverUrl: album.image,
  license: album.license_ccurl ?? "Creative Commons",
  tracks: album.tracks.map(mapTrack),
});

export class JamendoProvider implements MusicProvider {
  private readonly baseUrl = "https://api.jamendo.com/v3.0";

  async searchTracks(
    q: string,
    opts: { limit: number; cursor?: string },
  ): Promise<Page<Track>> {
    const parsedCursor = opts.cursor ? Number.parseInt(opts.cursor, 10) : 0;
    const offset = Number.isNaN(parsedCursor) ? 0 : parsedCursor;
    const response = await this.request(
      "/tracks/",
      {
        namesearch: q,
        limit: String(opts.limit),
        offset: String(offset),
        audioformat: "mp32",
      },
      jamendoResponseSchema(jamendoTrackSchema),
      60,
    );
    const items = response.results.map(mapTrack);
    return {
      items,
      ...(items.length === opts.limit
        ? { nextCursor: String(offset + items.length) }
        : {}),
    };
  }

  async getTrack(id: string) {
    const response = await this.request(
      "/tracks/",
      { id, audioformat: "mp32" },
      jamendoResponseSchema(jamendoTrackSchema),
      3600,
    );
    return response.results[0] ? mapTrack(response.results[0]) : null;
  }

  async getAlbum(id: string) {
    const response = await this.request(
      "/albums/",
      { id, include: "music" },
      jamendoResponseSchema(jamendoAlbumSchema),
      3600,
    );
    return response.results[0] ? mapAlbum(response.results[0]) : null;
  }

  async getArtist(id: string): Promise<ArtistWithTopTracks | null> {
    const response = await this.request(
      "/artists/",
      { id },
      jamendoResponseSchema(jamendoArtistSchema),
      3600,
    );
    const artist = response.results[0];
    if (!artist) {
      return null;
    }
    const tracks = await this.request(
      "/tracks/",
      { artist_id: id, limit: "10", audioformat: "mp32" },
      jamendoResponseSchema(jamendoTrackSchema),
      3600,
    );
    return {
      id: String(artist.id),
      name: artist.name,
      imageUrl: artist.image,
      license: "Creative Commons",
      topTracks: tracks.results.map(mapTrack),
    };
  }

  async getFeatured(): Promise<FeaturedSection[]> {
    const response = await this.request(
      "/albums/",
      { featured: "1", limit: "12" },
      jamendoResponseSchema(jamendoAlbumSchema),
      3600,
    );
    const items: Album[] = response.results.map((album) => ({
      id: String(album.id),
      title: album.name,
      artist: album.artist_name,
      coverUrl: album.image,
      license: album.license_ccurl ?? "Creative Commons",
    }));
    return [{ title: "Featured", items }];
  }

  private async request<T extends z.ZodType>(
    path: string,
    params: Record<string, string>,
    schema: T,
    revalidate: number,
  ): Promise<z.infer<T>> {
    const url = new URL(`${this.baseUrl}${path}`);
    url.searchParams.set("client_id", env.JAMENDO_CLIENT_ID);
    url.searchParams.set("format", "json");
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    let lastError: unknown;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          next: { revalidate },
        });
        if (response.status >= 500 && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          continue;
        }
        if (!response.ok) {
          throw new ProviderError(
            "http",
            `Jamendo returned HTTP ${response.status}`,
          );
        }
        const json: unknown = await response.json();
        return schema.parse(json);
      } catch (error) {
        lastError = error;
        if (error instanceof ProviderError) {
          throw error;
        }
        if (error instanceof z.ZodError) {
          throw new ProviderError(
            "invalid_response",
            "Jamendo response did not match the expected format",
            502,
            { cause: error },
          );
        }
        if (error instanceof DOMException && error.name === "AbortError") {
          throw new ProviderError("timeout", "Jamendo request timed out", 504, {
            cause: error,
          });
        }
      } finally {
        clearTimeout(timeout);
      }
    }
    throw new ProviderError("unknown", "Jamendo request failed", 502, {
      cause: lastError,
    });
  }
}
