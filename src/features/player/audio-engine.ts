import type { Track } from "./schemas";

export type AudioEngineEvent =
  "timeupdate" | "ended" | "loadstart" | "canplay" | "waiting" | "error";

type Listener = () => void;

export class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private readonly listeners = new Map<AudioEngineEvent, Set<Listener>>();
  private readonly boundHandlers = new Map<AudioEngineEvent, Listener>();

  constructor() {
    if (typeof window === "undefined") {
      return;
    }

    this.audio = document.createElement("audio");
    this.audio.preload = "auto";
    this.audio.setAttribute("aria-hidden", "true");
    this.audio.style.display = "none";

    const events: AudioEngineEvent[] = [
      "timeupdate",
      "ended",
      "loadstart",
      "canplay",
      "waiting",
      "error",
    ];
    events.forEach((event) => {
      const handler = () => this.emit(event);
      this.boundHandlers.set(event, handler);
      this.audio?.addEventListener(event, handler);
    });
  }

  on(event: AudioEngineEvent, listener: Listener) {
    const eventListeners = this.listeners.get(event) ?? new Set<Listener>();
    eventListeners.add(listener);
    this.listeners.set(event, eventListeners);
    return () => {
      eventListeners.delete(listener);
    };
  }

  load(track: Track) {
    if (!this.audio) {
      return;
    }

    this.audio.src = track.audioUrl;
    this.audio.load();
  }

  async play() {
    if (!this.audio) {
      return;
    }

    await this.audio.play();
  }

  pause() {
    this.audio?.pause();
  }

  seek(sec: number) {
    if (!this.audio) {
      return;
    }

    const max = Number.isFinite(this.audio.duration)
      ? this.audio.duration
      : Number.POSITIVE_INFINITY;
    this.audio.currentTime = Math.min(Math.max(sec, 0), max);
  }

  setVolume(volume: number) {
    if (!this.audio) {
      return;
    }

    this.audio.volume = Math.min(Math.max(volume, 0), 1);
  }

  setMuted(muted: boolean) {
    if (this.audio) {
      this.audio.muted = muted;
    }
  }

  get currentTime() {
    return this.audio?.currentTime ?? 0;
  }

  get duration() {
    return this.audio?.duration ?? Number.NaN;
  }

  destroy() {
    this.boundHandlers.forEach((handler, event) => {
      this.audio?.removeEventListener(event, handler);
    });
    this.boundHandlers.clear();
    this.listeners.clear();
    this.audio?.pause();
    this.audio?.removeAttribute("src");
    this.audio?.load();
    this.audio = null;
  }

  private emit(event: AudioEngineEvent) {
    this.listeners.get(event)?.forEach((listener) => listener());
  }
}

export const audioEngine = new AudioEngine();
