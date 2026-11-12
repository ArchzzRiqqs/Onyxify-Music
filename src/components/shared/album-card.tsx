"use client";

import { PlayButton } from "./play-button";
import { CoverImage } from "./cover-image";

type AlbumCardProps = {
  title: string;
  subtitle: string;
  coverSrc?: string;
  onPlay?: () => void;
};

export function AlbumCard({
  title,
  subtitle,
  coverSrc,
  onPlay,
}: AlbumCardProps) {
  return (
    <article className="group hover:border-border hover:bg-surface min-w-0 rounded-xl border border-transparent p-3 transition-colors duration-150">
      <div className="relative">
        <CoverImage src={coverSrc} alt={title} size="lg" />
        <PlayButton
          label={`Putar album ${title}`}
          onClick={onPlay}
          size="md"
          className="absolute right-2 bottom-2 opacity-0 shadow-lg transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
        />
      </div>
      <h3 className="mt-3 truncate font-medium">{title}</h3>
      <p className="text-muted mt-1 truncate text-sm">{subtitle}</p>
    </article>
  );
}
