# Contributing to OpenLink

Thanks for your interest in contributing. This document explains how to get set up and submit changes.

## What is OpenLink?

OpenLink is a minimal link-in-bio page: profile, social links, featured links, newsletter (Beehiiv), and embeds, with optional PostHog analytics and UTM tracking. Page content lives in `src/config/content.json` (optionally synced from Notion — see [docs/NOTION.md](docs/NOTION.md)).

## Prerequisites

- **Node.js** 18+ (or use [Bun](https://bun.sh))
- **Git**

## Getting set up

1. **Clone the repo** (replace with your fork if you contribute via fork):

   ```bash
   git clone https://github.com/your-org/OpenLink.git
   cd OpenLink
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or: pnpm install / yarn / bun install
   ```

3. **Environment (optional):**  
   Copy `.env.example` to `.env.local` and add any keys you need for local testing (PostHog, Beehiiv). The app runs without them; see [README.md](README.md) for details.

4. **Run the dev server:**

   ```bash
   npm run dev
   # or: pnpm dev / yarn dev / bun dev
   ```

   Open [http://localhost:4321](http://localhost:4321). Edit Notion (preferred) or `src/config/content.json` to change links.

## Project structure

- **`src/config/content.json`** — Profile, social, featured, project links, embeds (synced from Notion).
- **`src/config/openlink.ts`** — Types + re-exports from `content.json`; newsletter config stays here.
- **`scripts/sync-notion.mjs`** — Pulls Notion → `content.json`.
- **`.github/workflows/sync-links.yml`** — Scheduled / manual Notion sync.
- **`src/pages/`** — Astro pages + newsletter API route.
- **`src/components/`** — UI: ProfileHeader, SocialRow, Links, NewsletterForm, ThemeToggle, TrackedLink, EmbedsSection.
- **`src/lib/`** — Utilities: PostHog client, UTM/tracking helpers.

## How to contribute

### Reporting bugs

- Open an issue with a clear title and steps to reproduce.
- Include your environment (Node version, OS) if relevant.

### Suggesting features

- Open an issue describing the use case and proposed behavior.
- For larger changes, discuss in an issue before sending a big PR.

### Submitting code

1. **Fork the repo** (if you don’t have write access) and create a branch from `main`:

   ```bash
   git checkout -b fix/short-description
   # or: feature/short-description
   ```

2. **Make your changes.**  
   Keep edits focused; avoid unrelated style or refactors in the same PR.

3. **Lint and typecheck:**

   ```bash
   npm run lint
   npx tsc --noEmit
   ```

4. **Commit** with a clear message (e.g. “Fix newsletter form reset after success”, “Add CONTRIBUTING docs”).

5. **Push** your branch and open a **Pull Request** against `main`.  
   Describe what changed and why; link any related issues.

## Code style

- **TypeScript:** Strict mode is on. Use types for function args and return values where it helps.
- **Linting:** ESLint is configured via `eslint-config-next`. Run `npm run lint` and fix reported issues.
- **Formatting:** No formatter is enforced in CI; please keep style consistent with the rest of the file (indentation, quotes).
- **Components:** Prefer functional components and hooks. Keep components small; split by concern when they grow.

## What we’re looking for

- Bug fixes and clearer error handling.
- Documentation improvements (README, CONTRIBUTING, code comments).
- Small, focused features that fit the “minimal link page” scope.
- Accessibility and performance improvements.

If you’re unsure whether a change fits, open an issue first and we can align.
