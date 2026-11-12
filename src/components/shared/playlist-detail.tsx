"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { id } from "@/lib/i18n/id";

type PlaylistTrack = {
  id: string;
  title: string;
  artists: string;
  durationSec: number;
};

function SortableTrack({
  track,
  onRemove,
}: {
  track: PlaylistTrack;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: track.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="border-border bg-surface flex items-center gap-3 border-b px-3 py-3 last:border-b-0"
    >
      <button
        type="button"
        className="text-muted cursor-grab"
        aria-label={`Pindahkan ${track.title}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{track.title}</p>
        <p className="text-muted truncate text-sm">{track.artists}</p>
      </div>
      <span className="text-muted text-sm">
        {formatDuration(track.durationSec)}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`${id.actions.removeFromPlaylist} ${track.title}`}
        onClick={onRemove}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

export function PlaylistDetail({
  playlistId,
  initialName,
  initialDescription,
  initialTracks,
}: {
  playlistId: string;
  initialName: string;
  initialDescription: string | null;
  initialTracks: PlaylistTrack[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [tracks, setTracks] = useState(initialTracks);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function rename() {
    const response = await fetch(`/api/playlists/${playlistId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (response.ok) setEditing(false);
  }

  async function removeTrack(trackId: string) {
    const previous = tracks;
    setTracks(previous.filter((track) => track.id !== trackId));
    const response = await fetch(
      `/api/playlists/${playlistId}/tracks?trackId=${trackId}`,
      { method: "DELETE" },
    );
    if (!response.ok) setTracks(previous);
  }

  async function reorder(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const oldIndex = tracks.findIndex((track) => track.id === event.active.id);
    const newIndex = tracks.findIndex((track) => track.id === event.over?.id);
    const next = arrayMove(tracks, oldIndex, newIndex);
    setTracks(next);
    const response = await fetch(`/api/playlists/${playlistId}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackIds: next.map((track) => track.id) }),
    });
    if (!response.ok) setTracks(tracks);
  }

  async function removePlaylist() {
    if (!window.confirm(id.pages.deletePlaylistConfirm)) return;
    const response = await fetch(`/api/playlists/${playlistId}`, {
      method: "DELETE",
    });
    if (response.ok) router.push("/library");
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-10">
      <header className="bg-surface border-border rounded-2xl border p-6">
        <p className="text-muted text-sm">{id.pages.playlists}</p>
        {editing ? (
          <div className="mt-2 flex gap-2">
            <input
              className="bg-elevated rounded-lg px-3 py-2 text-3xl font-semibold"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
            />
            <Button onClick={() => void rename()}>{id.actions.save}</Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              {id.actions.cancel}
            </Button>
          </div>
        ) : (
          <button
            type="button"
            className="mt-2 text-left text-3xl font-semibold"
            onClick={() => setEditing(true)}
          >
            {name}
          </button>
        )}
        {initialDescription && (
          <p className="text-muted mt-2">{initialDescription}</p>
        )}
        <Button
          variant="destructive"
          className="mt-5"
          onClick={() => void removePlaylist()}
        >
          {id.actions.deletePlaylist}
        </Button>
      </header>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => void reorder(event)}
      >
        <SortableContext
          items={tracks.map((track) => track.id)}
          strategy={verticalListSortingStrategy}
        >
          <section
            className="border-border mt-8 overflow-hidden rounded-xl border"
            aria-label={id.nav.tracks}
          >
            {tracks.length === 0 ? (
              <p className="text-muted p-6">{id.pages.emptyPlaylist}</p>
            ) : (
              tracks.map((track) => (
                <SortableTrack
                  key={track.id}
                  track={track}
                  onRemove={() => void removeTrack(track.id)}
                />
              ))
            )}
          </section>
        </SortableContext>
      </DndContext>
    </div>
  );
}

const formatDuration = (duration: number) =>
  `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}`;
