import type { APIRoute } from "astro";

const BEEHIIV_API = "https://api.beehiiv.com/v2";

type BeehiivCredentials = {
  apiKey?: string;
  publicationId?: string;
};

/** Dev reads `.env`; production reads Cloudflare Worker secrets at request time. */
async function getBeehiivCredentials(): Promise<BeehiivCredentials> {
  if (import.meta.env.DEV) {
    return {
      apiKey: import.meta.env.BEEHIIV_API_KEY,
      publicationId: import.meta.env.BEEHIIV_PUBLICATION_ID,
    };
  }

  const { env } = await import("cloudflare:workers");
  return {
    apiKey: env.BEEHIIV_API_KEY,
    publicationId: env.BEEHIIV_PUBLICATION_ID,
  };
}

function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 254) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.trim());
}

export const POST: APIRoute = async ({ request }) => {
  const { apiKey, publicationId } = await getBeehiivCredentials();

  if (!apiKey || !publicationId) {
    return new Response(
      JSON.stringify({ error: "Newsletter is not configured." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const email = body.email;
  if (!isValidEmail(email)) {
    return new Response(
      JSON.stringify({ error: "A valid email is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const payload: Record<string, unknown> = {
    email: (email as string).trim().toLowerCase(),
    send_welcome_email: true,
  };

  const optionalFields = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "referring_site",
  ] as const;
  for (const key of optionalFields) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) {
      payload[key] = value.trim();
    }
  }

  const url = `${BEEHIIV_API}/publications/${publicationId}/subscriptions`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const contentType = response.headers.get("content-type");
  let errorMessage = "Subscription failed. Please try again.";
  if (contentType?.includes("application/json")) {
    try {
      const data = (await response.json()) as { message?: string; error?: string };
      const msg = data.message ?? data.error;
      if (typeof msg === "string" && msg.length < 200) {
        errorMessage = msg;
      }
    } catch {
      // keep default
    }
  }

  const status = response.status >= 500 ? 502 : response.status;
  return new Response(
    JSON.stringify({ error: errorMessage }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}
