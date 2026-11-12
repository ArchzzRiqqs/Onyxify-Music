import "server-only";

import { TrackSchema, type Track } from "@/features/player";
import { z } from "zod";

import { MusicProvider, type FeaturedSection } from "./music-provider";
import { ProviderError } from "./provider-error";
import type { AlbumWithTracks, ArtistWithTopTracks, Page } from "./types";

const audiusTrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.number().nonnegative(),
  user: z.object({ name: z.string() }),
  artwork: z
    .object({ "150x150": z.string().url().optional() })
    .passthrough()
    .optional(),
});

const audiusResponseSchema = z.object({
  data: z.array(audiusTrackSchema),
});

type AudiusTrack = z.infer<typeof audiusTrackSchema>;

const mapTrack = (track: AudiusTrack): Track =>
  TrackSchema.parse({
    id: `audius:${track.id}`,
    provider: "audius",
    source: "Audius",
    title: track.title,
    artists: [track.user.name],
    album: "Audius",
    coverUrl: track.artwork?.["150x150"],
    audioUrl: `https://discoveryprovider.audius.co/v1/tracks/${encodeURIComponent(track.id)}/stream`,
    durationSec: track.duration,
    license: "Audius platform license",
  });

export class AudiusProvider implements MusicProvider {
  private readonly baseUrl = "https://discoveryprovider.audius.co/v1";

  async searchTracks(
    q: string,
    opts: { limit: number; cursor?: string },
  ): Promise<Page<Track>> {
    const offset = Number.parseInt(opts.cursor ?? "0", 10) || 0;
    const response = await this.request(
      "/tracks/search",
      { query: q, limit: String(opts.limit), offset: String(offset) },
      audiusResponseSchema,
    );
    const items = response.data.map(mapTrack);
    return {
      items,
      ...(items.length === opts.limit
        ? { nextCursor: String(offset + items.length) }
        : {}),
    };
  }

  async getTrack(id: string) {
    const externalId = id.replace(/^audius:/, "");
    const response = await this.request(
      `/tracks/${encodeURIComponent(externalId)}`,
      {},
      z.object({ data: audiusTrackSchema }),
    );
    return mapTrack(response.data);
  }

  async getAlbum(): Promise<AlbumWithTracks | null> {
    return null;
  }

  async getArtist(): Promise<ArtistWithTopTracks | null> {
    return null;
  }

  async getFeatured(): Promise<FeaturedSection[]> {
    return [];
  }

  private async request<T extends z.ZodType>(
    path: string,
    params: Record<string, string>,
    schema: T,
  ): Promise<z.infer<T>> {
    const url = new URL(`${this.baseUrl}${path}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    let lastError: unknown;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (response.status >= 500 && attempt === 0) {
          continue;
        }
        if (!response.ok) {
          throw new ProviderError(
            "http",
            `Audius returned HTTP ${response.status}`,
          );
        }
        return schema.parse((await response.json()) as unknown);
      } catch (error) {
        lastError = error;
        if (error instanceof ProviderError) throw error;
        if (error instanceof z.ZodError) {
          throw new ProviderError(
            "invalid_response",
            "Audius response is invalid",
            502,
            {
              cause: error,
            },
          );
        }
        if (error instanceof DOMException && error.name === "AbortError") {
          throw new ProviderError("timeout", "Audius request timed out", 504, {
            cause: error,
          });
        }
      } finally {
        clearTimeout(timeout);
      }
    }
    throw new ProviderError("unknown", "Audius request failed", 502, {
      cause: lastError,
    });
  }
}
