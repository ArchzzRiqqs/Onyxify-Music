import "server-only";

import { env } from "@/lib/env";

import { JamendoProvider } from "./jamendo.provider";
import type { MusicProvider } from "./music-provider";
import { LocalFixturesProvider } from "./local-fixtures.provider";
import { AudiusProvider } from "./audius.provider";
import { InternetArchiveProvider } from "./internet-archive.provider";
import { CompositeProvider } from "./composite.provider";

export function getMusicProvider(): MusicProvider {
  const providers = env.MUSIC_PROVIDERS.map((provider) => {
    if (provider === "jamendo") return new JamendoProvider();
    if (provider === "audius") return new AudiusProvider();
    if (provider === "archive") return new InternetArchiveProvider();
    return new LocalFixturesProvider();
  });
  return new CompositeProvider(providers);
}
