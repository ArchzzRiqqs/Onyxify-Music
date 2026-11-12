"use client";

import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/features/player";
import type { Track } from "@/features/player";

const demoTracks: Track[] = [
  {
    id: "demo-calm",
    provider: "fixtures",
    source: "Onyxify Fixtures",
    title: "Calm",
    artists: ["Demo Library"],
    album: "Free Music Archive",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    durationSec: 180,
    license: "Pixabay Content License",
  },
  {
    id: "demo-dreams",
    provider: "fixtures",
    source: "Onyxify Fixtures",
    title: "Dreams",
    artists: ["Demo Library"],
    album: "Free Music Archive",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/25/audio_946f7c7c34.mp3",
    durationSec: 180,
    license: "Pixabay Content License",
  },
  {
    id: "demo-summer",
    provider: "fixtures",
    source: "Onyxify Fixtures",
    title: "Summer",
    artists: ["Demo Library"],
    album: "Free Music Archive",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_3a4f6c1a8e.mp3",
    durationSec: 180,
    license: "Pixabay Content License",
  },
];

export default function PlayerDevPage() {
  const playTrack = usePlayerStore((state) => state.playTrack);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-accent text-sm font-medium tracking-[0.3em] uppercase">
        Audio engine
      </p>
      <h1 className="mt-4 text-4xl font-semibold">Player development page</h1>
      <p className="text-muted mt-3">
        Gunakan track berikut untuk menguji queue, Media Session, dan kontrol
        player.
      </p>
      <div className="mt-8 space-y-3">
        {demoTracks.map((track) => (
          <div
            key={track.id}
            className="border-border bg-surface flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <p className="font-medium">{track.title}</p>
              <p className="text-muted text-sm">{track.artists.join(", ")}</p>
            </div>
            <Button type="button" onClick={() => playTrack(track, demoTracks)}>
              <Play fill="currentColor" />
              Putar
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
