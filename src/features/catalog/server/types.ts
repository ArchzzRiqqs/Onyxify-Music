import type { Track } from "@/features/player";

export type Page<T> = {
  items: T[];
  nextCursor?: string;
};

export type Album = {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  license: string;
};

export type Playlist = {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  license: string;
};

export type AlbumWithTracks = Album & {
  tracks: Track[];
};

export type Artist = {
  id: string;
  name: string;
  imageUrl?: string;
  license: string;
};

export type ArtistWithTopTracks = Artist & {
  topTracks: Track[];
};
