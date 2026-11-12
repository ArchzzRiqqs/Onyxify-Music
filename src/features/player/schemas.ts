import { z } from "zod";

export const TrackSchema = z.object({
  id: z.string().trim().min(1),
  provider: z.string().trim().min(1),
  source: z.string().trim().min(1),
  title: z.string().trim().min(1),
  artists: z.array(z.string().trim().min(1)).min(1),
  album: z.string().trim().min(1),
  coverUrl: z.string().trim().url().optional(),
  audioUrl: z.string().trim().url(),
  durationSec: z.number().finite().nonnegative(),
  license: z.string().trim().min(1),
});

export const RepeatModeSchema = z.enum(["off", "one", "all"]);

export type Track = z.infer<typeof TrackSchema>;
export type RepeatMode = z.infer<typeof RepeatModeSchema>;
