#!/usr/bin/env node
/**
 * Validate src/config/content.json before it is committed or deployed.
 * Exits non-zero with a list of problems so CI fails instead of shipping a broken page.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (msg) => errors.push(msg);

let content;
try {
  content = JSON.parse(readFileSync(resolve(ROOT, "src/config/content.json"), "utf8"));
} catch (err) {
  console.error(`content.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

const LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

function checkUrl(where, value, { protocols = LINK_PROTOCOLS } = {}) {
  try {
    if (!protocols.has(new URL(value).protocol)) fail(`${where}: unsupported protocol in "${value}"`);
  } catch {
    fail(`${where}: not an absolute URL: "${value}"`);
  }
}

function checkAsset(where, value) {
  if (!value) return;
  if (value.startsWith("/")) {
    const file = resolve(ROOT, "public", `.${value.split(/[?#]/)[0]}`);
    if (!existsSync(file)) fail(`${where}: file not found in public/: ${value}`);
  } else {
    checkUrl(where, value, { protocols: new Set(["https:"]) });
  }
}

const { profile } = content;
if (!profile?.name?.trim()) fail("profile.name is empty");
if (!profile?.role?.trim()) fail("profile.role is empty");
checkAsset("profile.avatarUrl", profile?.avatarUrl);

for (const key of ["socialLinks", "featuredLinks", "links", "embeds"]) {
  if (!Array.isArray(content[key])) fail(`${key} must be an array`);
}

const SOCIAL = new Set(["twitter", "github", "linkedin", "instagram", "youtube", "newsletter", "custom"]);
for (const [i, l] of (content.socialLinks ?? []).entries()) {
  const where = `socialLinks[${i}] ${l.label ?? ""}`;
  if (!l.label) fail(`${where}: missing label`);
  if (!SOCIAL.has(l.type)) fail(`${where}: unknown type "${l.type}"`);
  checkUrl(where, l.href ?? "");
}

for (const key of ["featuredLinks", "links"]) {
  const seen = new Set();
  for (const [i, l] of (content[key] ?? []).entries()) {
    const where = `${key}[${i}] ${l.label ?? ""}`;
    if (!l.label) fail(`${where}: missing label`);
    if (seen.has(l.label)) fail(`${where}: duplicate label (used as a React key)`);
    seen.add(l.label);
    checkUrl(where, l.href ?? "");
    checkAsset(`${where}.logoUrl`, l.logoUrl);
    if (l.logoStyle && !["app", "default"].includes(l.logoStyle)) fail(`${where}: bad logoStyle`);
  }
}

for (const [i, e] of (content.embeds ?? []).entries()) {
  const where = `embeds[${i}] ${e.title ?? ""}`;
  if (!e.title) fail(`${where}: missing title`);
  checkUrl(where, e.src ?? "", { protocols: new Set(["https:"]) });
}

if (errors.length) {
  console.error(`content.json has ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("content.json is valid.");
