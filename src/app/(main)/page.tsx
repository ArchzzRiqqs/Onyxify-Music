import Link from "next/link";

import { AlbumCard } from "@/components/shared/album-card";
import { Greeting } from "@/components/shared/greeting";
import { getMusicProvider } from "@/features/catalog/server/provider.factory";
import { id } from "@/lib/i18n/id";

export default async function HomePage() {
  const sections = await getMusicProvider().getFeatured();
  const items = sections.flatMap((section) => section.items);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-10">
      <Greeting />
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {id.nav.home}
      </h1>

      <section className="mt-8" aria-labelledby="quick-picks-title">
        <h2 id="quick-picks-title" className="mb-4 text-2xl font-semibold">
          {id.nav.quickPicks}
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {items.slice(0, 6).map((item) => (
            <Link
              key={item.id}
              href={
                "artist" in item ? `/album/${item.id}` : `/playlist/${item.id}`
              }
              className="bg-elevated hover:bg-surface focus-visible:ring-accent flex items-center gap-3 rounded-lg p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="from-accent/70 to-elevated size-12 shrink-0 rounded-md bg-linear-to-br" />
              <span className="truncate text-sm font-medium">{item.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="featured-title">
        <h2 id="featured-title" className="mb-4 text-2xl font-semibold">
          {id.pages.featuredTitle}
        </h2>
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {items.map((item) => (
            <div key={item.id} className="w-44 shrink-0 snap-start sm:w-52">
              <AlbumCard
                title={item.title}
                subtitle={"artist" in item ? item.artist : item.description}
                coverSrc={item.coverUrl}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="genre-title">
        <h2 id="genre-title" className="mb-4 text-2xl font-semibold">
          {id.nav.genres}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {["Pop", "Chill", "Instrumental", "Fokus"].map((genre) => (
            <Link
              key={genre}
              href={`/search?q=${encodeURIComponent(genre)}`}
              className="bg-elevated hover:bg-surface focus-visible:ring-accent min-w-32 rounded-xl p-5 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="new-releases-title">
        <h2 id="new-releases-title" className="mb-4 text-2xl font-semibold">
          {id.nav.newReleases}
        </h2>
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {items.map((item) => (
            <div key={item.id} className="w-44 shrink-0 snap-start sm:w-52">
              <AlbumCard
                title={item.title}
                subtitle={"artist" in item ? item.artist : item.description}
                coverSrc={item.coverUrl}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
