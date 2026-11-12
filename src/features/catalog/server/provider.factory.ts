import "server-only";

import { env } from "@/lib/env";

import { JamendoProvider } from "./jamendo.provider";
import type { MusicProvider } from "./music-provider";
import { LocalFixturesProvider } from "./local-fixtures.provider";

export function getMusicProvider(): MusicProvider {
  return env.MUSIC_PROVIDER === "jamendo"
    ? new JamendoProvider()
    : new LocalFixturesProvider();
}
