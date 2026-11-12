import { beforeEach, describe, expect, it, vi } from "vitest";

import { JamendoProvider } from "./jamendo.provider";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/env", () => ({
  env: {
    JAMENDO_CLIENT_ID: "test-client",
  },
}));

describe("JamendoProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("maps a validated Jamendo track response to the domain track", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              results: [
                {
                  id: 42,
                  name: "Cahaya Kota",
                  artist_name: "Nara",
                  album_name: "Malam Neon",
                  audio: "https://example.com/audio.mp3",
                  duration: 180,
                  license_ccurl: "https://creativecommons.org/licenses/by/4.0/",
                },
              ],
            }),
          ),
      ),
    );

    const track = await new JamendoProvider().getTrack("42");

    expect(track).toMatchObject({
      id: "42",
      title: "Cahaya Kota",
      artists: ["Nara"],
      license: "https://creativecommons.org/licenses/by/4.0/",
    });
  });

  it("returns a controlled invalid response error for malformed JSON shape", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ results: [{ id: 1 }] }))),
    );

    await expect(new JamendoProvider().getTrack("1")).rejects.toMatchObject({
      code: "invalid_response",
      status: 502,
    });
  });
});
