import type { PrismaClient } from "@prisma/client";

import type { TrackSnapshotInput } from "./schemas";

export function createLibraryRepository(db: PrismaClient) {
  return {
    createPlaylist: (
      ownerId: string,
      input: { name: string; description?: string; isPublic: boolean },
    ) => db.playlist.create({ data: { ownerId, ...input } }),
    findPlaylist: (id: string, viewerId?: string) =>
      db.playlist.findUnique({
        where: {
          id,
          OR: [
            { isPublic: true },
            ...(viewerId ? [{ ownerId: viewerId }] : []),
          ],
        },
        include: { tracks: { orderBy: { position: "asc" } } },
      }),
    listPlaylists: (ownerId: string, take: number, cursor?: string) =>
      db.playlist.findMany({
        where: { ownerId },
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        take: take + 1,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      }),
    renamePlaylist: (id: string, name: string) =>
      db.playlist.update({ where: { id }, data: { name } }),
    deletePlaylist: (id: string) => db.playlist.delete({ where: { id } }),
    addTrack: async (playlistId: string, track: TrackSnapshotInput) => {
      const last = await db.playlistTrack.findFirst({
        where: { playlistId },
        orderBy: { position: "desc" },
        select: { position: true },
      });
      return db.playlistTrack.create({
        data: {
          playlistId,
          position: (last?.position ?? -1) + 1,
          ...track,
          artists: track.artists.join(", "),
        },
      });
    },
    removeTrack: (id: string) => db.playlistTrack.delete({ where: { id } }),
    reorderTracks: (playlistId: string, trackIds: string[]) =>
      db
        .$transaction(
          trackIds.map((id, position) =>
            db.playlistTrack.updateMany({
              where: { id, playlistId },
              data: { position: -(position + 1) },
            }),
          ),
        )
        .then(() =>
          db.$transaction(
            trackIds.map((id, position) =>
              db.playlistTrack.updateMany({
                where: { id, playlistId },
                data: { position },
              }),
            ),
          ),
        ),
    findLiked: (userId: string, take: number, cursor?: string) =>
      db.likedTrack.findMany({
        where: { userId },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: take + 1,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      }),
    findRecentlyPlayed: (userId: string, take: number, cursor?: string) =>
      db.recentlyPlayed.findMany({
        where: { userId },
        orderBy: [{ playedAt: "desc" }, { id: "desc" }],
        take: take + 1,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      }),
    recordPlay: (userId: string, track: TrackSnapshotInput) =>
      db.recentlyPlayed.create({
        data: { userId, ...track, artists: track.artists.join(", ") },
      }),
    toggleLike: async (userId: string, track: TrackSnapshotInput) => {
      const existing = await db.likedTrack.findUnique({
        where: {
          userId_provider_externalId: {
            userId,
            provider: track.provider,
            externalId: track.externalId,
          },
        },
      });
      if (existing) {
        await db.likedTrack.delete({ where: { id: existing.id } });
        return false;
      }
      await db.likedTrack.create({
        data: { userId, ...track, artists: track.artists.join(", ") },
      });
      return true;
    },
  };
}

export type LibraryRepository = ReturnType<typeof createLibraryRepository>;
