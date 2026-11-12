"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { id } from "@/lib/i18n/id";
import { usePlayerStore, type Track } from "@/features/player";

import { CoverImage } from "./cover-image";
import { TrackRow } from "./track-row";

type BrowseDetailProps = {
  title: string;
  subtitle: string;
  coverUrl?: string;
  tracks: Track[];
};

export function BrowseDetail({
  title,
  subtitle,
  coverUrl,
  tracks,
}: BrowseDetailProps) {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const activeTrack = usePlayerStore(
    (state) => state.queue[state.currentIndex],
  );
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);

  const play = (index: number) => {
    const track = tracks[index];
    if (track) {
      playTrack(track, tracks);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-10">
      <Link
        href="/"
        className="text-muted hover:text-foreground focus-visible:ring-accent text-sm focus-visible:ring-2 focus-visible:outline-none"
      >
        ← {id.pages.backToBrowse}
      </Link>
      <header className="border-border from-accent/30 via-surface to-background relative mt-6 overflow-hidden rounded-2xl border bg-linear-to-br p-6 sm:flex sm:items-end sm:gap-6 sm:p-8">
        <CoverImage src={coverUrl} alt={title} size="lg" className="max-w-56" />
        <div className="relative mt-6 sm:mt-0">
          <p className="text-muted text-sm">{subtitle}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => play(0)}
              disabled={tracks.length === 0}
            >
              {id.pages.play}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={toggleShuffle}
              disabled={tracks.length === 0}
            >
              {id.pages.shuffle}
            </Button>
          </div>
        </div>
      </header>
      <section className="mt-8" aria-labelledby="browse-tracks-title">
        <h2 id="browse-tracks-title" className="mb-3 text-xl font-semibold">
          {id.nav.tracks}
        </h2>
        <div className="border-border bg-surface rounded-xl border">
          {tracks.map((track, index) => (
            <TrackRow
              key={track.id}
              title={track.title}
              artist={track.artists.join(", ")}
              duration={formatDuration(track.durationSec)}
              coverSrc={track.coverUrl}
              index={index + 1}
              isPlaying={activeTrack?.id === track.id && isPlaying}
              onPlay={() => play(index)}
              onPlayNext={() => usePlayerStore.getState().playNext(track)}
              onEnqueue={() => usePlayerStore.getState().enqueue(track)}
              onCopyLink={() =>
                void navigator.clipboard?.writeText(
                  `${window.location.origin}/track/${track.id}`,
                )
              }
              likeTrack={{
                provider: track.provider,
                externalId: track.id,
                title: track.title,
                artists: track.artists,
                coverUrl: track.coverUrl,
                durationSec: track.durationSec,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

const formatDuration = (duration: number) =>
  `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, "0")}`;
