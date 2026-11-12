import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().trim().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().trim().min(1, "AUTH_SECRET is required"),
  JAMENDO_CLIENT_ID: z.string().trim().min(1, "JAMENDO_CLIENT_ID is required"),
  MUSIC_PROVIDER: z.enum(["jamendo", "fixtures"]).default("fixtures"),
  NEXT_PUBLIC_APP_URL: z.url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  GOOGLE_CLIENT_ID: z.string().trim().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().trim().min(1).optional(),
});
