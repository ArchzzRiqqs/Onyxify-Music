"use client";

import { useEffect, useRef } from "react";

import { audioEngine } from "./audio-engine";
import { usePlayerStore } from "./player.store";

export function useSleepTimer() {
  const endAt = usePlayerStore((state) => state.sleepTimerEndAt);
  const volume = usePlayerStore((state) => state.volume);
  const baseVolume = useRef(volume);

  useEffect(() => {
    baseVolume.current = volume;
  }, [volume]);

  useEffect(() => {
    if (!endAt) {
      audioEngine.setVolume(volume);
      return;
    }

    const check = () => {
      const remaining = endAt - Date.now();
      if (remaining <= 0) {
        usePlayerStore.getState().clearSleepTimer();
        usePlayerStore.getState().setPlaying(false);
        audioEngine.setVolume(baseVolume.current);
        return;
      }
      audioEngine.setVolume(
        remaining <= 3000
          ? baseVolume.current * Math.max(0, remaining / 3000)
          : baseVolume.current,
      );
    };

    check();
    const interval = window.setInterval(check, 250);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", check);
      audioEngine.setVolume(baseVolume.current);
    };
  }, [endAt, volume]);
}
