"use client";

import { ChevronLeft, ChevronRight, Search, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { id } from "@/lib/i18n/id";

export function Topbar() {
  const router = useRouter();

  return (
    <header className="border-border bg-background/95 sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-md sm:px-6">
      <div className="hidden items-center gap-1 sm:flex">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={id.actions.back}
          onClick={() => router.back()}
        >
          <ChevronLeft />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={id.actions.forward}
          onClick={() => router.forward()}
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="relative min-w-0 flex-1 sm:max-w-md">
        <Search
          className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          aria-label={id.actions.openSearch}
          placeholder={id.design.searchPlaceholder}
          className="border-border bg-surface h-10 rounded-full pl-9"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              router.push(
                `/search?q=${encodeURIComponent(event.currentTarget.value)}`,
              );
            }
          }}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-auto"
        aria-label={id.actions.openUserMenu}
      >
        <UserCircle />
      </Button>
      <span className="hidden text-sm font-medium md:inline">
        {id.shell.user}
      </span>
    </header>
  );
}
