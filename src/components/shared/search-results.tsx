"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { ErrorState } from "./error-state";
import { EmptyState } from "./empty-state";
import { TrackRow } from "./track-row";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { id } from "@/lib/i18n/id";
import type { Track } from "@/features/player";

type SearchResponse = {
  data: {
    items: Track[];
  };
};

async function searchTracks(query: string): Promise<SearchResponse["data"]> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Search request failed");
  }
  const json = (await response.json()) as SearchResponse;
  return json.data;
}

export function SearchResults() {
  const [query, setQuery] = useState("");
  const search = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchTracks(query),
    enabled: query.trim().length > 0,
  });

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
      {search.isLoading && (
        <div className="mt-8 space-y-2" aria-label="Memuat hasil pencarian">
          {Array.from({ length: 3 }, (_, index) => (
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
      {search.isSuccess && search.data.items.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title={id.states.emptyTitle}
            description={id.states.emptyDescription}
          />
        </div>
      )}
      {search.isSuccess && search.data.items.length > 0 && (
        <div className="border-border bg-surface mt-8 rounded-xl border">
          {search.data.items.map((track, index) => (
            <TrackRow
              key={track.id}
              title={track.title}
              artist={track.artists.join(", ")}
              duration={`${Math.floor(track.durationSec / 60)}:${String(Math.floor(track.durationSec % 60)).padStart(2, "0")}`}
              index={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
