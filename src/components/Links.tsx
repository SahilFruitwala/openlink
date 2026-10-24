"use client";

import { featuredLinks, links } from "../config/openlink";
import type { FeaturedLink, LinkItem } from "../config/openlink";
import { TrackedLink } from "./TrackedLink";

function AppIcon({ item }: { item: LinkItem }) {
  return (
    <div className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[22px] bg-accent text-[32px] text-on-accent shadow-[0_8px_20px_-8px_rgba(20,33,61,0.5)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
      {item.logoUrl ? (
        <img
          src={item.logoUrl}
          alt=""
          className={item.logoStyle === "app" ? "h-full w-full object-cover" : "h-3/5 w-3/5 object-contain"}
        />
      ) : (
        <span>{item.iconEmoji ?? item.label.charAt(0)}</span>
      )}
    </div>
  );
}

export function FeaturedLinks() {
  if (!featuredLinks.length) return null;

  return (
    <section aria-label="Featured" className="flex flex-col gap-5">
      {featuredLinks.map((item: FeaturedLink, i) => (
        <TrackedLink
          key={item.label}
          href={item.href}
          section="featured"
          label={item.label}
          extraUTM={item.highlightKey ? { utm_content: item.highlightKey } : undefined}
          className="rise-in group glass flex items-center gap-4 rounded-[32px] p-5 transition-transform duration-200 active:scale-[0.98]"
          style={{ animationDelay: `${100 + i * 60}ms` }}
        >
          <div className="min-w-0 flex-1">
            <span className="block font-display text-[20px] font-bold leading-tight tracking-[-0.01em] text-ink">
              {item.label}
            </span>
            {item.description && (
              <span className="mt-1 block text-[14px] text-muted">{item.description}</span>
            )}
          </div>
          {item.badge && (
            <span className="shrink-0 rounded-full bg-accent px-3 py-0.5 text-[12px] font-semibold text-on-accent">
              {item.badge}
            </span>
          )}
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </TrackedLink>
      ))}
    </section>
  );
}

export function LinkList() {
  if (!links.length) return null;

  return (
    <section aria-label="Projects" className="glass rounded-[32px] p-5">
      <div className="grid grid-cols-3 gap-x-3 gap-y-6">
        {links.map((item: LinkItem, i) => (
          <TrackedLink
            key={item.label}
            href={item.href}
            section="links"
            label={item.label}
            className="rise-in group flex flex-col items-center gap-2 text-center"
            style={{ animationDelay: `${160 + i * 60}ms` }}
          >
            <AppIcon item={item} />
            <span className="w-full truncate text-[13px] font-semibold text-ink">{item.label}</span>
            {item.description && (
              <span className="-mt-1.5 line-clamp-2 text-[12px] leading-tight text-muted">
                {item.description}
              </span>
            )}
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
