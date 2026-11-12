import { Skeleton } from "@/components/ui/skeleton";
import { id } from "@/lib/i18n/id";

type PagePlaceholderProps = {
  title: string;
};

export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="text-muted mt-3">{id.shell.emptyPage}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="aspect-square w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
