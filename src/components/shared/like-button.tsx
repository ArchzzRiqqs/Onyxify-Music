"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { id } from "@/lib/i18n/id";

export type LikeTrack = {
  provider: string;
  externalId: string;
  title: string;
  artists: string[];
  coverUrl?: string;
  durationSec: number;
};

export function LikeButton({
  track,
  initialLiked = false,
}: {
  track: LikeTrack;
  initialLiked?: boolean;
}) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(initialLiked);
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/library/liked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(track),
      });
      if (!response.ok) throw new Error("LIKE_FAILED");
      return (await response.json()) as { data: { liked: boolean } };
    },
    onMutate: () => {
      const previous = liked;
      setLiked(!previous);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      setLiked(context?.previous ?? false);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["library", "liked"] });
    },
  });

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={liked ? id.actions.unlike : id.actions.like}
      aria-pressed={liked}
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      <Heart className={liked ? "fill-accent text-accent" : undefined} />
    </Button>
  );
}
