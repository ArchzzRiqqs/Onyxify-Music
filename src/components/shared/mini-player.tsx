"use client";

import { Pause, Play, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";
import { id } from "@/lib/i18n/id";
import { usePlayerStore } from "@/features/player";
import { useState } from "react";

import { CoverImage } from "./cover-image";
import { FullPlayer } from "./full-player";

export function MiniPlayer() {
  const [fullScreen, setFullScreen] = useState(false);
  const track = usePlayerStore((state) => state.queue[state.currentIndex]);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const next = usePlayerStore((state) => state.next);

  if (!track) {
    return null;
  }

  return (
    <div className="border-border bg-elevated/95 fixed inset-x-2 bottom-17 z-40 flex h-14 items-center gap-3 rounded-xl border px-2 shadow-lg backdrop-blur-md sm:hidden">
      <button
        type="button"
        className="min-w-0 flex-1 text-left"
        onClick={() => setFullScreen(true)}
      >
        <CoverImage
          src={track.coverUrl}
          alt={track.title}
          size="sm"
          className="size-10 rounded-lg"
        />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{track.title}</p>
        <p className="text-muted truncate text-xs">
          {track.artists.join(", ")}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={isPlaying ? id.actions.pause : id.actions.play}
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause fill="currentColor" />
        ) : (
          <Play fill="currentColor" />
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={id.actions.next}
        onClick={next}
      >
        <SkipForward />
      </Button>
      {fullScreen && <FullPlayer onClose={() => setFullScreen(false)} />}
    </div>
  );
}
