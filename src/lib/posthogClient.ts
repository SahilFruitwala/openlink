import posthog from "posthog-js";

let initialized = false;

export function initPosthog() {
  if (initialized || typeof window === "undefined") return;

  // Astro uses import.meta.env for env vars
  const isDev = import.meta.env.DEV;
  if (isDev) {
    initialized = true;
    return;
  }

  const key = import.meta.env.PUBLIC_POSTHOG_KEY;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!key) {
    initialized = true;
    return;
  }

  posthog.init(key, {
    api_host: host,
    capture_pageview: false,
    autocapture: true,
  });

  initialized = true;
}

export { posthog };

