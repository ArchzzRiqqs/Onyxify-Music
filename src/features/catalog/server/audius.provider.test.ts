import { beforeEach, describe, expect, it, vi } from "vitest";

import { AudiusProvider } from "./audius.provider";

vi.mock("server-only", () => ({}));

describe("AudiusProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("maps a validated Audius response to a domain track", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              data: [
                {
                  id: "42",
                  title: "Cahaya Kota",
                  duration: 180,
                  user: { name: "Nara" },
                  artwork: { "150x150": "https://example.com/cover.jpg" },
                },
              ],
            }),
          ),
      ),
    );

    const result = await new AudiusProvider().searchTracks("cahaya", {
      limit: 10,
    });

    expect(result.items[0]).toMatchObject({
      id: "audius:42",
      provider: "audius",
      source: "Audius",
      license: "Audius platform license",
    });
  });
});
