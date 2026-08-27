import content from "./content.json";

export type SocialType =
  | "twitter"
  | "github"
  | "linkedin"
  | "instagram"
  | "youtube"
  | "newsletter"
  | "custom";

export type SocialLink = {
  type: SocialType;
  label: string;
  href: string;
};

export type LogoStyle = "app" | "default";

export type FeaturedLink = {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  highlightKey?: string;
  iconEmoji?: string;
  /** Local path (e.g. /logos/app.png) or remote URL for a link logo. */
  logoUrl?: string;
  /** "app" rounds corners like an iOS/Android icon; "default" fits the image as-is. */
  logoStyle?: LogoStyle;
};

export type LinkItem = {
  label: string;
  href: string;
  description?: string;
  iconEmoji?: string;
  /** Local path (e.g. /logos/app.png) or remote URL for a link logo. */
  logoUrl?: string;
  /** "app" rounds corners like an iOS/Android icon; "default" fits the image as-is. */
  logoStyle?: LogoStyle;
};

export type NewsletterConfig = {
  provider: "beehiiv" | "substack" | "custom";
  /** Required when provider is "custom"; ignored for "beehiiv" (uses API route). */
  action?: string;
  method?: "POST" | "GET";
  hiddenFields?: Record<string, string>;
};

export type EmbedType = "youtube" | "spotify" | "podcast" | "iframe";

export type EmbedItem = {
  type: EmbedType;
  title: string;
  src: string;
};

export type Profile = {
  name: string;
  handle: string;
  role: string;
  avatarUrl: string;
  bio: string;
};

export type OpenLinkContent = {
  syncedAt: string | null;
  source: string;
  profile: Profile;
  socialLinks: SocialLink[];
  featuredLinks: FeaturedLink[];
  links: LinkItem[];
  embeds: EmbedItem[];
};

/** Link/page content. Synced from Notion via `npm run sync:notion` / GitHub Action. */
export const profile = content.profile as Profile;
export const socialLinks = content.socialLinks as SocialLink[];
export const featuredLinks = content.featuredLinks as FeaturedLink[];
export const links = content.links as LinkItem[];
export const embeds = content.embeds as EmbedItem[];

/** Newsletter stays local — needs Beehiiv API keys, not CMS content. */
export const newsletter: NewsletterConfig = {
  provider: "beehiiv",
};
