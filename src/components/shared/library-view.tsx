"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { PlaylistCard } from "./playlist-card";
import { id } from "@/lib/i18n/id";

type Playlist = {
  id: string;
  name: string;
  description: string | null;
  updatedAt: string;
};

export function LibraryView({ playlists }: { playlists: Playlist[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"playlists" | "albums" | "artists" | "liked">(
    "playlists",
  );
  const [sort, setSort] = useState<"newest" | "alphabetical">("newest");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const sorted = useMemo(
    () =>
      [...playlists].sort((a, b) =>
        sort === "alphabetical"
          ? a.name.localeCompare(b.name, "id")
          : b.updatedAt.localeCompare(a.updatedAt),
      ),
    [playlists, sort],
  );

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-semibold">{id.pages.libraryTitle}</h1>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {(["playlists", "albums", "artists", "liked"] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={`rounded-full px-4 py-2 text-sm ${tab === value ? "bg-accent text-accent-foreground" : "bg-elevated text-muted"}`}
            onClick={() => setTab(value)}
          >
            {value === "playlists"
              ? id.pages.playlists
              : value === "liked"
                ? id.pages.liked
                : value === "albums"
                  ? id.pages.albums
                  : id.pages.artists}
          </button>
        ))}
        <Button
          className="ml-auto"
          onClick={() => setCreating((value) => !value)}
        >
          {id.actions.createPlaylist}
        </Button>
        <select
          className="border-border bg-surface text-muted ml-auto rounded-lg border px-3 py-2 text-sm"
          value={sort}
          onChange={(event) => setSort(event.target.value as typeof sort)}
          aria-label="Urutkan koleksi"
        >
          <option value="newest">{id.pages.newest}</option>
          <option value="alphabetical">{id.pages.alphabetical}</option>
        </select>
      </div>
      {creating && (
        <form
          className="bg-surface mt-6 flex gap-2 rounded-xl p-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch("/api/playlists", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, isPublic: false }),
            });
            if (response.ok) {
              setName("");
              setCreating(false);
              router.refresh();
            }
          }}
        >
          <input
            className="bg-elevated min-w-0 flex-1 rounded-lg px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            required
            placeholder={id.pages.playlists}
          />
          <Button type="submit">{id.actions.save}</Button>
        </form>
      )}
      {tab !== "playlists" ? (
        <p className="text-muted mt-10">{id.states.emptyDescription}</p>
      ) : sorted.length === 0 ? (
        <p className="text-muted mt-10">{id.pages.emptyLibrary}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((playlist) => (
            <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
              <PlaylistCard
                title={playlist.name}
                description={playlist.description ?? ""}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
