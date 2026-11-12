"use client";

import Link from "next/link";
import { Home, Library, Search } from "lucide-react";

import { id } from "@/lib/i18n/id";

const navigation = [
  { href: "/", label: id.nav.home, icon: Home },
  { href: "/search", label: id.nav.search, icon: Search },
  { href: "/library", label: id.nav.library, icon: Library },
] as const;

export function MobileNav() {
  return (
    <nav
      aria-label={id.nav.mobileLabel}
      className="border-border bg-surface/98 fixed inset-x-0 bottom-0 z-50 grid h-16 grid-cols-3 border-t px-2 backdrop-blur-md lg:hidden"
    >
      {navigation.map(({ href, label, icon: Icon }) => {
        return (
          <Link
            key={href}
            href={href}
            className="text-muted hover:text-foreground focus-visible:ring-accent flex flex-col items-center justify-center gap-1 rounded-lg text-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
