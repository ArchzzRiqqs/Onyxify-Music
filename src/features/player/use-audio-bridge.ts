"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { audioEngine } from "./audio-engine";
import { updateMediaSession } from "./media-session";
import { usePlayerStore } from "./player.store";

const isTextInput = (target: EventTarget | null) => {
  const element = target as HTMLElement | null;
  return (
    element?.tagName === "INPUT" ||
    element?.tagName === "TEXTAREA" ||
    element?.isContentEditable
  );
};

export function useAudioBridge() {
  const syncingFromEngine = useRef(false);
  const recordedTrackId = useRef<string | undefined>(undefined);
  const track = usePlayerStore((state) => state.queue[state.currentIndex]);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const position = usePlayerStore((state) => state.position);
  const volume = usePlayerStore((state) => state.volume);
  const muted = usePlayerStore((state) => state.muted);

  useEffect(() => {
    if (track?.id !== recordedTrackId.current && position >= 30 && track) {
      recordedTrackId.current = track.id;
      void fetch("/api/library/recent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "jamendo",
          externalId: track.id,
          title: track.title,
          artists: track.artists,
          coverUrl: track.coverUrl,
          durationSec: Math.round(track.durationSec),
        }),
      });
    }
  }, [position, track]);

  useEffect(() => {
    const state = usePlayerStore.getState();
    state.hydratePreferences();
    audioEngine.setVolume(state.volume);
    audioEngine.setMuted(state.muted);

    const unsubscribeTime = audioEngine.on("timeupdate", () => {
      syncingFromEngine.current = true;
      usePlayerStore
        .getState()
        .setPosition(audioEngine.currentTime, audioEngine.duration);
      syncingFromEngine.current = false;
    });
    const unsubscribeLoad = audioEngine.on("loadstart", () => {
      usePlayerStore.getState().setStatus("loading");
    });
    const unsubscribeCanPlay = audioEngine.on("canplay", () => {
      usePlayerStore.getState().setStatus("ready");
    });
    const unsubscribeWaiting = audioEngine.on("waiting", () => {
      usePlayerStore.getState().setStatus("buffering");
    });
    const unsubscribeEnded = audioEngine.on("ended", () => {
      usePlayerStore.getState().next();
    });
    const unsubscribeError = audioEngine.on("error", () => {
      const state = usePlayerStore.getState();
      state.setStatus("error");
      toast.error("Audio gagal dimuat. Beralih ke lagu berikutnya.");
      state.next();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTextInput(event.target)) {
        return;
      }
      const state = usePlayerStore.getState();
      if (event.code === "Space") {
        event.preventDefault();
        state.togglePlay();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (event.shiftKey) {
          state.prev();
        } else {
          state.seek(state.position - 5);
        }
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (event.shiftKey) {
          state.next();
        } else {
          state.seek(state.position + 5);
        }
      } else if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        state.toggleMuted();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      unsubscribeTime();
      unsubscribeLoad();
      unsubscribeCanPlay();
      unsubscribeWaiting();
      unsubscribeEnded();
      unsubscribeError();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const currentTrack =
      usePlayerStore.getState().queue[usePlayerStore.getState().currentIndex];
    if (!currentTrack) {
      audioEngine.pause();
      updateMediaSession(undefined, {
        play: () => usePlayerStore.getState().setPlaying(true),
        pause: () => usePlayerStore.getState().setPlaying(false),
        previous: () => usePlayerStore.getState().prev(),
        next: () => usePlayerStore.getState().next(),
        seek: (nextPosition) => usePlayerStore.getState().seek(nextPosition),
      });
      return;
    }

    audioEngine.load(currentTrack);
    updateMediaSession(currentTrack, {
      play: () => usePlayerStore.getState().setPlaying(true),
      pause: () => usePlayerStore.getState().setPlaying(false),
      previous: () => usePlayerStore.getState().prev(),
      next: () => usePlayerStore.getState().next(),
      seek: (nextPosition) => usePlayerStore.getState().seek(nextPosition),
    });
  }, [track?.id]);

  useEffect(() => {
    if (!track?.id) {
      return;
    }
    if (isPlaying) {
      audioEngine.play().catch(() => {
        usePlayerStore.getState().setPlaying(false);
        toast.info(
          "Pemutaran otomatis diblokir. Tekan putar untuk melanjutkan.",
        );
      });
    } else {
      audioEngine.pause();
    }
  }, [isPlaying, track?.id]);

  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    audioEngine.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (
      !syncingFromEngine.current &&
      Math.abs(audioEngine.currentTime - position) > 0.5
    ) {
      audioEngine.seek(position);
    }
  }, [position]);
}
