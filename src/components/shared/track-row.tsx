"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { id } from "@/lib/i18n/id";

import { CoverImage } from "./cover-image";

type TrackRowProps = {
  title: string;
  artist: string;
  duration: string;
  coverSrc?: string;
  index?: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPlayNext?: () => void;
  onEnqueue?: () => void;
  onAddToPlaylist?: () => void;
  onCopyLink?: () => void;
  className?: string;
};

export function TrackRow({
  title,
  artist,
  duration,
  coverSrc,
  index,
  isPlaying = false,
  onPlay,
  onPlayNext,
  onEnqueue,
  onAddToPlaylist,
  onCopyLink,
  className,
}: TrackRowProps) {
  return (
    <div
      className={cn(
        "group hover:bg-elevated focus-within:bg-elevated grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-150 md:grid-cols-[2rem_3rem_1fr_auto_auto]",
        className,
      )}
    >
      <button
        type="button"
        className="text-muted focus-visible:ring-accent w-8 rounded-md text-left text-sm focus-visible:ring-2 focus-visible:outline-none"
        aria-label={`Putar ${title}`}
        onClick={onPlay}
      >
        <span className="group-hover:hidden">{index ?? "•"}</span>
        <span className="text-accent hidden group-hover:inline">▶</span>
      </button>
      <CoverImage
        src={coverSrc}
        alt={title}
        size="sm"
        className="hidden md:block"
      />
      <button
        type="button"
        className="focus-visible:ring-accent min-w-0 text-left focus-visible:ring-2 focus-visible:outline-none"
        onClick={onPlay}
        onDoubleClick={onPlay}
      >
        <span
          className={cn(
            "flex items-center gap-2 truncate font-medium",
            isPlaying && "text-accent",
          )}
        >
          {isPlaying && (
            <span
              className="flex h-4 items-end gap-0.5"
              aria-label="Sedang diputar"
            >
              <span className="bg-accent h-2 w-0.5 animate-pulse" />
              <span className="bg-accent h-3 w-0.5 animate-pulse [animation-delay:150ms]" />
              <span className="bg-accent h-1.5 w-0.5 animate-pulse [animation-delay:300ms]" />
            </span>
          )}
          <span className="truncate">{title}</span>
        </span>
        <span className="text-muted block truncate text-sm">{artist}</span>
      </button>
      <span className="text-muted text-sm">{duration}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Menu untuk ${title}`}
            className="text-muted opacity-70 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onPlayNext}>
            {id.actions.playNext}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEnqueue}>
            {id.actions.addToQueue}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAddToPlaylist}>
            {id.actions.addToPlaylist}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopyLink}>
            {id.actions.copyLink}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
