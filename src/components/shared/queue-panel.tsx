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
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CoverImage } from "./cover-image";
import { id } from "@/lib/i18n/id";
import { usePlayerStore } from "@/features/player";

function QueueItem({
  track,
  index,
}: {
  track: ReturnType<typeof usePlayerStore.getState>["queue"][number];
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: track.id });
  const remove = usePlayerStore((state) => state.removeFromQueue);
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="bg-elevated flex items-center gap-2 rounded-lg p-2"
    >
      <button
        type="button"
        className="text-muted cursor-grab"
        aria-label={`Pindahkan ${track.title}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <CoverImage
        src={track.coverUrl}
        alt={track.title}
        size="sm"
        className="size-9"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {index === 0 ? "Sedang diputar" : track.title}
        </p>
        <p className="text-muted truncate text-xs">
          {track.artists.join(", ")}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`${id.actions.removeFromQueue} ${track.title}`}
        onClick={() => remove(track.id)}
      >
        <X />
      </Button>
    </div>
  );
}

export function QueuePanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const queue = usePlayerStore((state) => state.queue);
  const reorder = usePlayerStore((state) => state.reorderQueue);
  const clearQueue = usePlayerStore((state) => state.clearQueue);
  const setSleepTimer = usePlayerStore((state) => state.setSleepTimer);
  const setSleepAfterTrack = usePlayerStore(
    (state) => state.setSleepAfterTrack,
  );
  const sleepAfterTrack = usePlayerStore((state) => state.sleepAfterTrack);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (!open) return null;

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const from = queue.findIndex((track) => track.id === event.active.id);
    const to = queue.findIndex((track) => track.id === event.over?.id);
    if (from >= 0 && to >= 0) reorder(from, to);
  }

  return (
    <aside
      className="border-border bg-surface fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l p-5 shadow-2xl"
      aria-label={id.actions.queue}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Antrean</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={id.actions.close}
          onClick={onClose}
        >
          <X />
        </Button>
      </div>
      <div className="mt-4 flex gap-2">
        {[5, 15, 30, 60].map((minutes) => (
          <Button
            key={minutes}
            variant="outline"
            size="sm"
            onClick={() => setSleepTimer(minutes)}
          >
            {minutes}m
          </Button>
        ))}
        <Button
          variant={sleepAfterTrack ? "default" : "outline"}
          size="sm"
          onClick={() => setSleepAfterTrack(!sleepAfterTrack)}
        >
          Akhir lagu
        </Button>
      </div>
      <Button variant="ghost" className="mt-3 self-start" onClick={clearQueue}>
        {id.actions.clearQueue}
      </Button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={queue.map((track) => track.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-5 space-y-2 overflow-y-auto">
            {queue.length === 0 ? (
              <p className="text-muted text-sm">{id.states.emptyDescription}</p>
            ) : (
              queue.map((track, index) => (
                <QueueItem key={track.id} track={track} index={index} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </aside>
  );
}
