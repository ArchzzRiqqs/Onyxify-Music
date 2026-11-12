import { Prisma, type PrismaClient } from "@prisma/client";

import type { TrackSnapshotInput } from "./schemas";

export function createLibraryRepository(db: PrismaClient) {
  const withSerializableRetry = async <T>(
    operation: (transaction: Prisma.TransactionClient) => Promise<T>,
  ) => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await db.$transaction(operation, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
      } catch (error) {
        const retryable =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          (error.code === "P2034" || error.code === "P2002");
        if (!retryable || attempt === 2) throw error;
      }
    }
    throw new Error("Transaction retry limit exceeded");
  };

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
    addTrack: (playlistId: string, track: TrackSnapshotInput) =>
      withSerializableRetry(async (transaction) => {
        const last = await transaction.playlistTrack.findFirst({
          where: { playlistId },
          orderBy: { position: "desc" },
          select: { position: true },
        });
        return transaction.playlistTrack.create({
          data: {
            playlistId,
            position: (last?.position ?? -1) + 1,
            ...track,
            artists: track.artists.join(", "),
          },
        });
      }),
    removeTrack: (id: string) => db.playlistTrack.delete({ where: { id } }),
    reorderTracks: (playlistId: string, trackIds: string[]) =>
      withSerializableRetry(async (transaction) => {
        for (const [position, id] of trackIds.entries()) {
          await transaction.playlistTrack.updateMany({
            where: { id, playlistId },
            data: { position: -(position + 1) },
          });
        }
        for (const [position, id] of trackIds.entries()) {
          await transaction.playlistTrack.updateMany({
            where: { id, playlistId },
            data: { position },
          });
        }
      }),
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
      return withSerializableRetry(async (transaction) => {
        const existing = await transaction.likedTrack.findUnique({
          where: {
            userId_provider_externalId: {
              userId,
              provider: track.provider,
              externalId: track.externalId,
            },
          },
        });
        if (existing) {
          await transaction.likedTrack.delete({ where: { id: existing.id } });
          return false;
        }
        await transaction.likedTrack.create({
          data: { userId, ...track, artists: track.artists.join(", ") },
        });
        return true;
      });
    },
  };
}

export type LibraryRepository = ReturnType<typeof createLibraryRepository>;
