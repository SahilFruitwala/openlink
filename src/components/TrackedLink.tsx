"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { posthog } from "../lib/posthogClient";
import { buildTrackedUrl, getTrackingContext } from "../lib/tracking";

type TrackedLinkProps = {
  href: string;
  children: ReactNode;
  section: string;
  label: string;
  extraUTM?: Record<string, string>;
  className?: string;
  style?: CSSProperties;
  target?: string;
  rel?: string;
};

export function TrackedLink({
  href,
  children,
  section,
  label,
  extraUTM,
  className,
  style,
  target,
  rel,
}: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const context = getTrackingContext();
    const finalHref = buildTrackedUrl(href, context, extraUTM);

    posthog.capture("openlink_click", {
      section,
      label,
      href,
      finalHref,
      app: context?.app,
      ...context?.utm,
      sourcePlatform: context?.sourcePlatform,
      referrerHost: context?.referrerHost,
    });

    window.location.href = finalHref;
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={label}
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}

