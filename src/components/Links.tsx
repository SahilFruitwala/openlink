"use client";

import { featuredLinks, links } from "../config/openlink";
import type { LinkItem, LogoStyle } from "../config/openlink";
import { TrackedLink } from "./TrackedLink";

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
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={`${label} logo`}
          className={isAppIcon ? "h-full w-full object-cover" : "h-6 w-6 object-contain"}
        />
      ) : (
        <span className="text-lg text-muted">{iconEmoji}</span>
      )}
    </div>
  );
}

function LinkRow({
  item,
  section,
  extraUTM,
  delay,
}: {
  item: LinkItem & { badge?: string };
  section: string;
  extraUTM?: Record<string, string>;
  delay: number;
}) {
  return (
    <TrackedLink
      href={item.href}
      section={section}
      label={item.label}
      extraUTM={extraUTM}
      className="rise-in group flex items-center gap-4 border-b border-hairline py-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <LinkIcon
        label={item.label}
        iconEmoji={item.iconEmoji}
        logoUrl={item.logoUrl}
        logoStyle={item.logoStyle}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-serif text-[18px] font-medium leading-tight text-ink transition-colors duration-200 group-hover:text-accent dark:text-ink">
          {item.label}
        </span>
        {item.description && (
          <span className="truncate text-[13.5px] text-muted dark:text-muted">
            {item.description}
          </span>
        )}
      </div>

      {item.badge && (
        <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-accent">
          {item.badge}
        </span>
      )}

      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 text-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ink dark:text-faint dark:group-hover:text-ink"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 17 17 7M9 7h8v8"
        />
      </svg>
    </TrackedLink>
  );
}

export function FeaturedLinks() {
  if (!featuredLinks.length) return null;

  return (
    <section aria-label="Featured">
      <div className="flex flex-col border-t border-hairline">
        {featuredLinks.map((item, i) => (
          <LinkRow
            key={item.label}
            item={item}
            section="featured"
            extraUTM={
              item.highlightKey ? { utm_content: item.highlightKey } : undefined
            }
            delay={200 + i * 40}
          />
        ))}
      </div>
    </section>
  );
}

export function LinkList() {
  if (!links.length) return null;

  return (
    <section aria-label="Projects">
      <div className="flex flex-col">
        {links.map((item, i) => (
          <LinkRow
            key={item.label}
            item={item}
            section="links"
            delay={240 + i * 40}
          />
        ))}
      </div>
    </section>
  );
}
