import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PlaylistDetail } from "@/components/shared/playlist-detail";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const playlist = await prisma.playlist.findFirst({
    where: { id, ownerId: user.id },
    include: { tracks: { orderBy: { position: "asc" } } },
  });
  if (!playlist) notFound();
  return (
    <PlaylistDetail
      playlistId={playlist.id}
      initialName={playlist.name}
      initialDescription={playlist.description}
      initialTracks={playlist.tracks}
    />
  );
}
