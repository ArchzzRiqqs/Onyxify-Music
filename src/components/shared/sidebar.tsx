import Link from "next/link";
import { Home, Library, Music2, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { id } from "@/lib/i18n/id";

const navigation = [
  { href: "/", label: id.nav.home, icon: Home },
  { href: "/search", label: id.nav.search, icon: Search },
  { href: "/library", label: id.nav.library, icon: Library },
] as const;

const playlists = [
  { href: "/playlist/fokus-pagi", label: "Fokus Pagi" },
  { href: "/playlist/malam-neon", label: "Malam Neon" },
] as const;

export function Sidebar() {
  return (
    <aside className="border-border bg-surface fixed inset-y-0 left-0 z-30 hidden w-70 flex-col border-r px-5 py-6 lg:flex">
      <Link
        href="/"
        className="focus-visible:ring-accent mb-10 flex items-center gap-3 rounded-lg text-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none"
      >
        <span className="bg-accent text-accent-foreground flex size-9 items-center justify-center rounded-xl">
          <Music2 className="size-5" aria-hidden="true" />
        </span>
        Onyxify
      </Link>

      <nav aria-label={id.nav.mainLabel} className="space-y-1">
        {navigation.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="text-muted hover:bg-elevated hover:text-foreground focus-visible:ring-accent flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-10 flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-muted text-xs font-semibold tracking-wider uppercase">
            {id.nav.playlists}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted"
            aria-label={id.actions.createPlaylist}
          >
            <Plus />
          </Button>
        </div>
        <div className="space-y-1 overflow-y-auto">
          {playlists.map((playlist) => (
            <Link
              key={playlist.href}
              href={playlist.href}
              className="text-muted hover:bg-elevated hover:text-foreground focus-visible:ring-accent block truncate rounded-lg px-3 py-2 text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
            >
              {playlist.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
