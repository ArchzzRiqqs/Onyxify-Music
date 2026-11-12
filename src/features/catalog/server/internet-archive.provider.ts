import "server-only";

import { TrackSchema, type Track } from "@/features/player";
import { z } from "zod";

import { MusicProvider, type FeaturedSection } from "./music-provider";
import { ProviderError } from "./provider-error";
import type { AlbumWithTracks, ArtistWithTopTracks, Page } from "./types";

const archiveSearchSchema = z.object({
  response: z.object({
    docs: z.array(
      z.object({
        identifier: z.string(),
      }),
    ),
  }),
});

const archiveMetadataSchema = z.object({
  metadata: z.object({
    identifier: z.string(),
    title: z.string().optional(),
    creator: z.union([z.string(), z.array(z.string())]).optional(),
    licenseurl: z.string().optional(),
    license: z.string().optional(),
  }),
  files: z.array(
    z.object({
      name: z.string(),
      format: z.string().optional(),
      size: z.union([z.string(), z.number()]).optional(),
    }),
  ),
});

type ArchiveMetadata = z.infer<typeof archiveMetadataSchema>;

function mapTrack(metadata: ArchiveMetadata): Track | null {
  const file = metadata.files.find(
    (item) =>
      item.format?.toLowerCase().includes("mp3") ||
      item.name.toLowerCase().endsWith(".mp3"),
  );
  if (!file) return null;
  const creator = metadata.metadata.creator;
  const artists = Array.isArray(creator)
    ? creator
    : creator
      ? [creator]
      : ["Internet Archive"];
  return TrackSchema.parse({
    id: `archive:${metadata.metadata.identifier}`,
    provider: "archive",
    source: "Internet Archive",
    title: metadata.metadata.title ?? metadata.metadata.identifier,
    artists,
    album: "Internet Archive",
    coverUrl: `https://archive.org/services/img/${encodeURIComponent(metadata.metadata.identifier)}`,
    audioUrl: `https://archive.org/download/${encodeURIComponent(metadata.metadata.identifier)}/${encodeURIComponent(file.name)}`,
    durationSec: 0,
    license:
      metadata.metadata.licenseurl ??
      metadata.metadata.license ??
      "Internet Archive item license",
  });
}

export class InternetArchiveProvider implements MusicProvider {
  private readonly baseUrl = "https://archive.org";

  async searchTracks(
    q: string,
    opts: { limit: number; cursor?: string },
  ): Promise<Page<Track>> {
    const page = Number.parseInt(opts.cursor ?? "1", 10) || 1;
    const response = await this.request(
      "/advancedsearch.php",
      {
        q: `mediatype:audio AND (${q})`,
        fl: ["identifier"].join(","),
        rows: String(opts.limit),
        page: String(page),
        output: "json",
      },
      archiveSearchSchema,
    );
    const results = await Promise.allSettled(
      response.response.docs.map((doc) => this.getMetadata(doc.identifier)),
    );
    const items = results.flatMap((result) => {
      if (result.status !== "fulfilled") return [];
      const track = mapTrack(result.value);
      return track ? [track] : [];
    });
    return {
      items,
      ...(response.response.docs.length === opts.limit
        ? { nextCursor: String(page + 1) }
        : {}),
    };
  }

  async getTrack(id: string) {
    return mapTrack(await this.getMetadata(id.replace(/^archive:/, "")));
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

  private async getMetadata(identifier: string) {
    return this.request(
      `/metadata/${encodeURIComponent(identifier)}`,
      {},
      archiveMetadataSchema,
    );
  }

  private async request<T extends z.ZodType>(
    path: string,
    params: Record<string, string>,
    schema: T,
  ): Promise<z.infer<T>> {
    const url = new URL(`${this.baseUrl}${path}`);
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
    let lastError: unknown;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (response.status >= 500 && attempt === 0) continue;
        if (!response.ok) {
          throw new ProviderError(
            "http",
            `Internet Archive returned HTTP ${response.status}`,
          );
        }
        return schema.parse((await response.json()) as unknown);
      } catch (error) {
        lastError = error;
        if (error instanceof ProviderError) throw error;
        if (error instanceof z.ZodError) {
          throw new ProviderError(
            "invalid_response",
            "Internet Archive response is invalid",
            502,
            { cause: error },
          );
        }
        if (error instanceof DOMException && error.name === "AbortError") {
          throw new ProviderError(
            "timeout",
            "Internet Archive request timed out",
            504,
            { cause: error },
          );
        }
      } finally {
        clearTimeout(timeout);
      }
    }
    throw new ProviderError("unknown", "Internet Archive request failed", 502, {
      cause: lastError,
    });
  }
}
