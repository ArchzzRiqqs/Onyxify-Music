"use client";

import type { ReactNode } from "react";

import { useAudioBridge } from "./use-audio-bridge";

export function PlayerProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  useAudioBridge();
  return children;
}
