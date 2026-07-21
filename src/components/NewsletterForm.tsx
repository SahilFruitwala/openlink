"use client";

import { useState } from "react";
import { newsletter } from "../config/openlink";
import { posthog } from "../lib/posthogClient";
import { getTrackingContext } from "../lib/tracking";

function showNewsletterSection(): boolean {
  if (newsletter.provider === "beehiiv") return true;
  if (newsletter.provider === "custom" && newsletter.action) return true;
  return false;
}

export function NewsletterForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!showNewsletterSection()) return null;

  const isBeehiiv = newsletter.provider === "beehiiv";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    if (isBeehiiv) {
      setError(null);
      setSubmitting(true);
      const form = e.currentTarget;
      const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
      const email = emailInput?.value?.trim() ?? "";
      if (!email) {
        setSubmitting(false);
        return;
      }

      const context = getTrackingContext();
      const body: Record<string, string> = { email };
      if (context?.utm) {
        if (context.utm.utm_source) body.utm_source = context.utm.utm_source;
        if (context.utm.utm_medium) body.utm_medium = context.utm.utm_medium;
        if (context.utm.utm_campaign) body.utm_campaign = context.utm.utm_campaign;
        if (context.utm.utm_term) body.utm_term = context.utm.utm_term;
        if (context.utm.utm_content) body.utm_content = context.utm.utm_content;
      }
      if (context?.referrerHost) body.referring_site = context.referrerHost;

      try {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };

        if (res.ok) {
          setSuccess(true);
          posthog.capture("newsletter_submit", {
            ...context?.utm,
            app: context?.app,
            sourcePlatform: context?.sourcePlatform,
            referrerHost: context?.referrerHost,
          });
        } else {
          setError(data.error ?? "Something went wrong. Please try again.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Custom provider: allow native form submit; track then submit
    setSubmitting(true);
    const context = getTrackingContext();
    posthog.capture("newsletter_submit", {
      ...context?.utm,
      app: context?.app,
      sourcePlatform: context?.sourcePlatform,
      referrerHost: context?.referrerHost,
    });
    (e.currentTarget as HTMLFormElement).submit();
  };

  return (
    <section aria-label="Newsletter signup">
      <div className="relative flex w-full flex-col pt-12">
      <div className="relative z-10">
        <h3 className="font-serif text-[24px] font-medium leading-tight text-ink dark:text-ink">
          Join the Inner Circle
        </h3>
        <p className="mt-2 max-w-[420px] text-[15px] leading-relaxed text-muted dark:text-muted">
          Exclusive updates about what I&apos;m building, reading, and learning.
        </p>
      </div>

      {success ? (
        <div className="relative z-10 mt-4 space-y-1.5">
          <p className="font-serif text-[18px] font-medium text-ink dark:text-ink">
            You&apos;re on the list.
          </p>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setError(null);
            }}
            className="text-[14px] text-muted underline decoration-transparent underline-offset-[3px] transition-colors hover:decoration-current dark:text-muted"
          >
            Use another email
          </button>
        </div>
      ) : (
        <form
          action={isBeehiiv ? undefined : newsletter.action}
          method={isBeehiiv ? undefined : newsletter.method ?? "POST"}
          onSubmit={handleSubmit}
          className="relative z-10 mt-4 flex flex-col gap-2 sm:flex-row"
        >
          {!isBeehiiv && newsletter.hiddenFields &&
            Object.entries(newsletter.hiddenFields).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          <input
            id="newsletter-email"
            aria-label="Email for newsletter"
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            disabled={submitting}
            className="
              h-[52px] sm:h-11 w-full sm:flex-1 appearance-none rounded-md
              bg-fill px-4 text-[16px] sm:text-[15px] text-ink
              placeholder:text-faint
              border border-transparent
              focus:border-accent
              focus:outline-none
              disabled:opacity-60
              transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="h-[52px] sm:h-11 shrink-0 rounded-md bg-accent px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-60"
          >
            {submitting ? "Joining…" : "Subscribe"}
          </button>
        </form>
      )}
      {error && (
        <p className="relative z-10 mt-2.5 text-[14px] text-muted dark:text-muted">
          {error}
        </p>
      )}
      </div>
    </section>
  );
}
