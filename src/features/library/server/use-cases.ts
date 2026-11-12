import { prisma } from "@/lib/db";

import type { LibraryRepository } from "./repository";
import { createLibraryRepository } from "./repository";
import type { TrackSnapshotInput } from "./schemas";

export class LibraryNotFoundError extends Error {
  constructor() {
    super("Library resource not found");
    this.name = "LibraryNotFoundError";
  }
}

const defaultRepository = () => createLibraryRepository(prisma);

async function ownedPlaylist(
  repo: LibraryRepository,
  id: string,
  ownerId: string,
) {
  const playlist = await repo.findPlaylist(id, ownerId);
  if (!playlist || playlist.ownerId !== ownerId)
    throw new LibraryNotFoundError();
  return playlist;
}

export async function createPlaylist(
  ownerId: string,
  input: Parameters<LibraryRepository["createPlaylist"]>[1],
  repo = defaultRepository(),
) {
  return repo.createPlaylist(ownerId, input);
}

export async function renamePlaylist(
  ownerId: string,
  id: string,
  name: string,
  repo = defaultRepository(),
) {
  await ownedPlaylist(repo, id, ownerId);
  return repo.renamePlaylist(id, name);
}

export async function deletePlaylist(
  ownerId: string,
  id: string,
  repo = defaultRepository(),
) {
  await ownedPlaylist(repo, id, ownerId);
  return repo.deletePlaylist(id);
}

export async function addTrackToPlaylist(
  ownerId: string,
  id: string,
  track: TrackSnapshotInput,
  repo = defaultRepository(),
) {
  const playlist = await ownedPlaylist(repo, id, ownerId);
  if (
    playlist.tracks.some(
      (item) =>
        item.provider === track.provider &&
        item.externalId === track.externalId,
    )
  ) {
    throw new Error("DUPLICATE_TRACK");
  }
  return repo.addTrack(id, { ...track });
}

export async function removeTrack(
  ownerId: string,
  id: string,
  trackId: string,
  repo = defaultRepository(),
) {
  const playlist = await ownedPlaylist(repo, id, ownerId);
  if (!playlist.tracks.some((track) => track.id === trackId))
    throw new LibraryNotFoundError();
  return repo.removeTrack(trackId);
}

export async function reorderTracks(
  ownerId: string,
  id: string,
  trackIds: string[],
  repo = defaultRepository(),
) {
  const playlist = await ownedPlaylist(repo, id, ownerId);
  const currentIds = new Set(playlist.tracks.map((track) => track.id));
  if (
    trackIds.length !== currentIds.size ||
    trackIds.some((trackId) => !currentIds.has(trackId))
  ) {
    throw new Error("INVALID_ORDER");
  }
  return repo.reorderTracks(id, trackIds);
}

export async function toggleLike(
  userId: string,
  track: TrackSnapshotInput,
  repo = defaultRepository(),
) {
  return repo.toggleLike(userId, track);
}

export async function listLiked(
  userId: string,
  take: number,
  cursor?: string,
  repo = defaultRepository(),
) {
  return repo.findLiked(userId, take, cursor);
}

export async function listRecentlyPlayed(
  userId: string,
  take: number,
  cursor?: string,
  repo = defaultRepository(),
) {
  return repo.findRecentlyPlayed(userId, take, cursor);
}

export async function recordPlay(
  userId: string,
  track: TrackSnapshotInput,
  repo = defaultRepository(),
) {
  return repo.recordPlay(userId, track);
}
