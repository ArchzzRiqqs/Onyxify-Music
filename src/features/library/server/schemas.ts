import { z } from "zod";

export const trackSnapshotSchema = z.object({
  provider: z.string().trim().min(1).max(50),
  externalId: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  artists: z.array(z.string().trim().min(1).max(100)).min(1).max(10),
  coverUrl: z.string().url().optional(),
  durationSec: z.number().int().nonnegative().max(86400),
});

export const createPlaylistSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
  isPublic: z.boolean().default(false),
});

export const playlistIdSchema = z.object({
  id: z.string().trim().min(1).max(100),
});
export const renamePlaylistSchema = createPlaylistSchema.pick({ name: true });
export const reorderSchema = z.object({
  trackIds: z.array(z.string().trim().min(1)).min(0).max(500),
});
export const listSchema = z.object({
  cursor: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type TrackSnapshotInput = z.infer<typeof trackSnapshotSchema>;
