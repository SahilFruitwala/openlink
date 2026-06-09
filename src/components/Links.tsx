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
    <div
      className={`absolute left-4 flex h-8 w-8 shrink-0 items-center justify-center text-earth transition-transform group-hover:scale-110 dark:text-earth${
        isAppIcon ? " overflow-hidden rounded-2xl shadow-sm" : ""
      }`}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={`${label} logo`}
          className={isAppIcon ? "h-full w-full object-cover" : "h-full w-full object-contain"}
        />
      ) : (
        <span className="text-xl">{iconEmoji}</span>
      )}
    </div>
  );
}

function LinkContent({ label, description }: Pick<LinkItem, "label" | "description">) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 px-8 text-center">
      <p className="text-sm font-bold text-earth dark:text-earth">{label}</p>
      {description && (
        <p className="text-[10px] font-medium text-earth/60 dark:text-earth/70">
          {description}
        </p>
      )}
    </div>
  );
}

export function FeaturedLinks() {
  if (!featuredLinks.length) return null;

  return (
    <section className="space-y-3 pt-2">
      {featuredLinks.map((item) => (
        <TrackedLink
          key={item.label}
          href={item.href}
          section="featured"
          label={item.label}
          extraUTM={
            item.highlightKey ? { utm_content: item.highlightKey } : undefined
          }
          className="group glass relative flex min-h-[64px] items-center justify-center gap-4 rounded-3xl p-4 transition-all hover:scale-[1.02] hover:bg-white/50 dark:hover:bg-white/10"
        >
          <LinkIcon
            label={item.label}
            iconEmoji={item.iconEmoji}
            logoUrl={item.logoUrl}
            logoStyle={item.logoStyle}
          />
          <LinkContent label={item.label} description={item.description} />

          <div className="absolute right-4 flex items-center gap-2">
            {item.badge && (
              <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream shadow-sm">
                {item.badge}
              </span>
            )}
          </div>
        </TrackedLink>
      ))}
    </section>
  );
}

export function LinkList() {
  if (!links.length) return null;

  return (
    <section className="space-y-3">
      {links.map((item) => (
        <TrackedLink
          key={item.label}
          href={item.href}
          section="links"
          label={item.label}
          className="group glass relative flex min-h-[64px] items-center justify-center gap-4 rounded-3xl p-4 transition-all hover:scale-[1.02] hover:bg-white/50 dark:hover:bg-white/10"
        >
          <LinkIcon
            label={item.label}
            iconEmoji={item.iconEmoji}
            logoUrl={item.logoUrl}
            logoStyle={item.logoStyle}
          />
          <LinkContent label={item.label} description={item.description} />
        </TrackedLink>
      ))}
    </section>
  );
}
