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

export const profile = {
  name: "Sahil Fruitwala",
  handle: "@SahilBeingSahil",
  role: "Developer & Creator",
  avatarUrl: "/profile.webp",
  bio: "Building the future of digital expression, one pixel at a time.",
};

export const socialLinks: SocialLink[] = [
  {
    type: "twitter",
    label: "X (Twitter)",
    href: "https://inapp.app/sahil/twitter",
  },
  {
    type: "github",
    label: "GitHub",
    href: "https://github.com/SahilFruitwala",
  },
  {
    type: "youtube",
    label: "YouTube",
    href: "https://inapp.app/sahil/youtube",
  },
  {
    type: "linkedin",
    label: "LinkedIn",
    href: "https://inapp.app/sahil/linkedin",
  },
  {
    type: "instagram",
    label: "Instagram",
    href: "https://inapp.app/sahil/instagram",
  },
];

export const featuredLinks: FeaturedLink[] = [
  {
    label: "Personal Website",
    href: "https://sahilfruitwala.com/",
    description: "Blog & Thoughts",
    highlightKey: "blog",
    iconEmoji: "◈",
  },
];

export const links: LinkItem[] = [
  {
    label: "Cozydo",
    href: "https://apps.apple.com/ca/app/cozydo-calm-task-habits/id6774354264",
    description: "Calm Task & Habit Tracker",
    logoUrl: "/logos/cozydo.jpg",
    logoStyle: "app",
  },
  {
    label: "MicroPNG",
    href: "https://micropng.sahilfruitwala.com",
    description: "Compress, Convert & Resize Images",
    logoUrl: "/logos/micropng.webp",
    logoStyle: "app",
  },
  // {
  //   label: "InfiniteResume",
  //   href: "https://infiniteresume.sahilfruitwala.com",
  //   description: "Generate & Optimize Your Resume",
  //   iconEmoji: "◍",
  // },
];

export const newsletter: NewsletterConfig = {
  provider: "beehiiv",
};

export const embeds: EmbedItem[] = [
  // {
  //   type: "youtube",
  //   title: "Latest YouTube video",
  //   src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  // },
];
