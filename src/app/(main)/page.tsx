import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { AlbumCard } from "@/components/shared/album-card";
import { getMusicProvider } from "@/features/catalog/server/provider.factory";

import { id } from "@/lib/i18n/id";

export default async function HomePage() {
  const sections = await getMusicProvider().getFeatured();

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {id.nav.home}
      </h1>
      {sections.length === 0 ? (
        <PagePlaceholder title={id.nav.home} />
      ) : (
        sections.map((section) => (
          <section
            key={section.title}
            className="mt-10"
            aria-labelledby="featured-title"
          >
            <h2 id="featured-title" className="mb-4 text-2xl font-semibold">
              {id.pages.featuredTitle}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {section.items.map((item) => (
                <AlbumCard
                  key={item.id}
                  title={item.title}
                  subtitle={"artist" in item ? item.artist : item.description}
                  coverSrc={item.coverUrl}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
