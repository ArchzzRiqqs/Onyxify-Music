"use client";

import type { ReactNode } from "react";

import { useAudioBridge } from "./use-audio-bridge";
import { useSleepTimer } from "./use-sleep-timer";

export function PlayerProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  useAudioBridge();
  useSleepTimer();
  return children;
}
