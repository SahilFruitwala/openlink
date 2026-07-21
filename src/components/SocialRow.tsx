"use client";

import { socialLinks } from "../config/openlink";
import type { SocialType } from "../config/openlink";
import { TrackedLink } from "./TrackedLink";

type IconProps = { type: SocialType };

function SocialIcon({ type }: IconProps) {
  if (type === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16.6" cy="7.4" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  if (type === "github") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[22px] w-[22px]" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.12.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.21 1.78 1.21 1.04 1.78 2.73 1.27 3.4.97.11-.76.4-1.27.73-1.56-2.55-.29-5.23-1.28-5.23-5.71 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.44-2.69 5.41-5.25 5.7.41.36.77 1.08.77 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
        />
      </svg>
    );
  }
  if (type === "twitter") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[19px] w-[19px]" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.02 4.13H5.06l12.02 15.64Z"
        />
      </svg>
    );
  }
  if (type === "linkedin") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[19px] w-[19px]" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43c-1.14 0-2.06-.93-2.06-2.07 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.07-2.06 2.07Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.78C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.78 24h20.44c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"
        />
      </svg>
    );
  }
  if (type === "youtube") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[22px] w-[22px]" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M23.5 6.5a3.1 3.1 0 0 0-2.2-2.2C19.5 4 12 4 12 4s-7.5 0-9.3.3a3.1 3.1 0 0 0-2.2 2.2C0 8.3 0 12 0 12s0 3.7.5 5.5a3.1 3.1 0 0 0 2.2 2.2c1.8.3 9.3.3 9.3.3s7.5 0 9.3-.3a3.1 3.1 0 0 0 2.2-2.2c.5-1.8.5-5.5.5-5.5s0-3.7-.5-5.5ZM9.5 15.5v-7l6 3.5-6 3.5Z"
        />
      </svg>
    );
  }
  if (type === "newsletter") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"
        />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m22 6-10 7L2 6" />
      </svg>
    );
  }
  // custom or fallback
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="15 3 21 3 21 9" />
      <line fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function SocialRow() {
  if (!socialLinks.length) return null;

  return (
    <section aria-label="Social links">
      <div className="flex flex-wrap items-center gap-6 pb-12">
        {socialLinks.map((link, i) => (
          <TrackedLink
            key={`${link.type}-${link.href}`}
            href={link.href}
            label={link.label}
            section="social"
            extraUTM={{ utm_content: "social" }}
            className="rise-in group flex items-center justify-center"
            style={{ animationDelay: `${140 + i * 40}ms` }}
          >
            <div className="flex h-6 w-6 items-center justify-center text-muted transition-colors duration-200 group-hover:text-ink dark:text-muted dark:group-hover:text-ink">
              <SocialIcon type={link.type} />
            </div>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}

