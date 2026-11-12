"use client";

import { useSyncExternalStore } from "react";

import { id } from "@/lib/i18n/id";

export function Greeting() {
  const greeting = useSyncExternalStore(
    () => () => undefined,
    () => {
      const hour = new Date().getHours();
      return hour < 11
        ? id.nav.morning
        : hour < 15
          ? id.nav.afternoon
          : hour < 18
            ? id.nav.evening
            : id.nav.night;
    },
    () => id.nav.morning,
  );

  return <p className="text-muted text-sm">{greeting}</p>;
}
