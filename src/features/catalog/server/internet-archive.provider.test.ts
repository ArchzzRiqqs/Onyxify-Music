import { beforeEach, describe, expect, it, vi } from "vitest";

import { InternetArchiveProvider } from "./internet-archive.provider";

vi.mock("server-only", () => ({}));

describe("InternetArchiveProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("maps an audio metadata response to a domain track", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              metadata: {
                identifier: "collection-1",
                title: "Malam Neon",
                creator: "Nara",
                license: "CC BY 4.0",
              },
              files: [{ name: "malam-neon.mp3", format: "VBR MP3" }],
            }),
          ),
      ),
    );

    const track = await new InternetArchiveProvider().getTrack("collection-1");

    expect(track).toMatchObject({
      id: "archive:collection-1",
      provider: "archive",
      source: "Internet Archive",
      license: "CC BY 4.0",
    });
  });
});
