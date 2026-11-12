import type { Track } from "@/features/player";

import type {
  Album,
  AlbumWithTracks,
  ArtistWithTopTracks,
  Page,
  Playlist,
} from "./types";

export type FeaturedSection = {
  title: string;
  items: (Album | Playlist)[];
};

export interface MusicProvider {
  searchTracks(
    q: string,
    opts: { limit: number; cursor?: string },
  ): Promise<Page<Track>>;
  getTrack(id: string): Promise<Track | null>;
  getAlbum(id: string): Promise<AlbumWithTracks | null>;
  getArtist(id: string): Promise<ArtistWithTopTracks | null>;
  getFeatured(): Promise<FeaturedSection[]>;
}
