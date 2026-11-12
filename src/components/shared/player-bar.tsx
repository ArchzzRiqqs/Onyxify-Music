"use client";

import {
  ListMusic,
  Pause,
  Play,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { id } from "@/lib/i18n/id";
import { usePlayerStore } from "@/features/player";

import { CoverImage } from "./cover-image";
import { SeekBar } from "./seek-bar";
import { VolumeSlider } from "./volume-slider";
import { LikeButton } from "./like-button";
import { QueuePanel } from "./queue-panel";
import { useState } from "react";

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
};

export function PlayerBar() {
  const [queueOpen, setQueueOpen] = useState(false);
  const track = usePlayerStore((state) => state.queue[state.currentIndex]);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const position = usePlayerStore((state) => state.position);
  const duration = usePlayerStore((state) => state.duration);
  const volume = usePlayerStore((state) => state.volume);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const next = usePlayerStore((state) => state.next);
  const prev = usePlayerStore((state) => state.prev);
  const seek = usePlayerStore((state) => state.seek);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const cycleRepeat = usePlayerStore((state) => state.cycleRepeat);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const repeat = usePlayerStore((state) => state.repeat);

  if (!track) {
    return null;
  }

  return (
    <footer className="border-border bg-surface/95 fixed inset-x-0 bottom-0 z-40 hidden border-t backdrop-blur-md sm:block lg:left-70">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center gap-3 px-4 sm:h-22 sm:px-6">
        <CoverImage src={track.coverUrl} alt={track.title} size="sm" />
        <div className="min-w-0 flex-1 sm:w-44 sm:flex-none">
          <p className="truncate text-sm font-medium">{track.title}</p>
          <p className="text-muted truncate text-xs">
            {track.artists.join(", ")}
          </p>
        </div>

        <div className="hidden flex-1 flex-col items-center gap-1 sm:flex">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={id.actions.shuffle}
              aria-pressed={shuffle}
              onClick={toggleShuffle}
            >
              <Shuffle className={shuffle ? "text-accent" : undefined} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={id.actions.previous}
              onClick={prev}
            >
              <SkipBack />
            </Button>
            <Button
              type="button"
              size="icon"
              className="size-9 rounded-full"
              aria-label={isPlaying ? id.actions.pause : id.actions.play}
              aria-pressed={isPlaying}
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
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={id.actions.repeat}
              aria-pressed={repeat !== "off"}
              onClick={cycleRepeat}
            >
              <Repeat2
                className={repeat !== "off" ? "text-accent" : undefined}
              />
            </Button>
          </div>
          <div className="text-muted flex w-full max-w-xl items-center gap-2 text-[10px]">
            <span>{formatTime(position)}</span>
            <SeekBar
              position={position}
              duration={duration || track.durationSec}
              onSeek={seek}
            />
            <span>{formatTime(duration || track.durationSec)}</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <LikeButton
            track={{
              provider: "jamendo",
              externalId: track.id,
              title: track.title,
              artists: track.artists,
              coverUrl: track.coverUrl,
              durationSec: track.durationSec,
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={id.actions.queue}
            aria-pressed={queueOpen}
            onClick={() => setQueueOpen((open) => !open)}
          >
            <ListMusic />
          </Button>
          <div className="hidden items-center gap-2 md:flex">
            <Volume2 className="text-muted size-4" aria-hidden="true" />
            <VolumeSlider volume={volume} onChange={setVolume} />
          </div>
        </div>
      </div>
      <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
    </footer>
  );
}
