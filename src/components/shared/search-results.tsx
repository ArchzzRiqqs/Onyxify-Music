"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Track } from "@/features/player";
import { usePlayerStore } from "@/features/player";
import { id } from "@/lib/i18n/id";

import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { TrackRow } from "./track-row";

type SearchResponse = {
  data: {
    items: Track[];
  };
};

async function searchTracks(query: string, signal: AbortSignal) {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    signal,
  });
  if (!response.ok) {
    throw new Error("Search request failed");
  }
  const json = (await response.json()) as SearchResponse;
  return json.data;
}

type SearchResultsProps = {
  initialQuery?: string;
};

export function SearchResults({ initialQuery = "" }: SearchResultsProps) {
  const router = useRouter();
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery.trim());
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextQuery = query.trim();
      setDebouncedQuery(nextQuery);
      router.replace(
        nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search",
      );
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, router]);

  const search = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: ({ signal }) => searchTracks(debouncedQuery, signal),
    enabled: debouncedQuery.length > 0,
  });
  const tracks = useMemo(() => search.data?.items ?? [], [search.data]);

  const play = (index: number) => {
    const track = tracks[index];
    if (track) {
      playTrack(track, tracks);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {id.pages.searchTitle}
      </h1>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={id.design.searchPlaceholder}
        aria-label={id.design.searchPlaceholder}
        className="bg-surface mt-6 max-w-xl rounded-full"
      />

      {debouncedQuery.length === 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {id.nav.genresList.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setQuery(genre)}
              className="bg-elevated focus-visible:ring-accent hover:bg-surface rounded-xl p-8 text-left font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {search.isLoading && (
        <div className="mt-8 space-y-2" aria-label="Memuat hasil pencarian">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      )}
      {search.isError && (
        <div className="mt-8">
          <ErrorState
            title={id.states.errorTitle}
            description={id.states.errorDescription}
            onRetry={() => void search.refetch()}
          />
        </div>
      )}
      {search.isSuccess && tracks.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title={id.states.emptyTitle}
            description={id.states.emptyDescription}
          />
        </div>
      )}
      {search.isSuccess && tracks.length > 0 && (
        <div className="mt-8 space-y-8">
          <section aria-labelledby="top-result-title">
            <h2 id="top-result-title" className="mb-3 text-xl font-semibold">
              {id.nav.topResult}
            </h2>
            <TrackRow
              title={tracks[0]?.title ?? ""}
              artist={tracks[0]?.artists.join(", ") ?? ""}
              duration={formatDuration(tracks[0]?.durationSec ?? 0)}
              index={1}
              onPlay={() => play(0)}
            />
          </section>
          <section aria-labelledby="tracks-result-title">
            <h2 id="tracks-result-title" className="mb-3 text-xl font-semibold">
              {id.nav.tracks}
            </h2>
            <div
              className="border-border bg-surface rounded-xl border"
              tabIndex={0}
              aria-label={id.nav.tracks}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveIndex((index) =>
                    Math.min(index + 1, tracks.length - 1),
                  );
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveIndex((index) => Math.max(index - 1, 0));
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  play(activeIndex);
                }
              }}
            >
              {tracks.map((track, index) => (
                <TrackRow
                  key={track.id}
                  title={track.title}
                  artist={track.artists.join(", ")}
                  duration={formatDuration(track.durationSec)}
                  index={index + 1}
                  className={index === activeIndex ? "bg-elevated" : undefined}
                  onPlay={() => play(index)}
                  onPlayNext={() => usePlayerStore.getState().playNext(track)}
                  onEnqueue={() => usePlayerStore.getState().enqueue(track)}
                  onCopyLink={() =>
                    void navigator.clipboard?.writeText(
                      `${window.location.origin}/track/${track.id}`,
                    )
                  }
                />
              ))}
            </div>
          </section>
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {search.isSuccess ? `${tracks.length} hasil` : ""}
      </div>
    </div>
  );
}

const formatDuration = (duration: number) =>
  `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, "0")}`;
