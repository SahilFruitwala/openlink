"use client";

import { featuredLinks, links } from "../config/openlink";
import type { LinkItem, LogoStyle } from "../config/openlink";
import { TrackedLink } from "./TrackedLink";
import { SectionHeader } from "./SectionHeader";

type LinkIconProps = {
  label: string;
  iconEmoji?: string;
  logoUrl?: string;
  logoStyle?: LogoStyle;
};

function LinkIcon({ label, iconEmoji, logoUrl, logoStyle = "default" }: LinkIconProps) {
  if (!iconEmoji && !logoUrl) return null;

  const isAppIcon = logoStyle === "app";

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-earth/10 bg-white text-earth transition-transform group-hover:scale-105 dark:border-white/10 dark:bg-white/5 dark:text-earth${
        isAppIcon ? " overflow-hidden" : ""
      }`}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={`${label} logo`}
          className={isAppIcon ? "h-full w-full object-cover" : "h-6 w-6 object-contain"}
        />
      ) : (
        <span className="text-lg">{iconEmoji}</span>
      )}
    </div>
  );
}

function LinkContent({ label, description }: Pick<LinkItem, "label" | "description">) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 text-left">
      <p className="truncate text-sm font-semibold text-earth dark:text-earth">{label}</p>
      {description && (
        <p className="truncate text-[11px] font-medium text-earth/55 dark:text-earth/65">
          {description}
        </p>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-earth/25 transition-all group-hover:translate-x-0.5 group-hover:text-primary dark:text-earth/30"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

export function FeaturedLinks() {
  if (!featuredLinks.length) return null;

  return (
    <section aria-label="Featured link">
      <SectionHeader index="02" label="Start here" />
      <div className="space-y-2.5 pt-2">
        {featuredLinks.map((item, i) => (
          <TrackedLink
            key={item.label}
            href={item.href}
            section="featured"
            label={item.label}
            extraUTM={
              item.highlightKey ? { utm_content: item.highlightKey } : undefined
            }
            className="card rise-in group relative flex min-h-[68px] items-center gap-3 rounded-[1.5rem] p-4"
            style={{ animationDelay: `${220 + i * 50}ms` }}
          >
            <LinkIcon
              label={item.label}
              iconEmoji={item.iconEmoji}
              logoUrl={item.logoUrl}
              logoStyle={item.logoStyle}
            />
            <LinkContent label={item.label} description={item.description} />
            {item.badge && (
              <span className="shrink-0 rounded-full bg-stamp px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-cream shadow-sm">
                {item.badge}
              </span>
            )}
            <Arrow />
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}

export function LinkList() {
  if (!links.length) return null;

  return (
    <section aria-label="Links">
      <SectionHeader index="03" label="Shipped" />
      <div className="space-y-2.5 pt-2">
        {links.map((item, i) => (
          <TrackedLink
            key={item.label}
            href={item.href}
            section="links"
            label={item.label}
            className="card rise-in group relative flex min-h-[68px] items-center gap-3 rounded-[1.5rem] p-4"
            style={{ animationDelay: `${280 + i * 50}ms` }}
          >
            <LinkIcon
              label={item.label}
              iconEmoji={item.iconEmoji}
              logoUrl={item.logoUrl}
              logoStyle={item.logoStyle}
            />
            <LinkContent label={item.label} description={item.description} />
            <Arrow />
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
