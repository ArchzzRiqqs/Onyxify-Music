import { create } from "zustand";

import type { RepeatMode, Track } from "./schemas";

type PlayerStatus = "idle" | "loading" | "ready" | "buffering" | "error";

type PlayerState = {
  queue: Track[];
  originalQueue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  status: PlayerStatus;
  position: number;
  duration: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  setPlaying: (isPlaying: boolean) => void;
  next: () => void;
  prev: () => void;
  seek: (position: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  enqueue: (track: Track) => void;
  playNext: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clear: () => void;
  setPosition: (position: number, duration?: number) => void;
  setStatus: (status: PlayerStatus) => void;
  setVolume: (volume: number) => void;
  toggleMuted: () => void;
  hydratePreferences: () => void;
};

const preferencesKey = "onyxify:player-preferences";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const persistPreferences = (
  state: Pick<PlayerState, "volume" | "muted" | "repeat" | "shuffle">,
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    preferencesKey,
    JSON.stringify({
      volume: state.volume,
      muted: state.muted,
      repeat: state.repeat,
      shuffle: state.shuffle,
    }),
  );
};

const shuffleTracks = (tracks: Track[], activeTrack: Track | undefined) => {
  const remaining = tracks.filter((track) => track.id !== activeTrack?.id);
  for (let index = remaining.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = remaining[index];
    const random = remaining[randomIndex];
    if (current && random) {
      remaining[index] = random;
      remaining[randomIndex] = current;
    }
  }
  return activeTrack ? [activeTrack, ...remaining] : remaining;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  originalQueue: [],
  currentIndex: -1,
  isPlaying: false,
  status: "idle",
  position: 0,
  duration: 0,
  volume: 0.7,
  muted: false,
  shuffle: false,
  repeat: "off",

  playTrack: (track, queue = [track]) => {
    const nextQueue = queue.some((item) => item.id === track.id)
      ? queue
      : [track, ...queue];
    set({
      queue: nextQueue,
      originalQueue: nextQueue,
      currentIndex: nextQueue.findIndex((item) => item.id === track.id),
      isPlaying: true,
      status: "loading",
      position: 0,
      duration: track.durationSec,
    });
  },

  togglePlay: () => {
    if (get().currentIndex < 0) {
      return;
    }
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  setPlaying: (isPlaying) => set({ isPlaying }),

  next: () => {
    const { queue, currentIndex, repeat } = get();
    if (queue.length === 0) {
      return;
    }
    if (repeat === "one") {
      set({ position: 0, isPlaying: true });
      return;
    }
    const isLast = currentIndex >= queue.length - 1;
    if (isLast && repeat === "off") {
      set({ isPlaying: false, position: 0 });
      return;
    }
    set({
      currentIndex: isLast ? 0 : currentIndex + 1,
      position: 0,
      isPlaying: true,
      status: "loading",
      duration: queue[isLast ? 0 : currentIndex + 1]?.durationSec ?? 0,
    });
  },

  prev: () => {
    const { queue, currentIndex, position, repeat } = get();
    if (queue.length === 0) {
      return;
    }
    if (position > 3 || currentIndex <= 0) {
      set({ position: 0 });
      return;
    }
    const previousIndex = currentIndex - 1;
    const nextIndex =
      previousIndex >= 0
        ? previousIndex
        : repeat === "all"
          ? queue.length - 1
          : 0;
    set({
      currentIndex: nextIndex,
      position: 0,
      isPlaying: true,
      status: "loading",
      duration: queue[nextIndex]?.durationSec ?? 0,
    });
  },

  seek: (position) => {
    const duration = get().duration;
    set({ position: clamp(position, 0, duration || Number.POSITIVE_INFINITY) });
  },

  toggleShuffle: () => {
    const state = get();
    const nextShuffle = !state.shuffle;
    if (nextShuffle) {
      const activeTrack = state.queue[state.currentIndex];
      const nextQueue = shuffleTracks(state.originalQueue, activeTrack);
      set({
        shuffle: true,
        queue: nextQueue,
        currentIndex: activeTrack ? 0 : -1,
      });
    } else {
      const activeId = state.queue[state.currentIndex]?.id;
      set({
        shuffle: false,
        queue: state.originalQueue,
        currentIndex: activeId
          ? state.originalQueue.findIndex((track) => track.id === activeId)
          : -1,
      });
    }
    persistPreferences({ ...get(), shuffle: nextShuffle });
  },

  cycleRepeat: () => {
    const nextRepeat: RepeatMode =
      get().repeat === "off" ? "all" : get().repeat === "all" ? "one" : "off";
    set({ repeat: nextRepeat });
    persistPreferences({ ...get(), repeat: nextRepeat });
  },

  enqueue: (track) => {
    const state = get();
    if (state.originalQueue.some((item) => item.id === track.id)) {
      return;
    }
    const originalQueue = [...state.originalQueue, track];
    const queue = state.shuffle ? [...state.queue, track] : originalQueue;
    set({ originalQueue, queue });
  },

  playNext: (track) => {
    const state = get();
    const originalQueue = state.originalQueue.filter(
      (item) => item.id !== track.id,
    );
    const originalIndex = Math.max(state.currentIndex + 1, 0);
    originalQueue.splice(originalIndex, 0, track);
    const queue = state.shuffle
      ? (() => {
          const nextQueue = state.queue.filter((item) => item.id !== track.id);
          nextQueue.splice(state.currentIndex + 1, 0, track);
          return nextQueue;
        })()
      : originalQueue;
    set({ originalQueue, queue });
  },

  removeFromQueue: (trackId) => {
    const state = get();
    const currentTrackId = state.queue[state.currentIndex]?.id;
    const queue = state.queue.filter((track) => track.id !== trackId);
    const originalQueue = state.originalQueue.filter(
      (track) => track.id !== trackId,
    );
    const currentIndex = currentTrackId
      ? queue.findIndex((track) => track.id === currentTrackId)
      : -1;
    set({
      queue,
      originalQueue,
      currentIndex,
      isPlaying: queue.length > 0 ? state.isPlaying : false,
    });
  },

  reorderQueue: (fromIndex, toIndex) => {
    const state = get();
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= state.queue.length ||
      toIndex >= state.queue.length
    ) {
      return;
    }
    const queue = [...state.queue];
    const [moved] = queue.splice(fromIndex, 1);
    if (!moved) {
      return;
    }
    queue.splice(toIndex, 0, moved);
    const currentId = state.queue[state.currentIndex]?.id;
    const originalQueue = state.originalQueue
      .filter((track) => queue.some((item) => item.id === track.id))
      .sort(
        (a, b) =>
          queue.findIndex((item) => item.id === a.id) -
          queue.findIndex((item) => item.id === b.id),
      );
    set({
      queue,
      originalQueue,
      currentIndex: currentId
        ? queue.findIndex((track) => track.id === currentId)
        : -1,
    });
  },

  clear: () =>
    set({
      queue: [],
      originalQueue: [],
      currentIndex: -1,
      isPlaying: false,
      status: "idle",
      position: 0,
      duration: 0,
    }),

  setPosition: (position, duration) =>
    set({ position, ...(duration ? { duration } : {}) }),
  setStatus: (status) => set({ status }),
  setVolume: (volume) => {
    const nextVolume = clamp(volume, 0, 1);
    set({ volume: nextVolume });
    persistPreferences({ ...get(), volume: nextVolume });
  },
  toggleMuted: () => {
    const muted = !get().muted;
    set({ muted });
    persistPreferences({ ...get(), muted });
  },
  hydratePreferences: () => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const raw = window.localStorage.getItem(preferencesKey);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Partial<
        Pick<PlayerState, "volume" | "muted" | "repeat" | "shuffle">
      >;
      set({
        volume:
          typeof parsed.volume === "number"
            ? clamp(parsed.volume, 0, 1)
            : get().volume,
        muted: typeof parsed.muted === "boolean" ? parsed.muted : get().muted,
        repeat:
          parsed.repeat === "off" ||
          parsed.repeat === "one" ||
          parsed.repeat === "all"
            ? parsed.repeat
            : get().repeat,
        shuffle:
          typeof parsed.shuffle === "boolean" ? parsed.shuffle : get().shuffle,
      });
    } catch {
      window.localStorage.removeItem(preferencesKey);
    }
  },
}));
