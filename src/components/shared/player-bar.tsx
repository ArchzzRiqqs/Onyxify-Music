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
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { id } from "@/lib/i18n/id";

import { CoverImage } from "./cover-image";

export function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <footer className="border-border bg-surface/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md lg:left-70">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center gap-3 px-4 sm:h-22 sm:px-6">
        <CoverImage alt={id.shell.currentTrack} size="sm" />
        <div className="min-w-0 flex-1 sm:w-44 sm:flex-none">
          <p className="truncate text-sm font-medium">
            {id.shell.currentTrack}
          </p>
          <p className="text-muted truncate text-xs">
            {id.shell.currentArtist}
          </p>
        </div>

        <div className="hidden flex-1 flex-col items-center gap-1 sm:flex">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={id.actions.shuffle}
            >
              <Shuffle />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={id.actions.previous}
            >
              <SkipBack />
            </Button>
            <Button
              type="button"
              size="icon"
              className="size-9 rounded-full"
              aria-label={isPlaying ? id.actions.pause : id.actions.play}
              aria-pressed={isPlaying}
              onClick={() => setIsPlaying((value) => !value)}
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
            >
              <SkipForward />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={id.actions.repeat}
            >
              <Repeat2 />
            </Button>
          </div>
          <div className="text-muted flex w-full max-w-xl items-center gap-2 text-[10px]">
            <span>0:00</span>
            <Slider
              aria-label="Posisi lagu"
              defaultValue={[32]}
              max={100}
              step={1}
            />
            <span>3:42</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={id.actions.queue}
          >
            <ListMusic />
          </Button>
          <div className="hidden items-center gap-2 md:flex">
            <Volume2 className="text-muted size-4" aria-hidden="true" />
            <Slider
              aria-label={id.actions.volume}
              defaultValue={[70]}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="hidden sm:inline-flex"
            aria-label={id.actions.mute}
          >
            <Volume2 />
          </Button>
        </div>
      </div>
    </footer>
  );
}
