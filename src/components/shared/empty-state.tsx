import { Music2 } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="border-border bg-surface flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
      <Music2 className="text-accent mb-4 size-8" aria-hidden="true" />
      <h2 className="font-semibold">{title}</h2>
      <p className="text-muted mt-2 max-w-sm text-sm">{description}</p>
    </div>
  );
}
