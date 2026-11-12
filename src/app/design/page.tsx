import { ComponentGallery } from "@/components/shared/component-gallery";
import { id } from "@/lib/i18n/id";

export default function DesignPage() {
  return (
    <main className="bg-background text-foreground min-h-screen px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="border-border mb-12 border-b pb-8">
          <p className="text-accent text-sm font-medium tracking-[0.3em] uppercase">
            {id.design.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {id.design.title}
          </h1>
          <p className="text-muted mt-4 max-w-2xl">{id.design.description}</p>
        </header>
        <ComponentGallery />
      </div>
    </main>
  );
}
