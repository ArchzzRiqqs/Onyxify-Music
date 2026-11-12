"use client";

import { ArrowDown, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { SeekBar } from "./seek-bar";
import { CoverImage } from "./cover-image";
import { id } from "@/lib/i18n/id";
import { usePlayerStore } from "@/features/player";
import { useDominantColor } from "./use-dominant-color";

export function FullPlayer({ onClose }: { onClose: () => void }) {
  const track = usePlayerStore((state) => state.queue[state.currentIndex]);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const position = usePlayerStore((state) => state.position);
  const duration = usePlayerStore((state) => state.duration);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const prev = usePlayerStore((state) => state.prev);
  const next = usePlayerStore((state) => state.next);
  const seek = usePlayerStore((state) => state.seek);
  const dominantColor = useDominantColor(track?.coverUrl);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  if (!track) return null;
  return (
    <div
      className="bg-background fixed inset-0 z-60 flex flex-col p-6 sm:hidden"
      style={{
        background: `linear-gradient(180deg, color-mix(in srgb, ${dominantColor} 35%, var(--background)), var(--background) 65%)`,
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label={id.actions.close}
        onClick={onClose}
      >
        <ArrowDown />
      </Button>
      <div className="flex flex-1 flex-col items-center justify-center">
        <CoverImage
          src={track.coverUrl}
          alt={track.title}
          size="lg"
          className="size-[min(80vw,22rem)] rounded-2xl"
        />
        <h1 className="mt-8 text-center text-2xl font-semibold">
          {track.title}
        </h1>
        <p className="text-muted mt-1">{track.artists.join(", ")}</p>
        <div className="mt-8 w-full">
          <SeekBar
            position={position}
            duration={duration || track.durationSec}
            onSeek={seek}
          />
        </div>
        <div className="mt-5 flex items-center gap-5">
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={id.actions.previous}
            onClick={prev}
          >
            <SkipBack />
          </Button>
          <Button
            size="icon-lg"
            className="rounded-full"
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
            variant="ghost"
            size="icon-lg"
            aria-label={id.actions.next}
            onClick={next}
          >
            <SkipForward />
          </Button>
        </div>
      </div>
    </div>
  );
}
