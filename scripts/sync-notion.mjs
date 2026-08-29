#!/usr/bin/env node
/**
 * Sync OpenLink content from a Notion database into src/config/content.json.
 *
 * Required env:
 *   NOTION_TOKEN        — Internal integration secret
 *   NOTION_DATABASE_ID  — Database ID (32-char hex, with or without dashes)
 *
 * See docs/NOTION.md for database property setup.
 */

import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_PATH = resolve(ROOT, "src/config/content.json");
const NOTION_VERSION = "2022-06-28";
const SITE_HOSTS = new Set(["openlink.sahilfruitwala.com", "localhost", "127.0.0.1"]);

function normalizeAssetUrl(url) {
  const v = (url || "").trim();
  if (!v || v.startsWith("/")) return v;
  try {
    const parsed = new URL(v);
    if (SITE_HOSTS.has(parsed.hostname)) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // Keep invalid URLs as-is so callers can surface them.
  }
  return v;
}

const SOCIAL_TYPES = new Set([
  "twitter",
  "github",
  "linkedin",
  "instagram",
  "youtube",
  "newsletter",
  "custom",
]);
const EMBED_TYPES = new Set(["youtube", "spotify", "podcast", "iframe"]);
const LOGO_STYLES = new Set(["app", "default"]);
const SECTIONS = new Set(["profile", "social", "featured", "project", "embed"]);

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing required env: ${name}`);
    process.exit(1);
  }
  return value;
}

function normalizeDatabaseId(id) {
  const bare = id.replace(/-/g, "");
  if (!/^[a-f0-9]{32}$/i.test(bare)) {
    console.error(`NOTION_DATABASE_ID looks invalid: ${id}`);
    process.exit(1);
  }
  return `${bare.slice(0, 8)}-${bare.slice(8, 12)}-${bare.slice(12, 16)}-${bare.slice(16, 20)}-${bare.slice(20)}`;
}

function prop(page, name) {
  return page.properties?.[name] ?? page.properties?.[name.toLowerCase()];
}

function plainText(richText = []) {
  return richText.map((t) => t.plain_text ?? "").join("").trim();
}

function getTitle(page) {
  const p = prop(page, "Name") ?? Object.values(page.properties || {}).find((x) => x?.type === "title");
  if (!p || p.type !== "title") return "";
  return plainText(p.title);
}

function getRichText(page, name) {
  const p = prop(page, name);
  if (!p) return "";
  if (p.type === "rich_text") return plainText(p.rich_text);
  if (p.type === "title") return plainText(p.title);
  return "";
}

function getUrl(page, name) {
  const p = prop(page, name);
  if (!p) return "";
  if (p.type === "url") return (p.url || "").trim();
  if (p.type === "rich_text") return plainText(p.rich_text);
  return "";
}

function getSelect(page, name) {
  const p = prop(page, name);
  if (!p) return "";
  if (p.type === "select") return (p.select?.name || "").trim().toLowerCase();
  if (p.type === "status") return (p.status?.name || "").trim().toLowerCase();
  if (p.type === "rich_text") return plainText(p.rich_text).trim().toLowerCase();
  return "";
}

function getNumber(page, name) {
  const p = prop(page, name);
  if (!p || p.type !== "number" || p.number == null) return Number.POSITIVE_INFINITY;
  return p.number;
}

function getCheckbox(page, name, defaultValue = true) {
  const p = prop(page, name);
  if (!p || p.type !== "checkbox") return defaultValue;
  return Boolean(p.checkbox);
}

function optionalString(value) {
  const v = (value || "").trim();
  return v || undefined;
}

async function notionFetch(path, token, init = {}) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.message || res.statusText;
    throw new Error(`Notion API ${res.status} ${path}: ${msg}`);
  }
  return body;
}

async function queryAllPages(token, databaseId) {
  const pages = [];
  let cursor;
  do {
    const body = await notionFetch(`/databases/${databaseId}/query`, token, {
      method: "POST",
      body: JSON.stringify({
        page_size: 100,
        start_cursor: cursor,
        sorts: [{ property: "Order", direction: "ascending" }],
      }),
    });
    pages.push(...(body.results || []));
    cursor = body.has_more ? body.next_cursor : undefined;
  } while (cursor);
  return pages;
}

function mapPage(page) {
  const section = getSelect(page, "Section");
  const enabled = getCheckbox(page, "Enabled", true);
  const order = getNumber(page, "Order");
  const label = getTitle(page);
  const href = getUrl(page, "URL");
  const description = optionalString(getRichText(page, "Description"));
  const badge = optionalString(getRichText(page, "Badge"));
  const highlightKey = optionalString(getRichText(page, "Highlight Key"));
  const iconEmoji = optionalString(getRichText(page, "Icon Emoji"));
  const logoUrl = optionalString(
    normalizeAssetUrl(getUrl(page, "Logo URL") || getRichText(page, "Logo URL")),
  );
  const logoStyleRaw = getSelect(page, "Logo Style");
  const logoStyle = LOGO_STYLES.has(logoStyleRaw) ? logoStyleRaw : undefined;
  const socialType = getSelect(page, "Social Type");
  const embedType = getSelect(page, "Embed Type");
  const handle = optionalString(getRichText(page, "Handle"));
  const role = optionalString(getRichText(page, "Role"));
  const avatarUrl = optionalString(
    normalizeAssetUrl(getUrl(page, "Avatar URL") || getRichText(page, "Avatar URL")),
  );

  return {
    id: page.id,
    section,
    enabled,
    order,
    label,
    href,
    description,
    badge,
    highlightKey,
    iconEmoji,
    logoUrl,
    logoStyle,
    socialType,
    embedType,
    handle,
    role,
    avatarUrl,
  };
}

function buildContent(pages, previous) {
  const rows = pages
    .map(mapPage)
    .filter((r) => r.enabled)
    .filter((r) => SECTIONS.has(r.section))
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));

  const profileRow = rows.find((r) => r.section === "profile");
  const profile = profileRow
    ? {
        name: profileRow.label || previous.profile.name,
        handle: profileRow.handle || previous.profile.handle,
        role: profileRow.role || previous.profile.role,
        avatarUrl: profileRow.avatarUrl || previous.profile.avatarUrl,
        bio: profileRow.description || previous.profile.bio,
      }
    : previous.profile;

  const socialLinks = rows
    .filter((r) => r.section === "social")
    .map((r) => {
      const type = SOCIAL_TYPES.has(r.socialType) ? r.socialType : "custom";
      if (!r.label || !r.href) {
        console.warn(`Skipping social row missing Name/URL: ${r.id}`);
        return null;
      }
      return { type, label: r.label, href: r.href };
    })
    .filter(Boolean);

  const featuredLinks = rows
    .filter((r) => r.section === "featured")
    .map((r) => {
      if (!r.label || !r.href) {
        console.warn(`Skipping featured row missing Name/URL: ${r.id}`);
        return null;
      }
      return {
        label: r.label,
        href: r.href,
        ...(r.description ? { description: r.description } : {}),
        ...(r.badge ? { badge: r.badge } : {}),
        ...(r.highlightKey ? { highlightKey: r.highlightKey } : {}),
        ...(r.iconEmoji ? { iconEmoji: r.iconEmoji } : {}),
        ...(r.logoUrl ? { logoUrl: r.logoUrl } : {}),
        ...(r.logoStyle ? { logoStyle: r.logoStyle } : {}),
      };
    })
    .filter(Boolean);

  const links = rows
    .filter((r) => r.section === "project")
    .map((r) => {
      if (!r.label || !r.href) {
        console.warn(`Skipping project row missing Name/URL: ${r.id}`);
        return null;
      }
      return {
        label: r.label,
        href: r.href,
        ...(r.description ? { description: r.description } : {}),
        ...(r.iconEmoji ? { iconEmoji: r.iconEmoji } : {}),
        ...(r.logoUrl ? { logoUrl: r.logoUrl } : {}),
        ...(r.logoStyle ? { logoStyle: r.logoStyle } : {}),
      };
    })
    .filter(Boolean);

  const embeds = rows
    .filter((r) => r.section === "embed")
    .map((r) => {
      const type = EMBED_TYPES.has(r.embedType) ? r.embedType : "iframe";
      if (!r.label || !r.href) {
        console.warn(`Skipping embed row missing Name/URL: ${r.id}`);
        return null;
      }
      return { type, title: r.label, src: r.href };
    })
    .filter(Boolean);

  // Safety: never wipe the page if Notion returned zero usable link rows.
  const hasAnyLinks =
    socialLinks.length > 0 || featuredLinks.length > 0 || links.length > 0;

  if (!hasAnyLinks) {
    throw new Error(
      "Notion returned no enabled social/featured/project rows. Refusing to overwrite content.json.",
    );
  }

  return {
    syncedAt: new Date().toISOString(),
    source: "notion",
    profile,
    socialLinks,
    featuredLinks,
    links,
    embeds,
  };
}

function stableStringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function main() {
  const token = requireEnv("NOTION_TOKEN");
  const databaseId = normalizeDatabaseId(requireEnv("NOTION_DATABASE_ID"));

  let previous;
  try {
    previous = JSON.parse(readFileSync(OUT_PATH, "utf8"));
  } catch {
    previous = {
      profile: {
        name: "",
        handle: "",
        role: "",
        avatarUrl: "/profile.webp",
        bio: "",
      },
      socialLinks: [],
      featuredLinks: [],
      links: [],
      embeds: [],
    };
  }

  console.log(`Querying Notion database ${databaseId}…`);
  let pages;
  try {
    pages = await queryAllPages(token, databaseId);
  } catch (err) {
    // Retry without sort if "Order" property is missing / mistyped.
    if (String(err.message).includes("Order")) {
      console.warn("Sort by Order failed; retrying without sort…");
      pages = [];
      let cursor;
      do {
        const body = await notionFetch(`/databases/${databaseId}/query`, token, {
          method: "POST",
          body: JSON.stringify({ page_size: 100, start_cursor: cursor }),
        });
        pages.push(...(body.results || []));
        cursor = body.has_more ? body.next_cursor : undefined;
      } while (cursor);
    } else {
      throw err;
    }
  }

  console.log(`Fetched ${pages.length} page(s).`);
  const next = buildContent(pages, previous);
  const nextText = stableStringify(next);

  const prevComparable = { ...previous, syncedAt: null };
  const nextComparable = { ...next, syncedAt: null };
  const changed =
    JSON.stringify(prevComparable) !== JSON.stringify(nextComparable);

  writeFileSync(OUT_PATH, nextText, "utf8");

  console.log(
    `Wrote ${OUT_PATH}` +
      `\n  social=${next.socialLinks.length}` +
      ` featured=${next.featuredLinks.length}` +
      ` projects=${next.links.length}` +
      ` embeds=${next.embeds.length}` +
      `\n  changed=${changed}`,
  );

  // Exit 0 always on success; workflow decides whether to commit.
  if (process.env.GITHUB_OUTPUT) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
