# OpenLink

Minimal link-in-bio page (Astro + Cloudflare). Profile, social icons, featured/project links, Beehiiv newsletter, optional embeds, PostHog + UTM tracking.

Want to contribute? See **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Getting Started

```bash
bun install   # or npm install
bun run dev   # http://localhost:4321
```

### Editing links (Notion)

Prefer editing a Notion database; a GitHub Action syncs it into `src/config/content.json` every 6 hours (or on demand).

Full setup: **[docs/NOTION.md](docs/NOTION.md)**

```bash
export NOTION_TOKEN="secret_…"
export NOTION_DATABASE_ID="…"
bun run sync:notion
```

Repo secrets for the Action: `NOTION_TOKEN`, `NOTION_DATABASE_ID`.

You can also edit `src/config/content.json` directly; the site keeps working without Notion configured.

### PostHog analytics

Set in `.env` (see `.env.example`):

- `PUBLIC_POSTHOG_KEY` — Project API key
- `PUBLIC_POSTHOG_HOST` — Optional (EU / self-hosted)

### Newsletter (Beehiiv)

- `BEEHIIV_API_KEY`
- `BEEHIIV_PUBLICATION_ID`

If either is missing, the form is hidden and `POST /api/newsletter` returns 503.

## Deploy

Built for Cloudflare Workers (`astro build` + Wrangler). See `wrangler.jsonc`.
