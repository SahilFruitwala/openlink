"use client";

import { useState } from "react";
import { newsletter } from "../config/openlink";
import { posthog } from "../lib/posthogClient";
import { getTrackingContext } from "../lib/tracking";
import { SectionHeader } from "./SectionHeader";

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
    <section aria-label="Newsletter signup" className="pt-2">
      <SectionHeader index="04" label="Stay looped" />
      <div className="card relative mt-2 flex w-full flex-col overflow-hidden rounded-[1.75rem] p-6">
      <div className="relative z-10 space-y-2 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-earth/10 bg-primary/10 text-primary dark:border-white/10 dark:bg-primary/15">
          <span className="text-xl">✉️</span>
        </div>
        <h2 className="font-display text-lg font-bold tracking-tight text-earth dark:text-earth">
          Join the Inner Circle
        </h2>
        <p className="mx-auto max-w-[280px] text-xs font-medium leading-relaxed text-earth/60 dark:text-earth/70">
          Exclusive updates about what I&apos;m building, reading, and learning.
        </p>
      </div>

      {success ? (
        <div className="relative z-10 mt-6 space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-primary dark:text-primary">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">✓</span>
            You&apos;re on the list!
          </div>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setError(null);
            }}
            className="text-[11px] font-bold uppercase tracking-widest text-earth/40 hover:text-primary dark:text-earth/50"
          >
            Use another email
          </button>
        </div>
      ) : (
        <form
          action={isBeehiiv ? undefined : newsletter.action}
          method={isBeehiiv ? undefined : newsletter.method ?? "POST"}
          onSubmit={handleSubmit}
          className="relative z-10 mt-6 flex flex-col gap-3"
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
            placeholder="Enter your email"
            disabled={submitting}
            className="
              h-12 w-full appearance-none rounded-2xl
              bg-earth/[0.03] px-4 text-sm font-semibold text-earth
              placeholder:text-earth/35 placeholder:font-medium
              border border-earth/10
              focus:border-primary/50
              focus:outline-none
              dark:bg-white/5
              dark:border-white/10
              dark:placeholder:text-earth/35
              disabled:opacity-60
              transition-all"
          />
          <button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-2xl bg-earth px-4 font-mono text-xs font-semibold uppercase tracking-widest text-cream shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 dark:bg-primary dark:text-[#131319]"
          >
            {submitting ? "Joining..." : "Subscribe"}
          </button>
        </form>
      )}
      {error && (
        <p className="relative z-10 mt-3 text-center text-[11px] font-bold text-stamp/90">
          {error}
        </p>
      )}
      </div>
    </section>
  );
}
