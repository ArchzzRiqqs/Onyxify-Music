import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: { NEXT_PUBLIC_APP_URL: "https://onyxify.example" },
}));

const provider = {
  getTrack: vi.fn(),
  getAlbum: vi.fn(),
  getArtist: vi.fn(),
};

vi.mock("@/features/catalog/server/provider.factory", () => ({
  getMusicProvider: () => provider,
}));

import { generateMetadata as generateAlbumMetadata } from "./(main)/album/[id]/page";
import { generateMetadata as generateArtistMetadata } from "./(main)/artist/[id]/page";
import { generateMetadata as generateTrackMetadata } from "./(main)/track/[id]/page";
import robots from "./robots";
import sitemap from "./sitemap";

describe("SEO metadata", () => {
  it("generates track title, canonical, and Open Graph metadata", async () => {
    provider.getTrack.mockResolvedValue({
      id: "track-1",
      title: "Cahaya Kota",
      artists: ["Nara"],
      source: "Jamendo",
      coverUrl: "https://cdn.example/cover.jpg",
    });

    const metadata = await generateTrackMetadata({
      params: Promise.resolve({ id: "track-1" }),
    });

    expect(metadata).toMatchObject({
      title: "Cahaya Kota — Nara",
      description: "Cahaya Kota oleh Nara. Sumber: Jamendo.",
      alternates: {
        canonical: new URL("https://onyxify.example/track/track-1"),
      },
      openGraph: {
        type: "music.song",
        title: "Cahaya Kota",
        images: ["https://cdn.example/cover.jpg"],
      },
    });
  });

  it("generates album metadata with canonical and cover image", async () => {
    provider.getAlbum.mockResolvedValue({
      id: "album-1",
      title: "Malam Neon",
      artist: "Nara",
      coverUrl: "https://cdn.example/album.jpg",
      tracks: [],
    });

    const metadata = await generateAlbumMetadata({
      params: Promise.resolve({ id: "album-1" }),
    });

    expect(metadata).toMatchObject({
      title: "Malam Neon — Nara",
      description: "Album Malam Neon oleh Nara.",
      alternates: {
        canonical: new URL("https://onyxify.example/album/album-1"),
      },
      openGraph: { images: ["https://cdn.example/album.jpg"] },
    });
  });

  it("generates artist metadata with canonical and image", async () => {
    provider.getArtist.mockResolvedValue({
      id: "artist-1",
      name: "Nara",
      imageUrl: "https://cdn.example/artist.jpg",
      topTracks: [],
    });

    const metadata = await generateArtistMetadata({
      params: Promise.resolve({ id: "artist-1" }),
    });

    expect(metadata).toMatchObject({
      title: "Nara",
      description: "Dengarkan lagu dari Nara di Onyxify.",
      alternates: {
        canonical: new URL("https://onyxify.example/artist/artist-1"),
      },
      openGraph: { images: ["https://cdn.example/artist.jpg"] },
    });
  });
});

describe("robots metadata", () => {
  it("allows public pages and disallows private and API routes", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    if (!rules) throw new Error("Robots rules are missing");
    const disallowed = Array.isArray(rules.disallow)
      ? rules.disallow
      : [rules.disallow];

    expect(rules.allow).toEqual([
      "/",
      "/search",
      "/track/",
      "/album/",
      "/artist/",
    ]);
    expect(disallowed).toEqual(
      expect.arrayContaining(["/api/", "/library", "/playlist/", "/login"]),
    );
    expect(result.sitemap).toBe("https://onyxify.example/sitemap.xml");
  });
});

describe("sitemap metadata", () => {
  it("includes the public home and search routes", () => {
    expect(sitemap()).toEqual([
      {
        url: "https://onyxify.example/",
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: "https://onyxify.example/search",
        changeFrequency: "weekly",
        priority: 0.7,
      },
    ]);
  });
});
