import { notFound } from "next/navigation";

import { CoverImage } from "@/components/shared/cover-image";
import { getMusicProvider } from "@/features/catalog/server/provider.factory";
import { id as copy } from "@/lib/i18n/id";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const track = await getMusicProvider().getTrack((await params).id);
  if (!track) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <CoverImage
          src={track.coverUrl}
          alt={track.title}
          size="lg"
          className="max-w-64"
        />
        <div>
          <h1 className="text-3xl font-semibold">{track.title}</h1>
          <p className="text-muted mt-2">{track.artists.join(", ")}</p>
          <p className="text-muted mt-4 text-sm">
            {copy.pages.trackSource}: {track.source}
          </p>
          <p className="text-muted mt-1 text-sm">
            {copy.pages.trackLicense}: {track.license}
          </p>
        </div>
      </div>
    </main>
  );
}
