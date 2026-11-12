import "server-only";

import type { Track } from "@/features/player";

import type { FeaturedSection, MusicProvider } from "./music-provider";
import type { AlbumWithTracks, ArtistWithTopTracks, Page } from "./types";

const tracks: Track[] = [
  {
    id: "fixture-cahaya-kota",
    title: "Cahaya Kota",
    artists: ["Nara"],
    album: "Malam Neon",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    durationSec: 180,
    license: "Pixabay Content License",
  },
  {
    id: "fixture-langit-biru",
    title: "Langit Biru",
    artists: ["Ruang Senja"],
    album: "Malam Neon",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/25/audio_946f7c7c34.mp3",
    durationSec: 180,
    license: "Pixabay Content License",
  },
];

export class LocalFixturesProvider implements MusicProvider {
  async searchTracks(
    q: string,
    opts: { limit: number; cursor?: string },
  ): Promise<Page<Track>> {
    const query = q.toLocaleLowerCase();
    const offset = Number.parseInt(opts.cursor ?? "0", 10) || 0;
    const items = tracks
      .filter(
        (track) =>
          track.title.toLocaleLowerCase().includes(query) ||
          track.artists.some((artist) =>
            artist.toLocaleLowerCase().includes(query),
          ),
      )
      .slice(offset, offset + opts.limit);
    return {
      items,
      ...(offset + items.length < tracks.length
        ? { nextCursor: String(offset + items.length) }
        : {}),
    };
  }

  async getTrack(id: string) {
    return tracks.find((track) => track.id === id) ?? null;
  }

  async getAlbum(id: string): Promise<AlbumWithTracks | null> {
    if (id !== "fixture-malam-neon") {
      return null;
    }
    return {
      id,
      title: "Malam Neon",
      artist: "Onyxify Sessions",
      license: "Pixabay Content License",
      tracks,
    };
  }

  async getArtist(id: string): Promise<ArtistWithTopTracks | null> {
    if (id !== "fixture-onyxify-sessions") {
      return null;
    }
    return {
      id,
      name: "Onyxify Sessions",
      license: "Pixabay Content License",
      topTracks: tracks,
    };
  }

  async getFeatured(): Promise<FeaturedSection[]> {
    return [
      {
        title: "Featured",
        items: [
          {
            id: "fixture-malam-neon",
            title: "Malam Neon",
            artist: "Onyxify Sessions",
            license: "Pixabay Content License",
          },
        ],
      },
    ];
  }
}
