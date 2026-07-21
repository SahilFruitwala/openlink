import { embeds } from "../config/openlink";
import { SectionHeader } from "./SectionHeader";

export function EmbedsSection() {
  if (!embeds.length) return null;

  return (
    <section aria-label="Media" className="pt-2">
      <SectionHeader index="05" label="Watch" />
      <div className="space-y-4 pt-2">
        {embeds.map((embed) => (
          <div key={embed.title} className="card group overflow-hidden rounded-[1.75rem]">
            <div className="flex items-center justify-between px-5 py-3.5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-earth/70 dark:text-earth/80">
                {embed.title}
              </p>
              <span className="catalog-tag text-stamp">● REC</span>
            </div>
            <div className="relative aspect-video w-full bg-earth/5">
              <iframe
                src={embed.src}
                title={embed.title}
                className="h-full w-full border-0 transition-opacity group-hover:opacity-90"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

