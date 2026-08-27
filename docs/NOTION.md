# Sync OpenLink content from Notion

Notion is the easiest CMS for this page: free, editable from phone/desktop, and no runtime dependency on the Notion API. A GitHub Action (or `npm run sync:notion`) pulls rows into `src/config/content.json`, which the site already imports.

## Why Notion (not ClickUp)

| | Notion | ClickUp |
|---|---|---|
| Editing links | Database table UI | Tasks / docs (awkward for a link list) |
| API | Simple database query | Heavier task model |
| Cost | Free personal plan | Free tier OK, but overkill |
| Maintenance | One database + two secrets | Similar secrets, more mapping |

## 1. Create the Notion database

Create a **full-page database** with these properties (names must match exactly):

| Property | Type | Notes |
|---|---|---|
| **Name** | Title | Link label (or profile display name) |
| **URL** | URL | Destination (`href`); embed iframe `src` for embeds |
| **Section** | Select | `profile` · `social` · `featured` · `project` · `embed` |
| **Order** | Number | Lower = higher on the page |
| **Enabled** | Checkbox | Uncheck to hide without deleting |
| **Description** | Text | Subtitle / bio (for `profile`) |
| **Social Type** | Select | `twitter` · `github` · `linkedin` · `instagram` · `youtube` · `newsletter` · `custom` |
| **Badge** | Text | Optional chip on featured links |
| **Highlight Key** | Text | Becomes `utm_content` on click |
| **Icon Emoji** | Text | e.g. `◈` when you have no logo |
| **Logo URL** | URL | `/logos/app.png` or remote image |
| **Logo Style** | Select | `app` · `default` |
| **Embed Type** | Select | `youtube` · `spotify` · `podcast` · `iframe` |
| **Handle** | Text | Profile only, e.g. `@SahilBeingSahil` |
| **Role** | Text | Profile only |
| **Avatar URL** | URL | Profile only; keep `/profile.webp` or a remote URL |

### Example rows

| Name | Section | URL | Order | Extra |
|---|---|---|---|---|
| Sahil Fruitwala | `profile` | _(empty)_ | 0 | Handle, Role, Description (bio), Avatar URL |
| X (Twitter) | `social` | `https://…` | 10 | Social Type = `twitter` |
| Personal Website | `featured` | `https://sahilfruitwala.com/` | 20 | Description, Highlight Key = `blog`, Icon Emoji |
| DuoCamRecorder | `project` | App Store URL | 30 | Description, Logo URL, Logo Style = `app` |

Newsletter signup stays in code (`openlink.ts`) because it needs Beehiiv API keys, not CMS text.

## 2. Create a Notion integration

1. Open [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. **New integration** → Internal → copy the **Internal Integration Secret** (`secret_…`)
3. Open your database page → **⋯** → **Connections** → connect the integration
4. Copy the database ID from the URL:

   `https://www.notion.so/workspace/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX?v=…`  
   → `NOTION_DATABASE_ID` is the 32-character hex block (dashes optional)

## 3. Local sync

```bash
export NOTION_TOKEN="secret_…"
export NOTION_DATABASE_ID="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
npm run sync:notion
```

This overwrites `src/config/content.json`. Commit the file if you want the change in git immediately.

## 4. GitHub Action

Repo → **Settings** → **Secrets and variables** → **Actions** → add:

- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

Workflow: [`.github/workflows/sync-links.yml`](../.github/workflows/sync-links.yml)

- Runs every **6 hours** and on **Run workflow** (manual)
- Commits `src/config/content.json` when Notion content changed
- Your existing Cloudflare/git deploy picks up the commit

## Safety

- Rows with **Enabled** unchecked are skipped
- If Notion returns **no** social/featured/project rows, the script **refuses** to overwrite (avoids wiping the live page)
- Without secrets configured, the site keeps working from the committed seed `content.json`
