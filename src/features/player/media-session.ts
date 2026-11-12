import type { Track } from "./schemas";

type PlayerControls = {
  play: () => void;
  pause: () => void;
  previous: () => void;
  next: () => void;
  seek: (position: number) => void;
};

export function updateMediaSession(
  track: Track | undefined,
  controls: PlayerControls,
) {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) {
    return;
  }

  if (track) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artists.join(", "),
      album: track.album,
      artwork: track.coverUrl
        ? [{ src: track.coverUrl, sizes: "512x512", type: "image/png" }]
        : [],
    });
  } else {
    navigator.mediaSession.metadata = null;
  }

  const handlers: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
    ["play", controls.play],
    ["pause", controls.pause],
    ["previoustrack", controls.previous],
    ["nexttrack", controls.next],
    [
      "seekto",
      (details) => {
        if (typeof details.seekTime === "number") {
          controls.seek(details.seekTime);
        }
      },
    ],
  ];

  handlers.forEach(([action, handler]) => {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch {
      // Some browsers expose Media Session but do not support every action.
    }
  });
}
