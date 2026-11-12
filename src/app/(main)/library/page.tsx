import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LibraryView } from "@/components/shared/library-view";

export default async function LibraryPage() {
  const user = await requireUser();
  const playlists = await prisma.playlist.findMany({
    where: { ownerId: user.id },
    select: { id: true, name: true, description: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return (
    <LibraryView
      playlists={playlists.map((playlist) => ({
        ...playlist,
        updatedAt: playlist.updatedAt.toISOString(),
      }))}
    />
  );
}
