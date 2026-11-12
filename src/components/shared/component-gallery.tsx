"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { id } from "@/lib/i18n/id";

import { AlbumCard } from "./album-card";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { PlaylistCard } from "./playlist-card";
import { PlayButton } from "./play-button";
import { TrackRow } from "./track-row";

export function ComponentGallery() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="space-y-12">
      <section aria-labelledby="buttons-heading">
        <h2 id="buttons-heading" className="mb-4 text-2xl font-semibold">
          {id.design.buttons}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>{id.actions.startListening}</Button>
          <Button variant="secondary">{id.design.secondary}</Button>
          <Button variant="outline">{id.design.outline}</Button>
          <Button variant="ghost">{id.design.ghost}</Button>
          <PlayButton size="sm" />
          <PlayButton
            size="md"
            isPlaying={isPlaying}
            onClick={() => setIsPlaying((value) => !value)}
          />
          <PlayButton size="lg" />
        </div>
      </section>

      <section aria-labelledby="forms-heading">
        <h2 id="forms-heading" className="mb-4 text-2xl font-semibold">
          Input & slider
        </h2>
        <div className="grid max-w-xl gap-5">
          <Input
            aria-label={id.design.searchPlaceholder}
            placeholder={id.design.searchPlaceholder}
          />
          <Slider aria-label="Volume" defaultValue={[65]} max={100} step={1} />
        </div>
      </section>

      <section aria-labelledby="cards-heading">
        <h2 id="cards-heading" className="mb-4 text-2xl font-semibold">
          {id.design.cards}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <AlbumCard title="Malam Neon" subtitle="Album • Onyxify" />
          <PlaylistCard title="Fokus Pagi" description="Playlist • 24 lagu" />
        </div>
      </section>

      <section aria-labelledby="tracks-heading">
        <h2 id="tracks-heading" className="mb-4 text-2xl font-semibold">
          {id.design.tracks}
        </h2>
        <div className="border-border bg-surface rounded-xl border">
          <TrackRow
            title="Cahaya Kota"
            artist="Nara"
            duration="3:42"
            index={1}
            isPlaying={isPlaying}
            onPlay={() => setIsPlaying((value) => !value)}
          />
          <TrackRow
            title="Langit Biru"
            artist="Ruang Senja"
            duration="4:08"
            index={2}
          />
        </div>
      </section>

      <section
        aria-labelledby="states-heading"
        className="grid gap-4 md:grid-cols-3"
      >
        <div>
          <h2 id="states-heading" className="mb-4 text-2xl font-semibold">
            {id.design.loading}
          </h2>
          <div className="border-border bg-surface space-y-3 rounded-xl border p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold">{id.design.empty}</h2>
          <EmptyState
            title={id.states.emptyTitle}
            description={id.states.emptyDescription}
          />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold">{id.design.error}</h2>
          {hasError ? (
            <ErrorState
              title={id.states.errorTitle}
              description={id.states.errorDescription}
              onRetry={() => setHasError(false)}
            />
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setHasError(true)}
            >
              {id.design.showError}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
