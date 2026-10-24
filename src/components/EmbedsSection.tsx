import { embeds } from "../config/openlink";

export function EmbedsSection() {
  if (!embeds.length) return null;

  return (
    <section aria-label="Media">
      <div className="space-y-5">
        {embeds.map((embed) => (
          <div key={embed.title} className="group">
            <p className="mb-2.5 font-display text-[18px] font-bold text-ink dark:text-ink">
              {embed.title}
            </p>
            <div className="relative aspect-video w-full overflow-hidden rounded-[32px] bg-fill">
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

