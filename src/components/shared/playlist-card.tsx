"use client";

import { AlbumCard } from "./album-card";

type PlaylistCardProps = {
  title: string;
  description: string;
  coverSrc?: string;
  onPlay?: () => void;
};

export function PlaylistCard(props: PlaylistCardProps) {
  return (
    <AlbumCard
      title={props.title}
      subtitle={props.description}
      coverSrc={props.coverSrc}
      onPlay={props.onPlay}
    />
  );
}
