import { ProfileHeader } from "./ProfileHeader";
import { SocialRow } from "./SocialRow";
import { FeaturedLinks, LinkList } from "./Links";
import { NewsletterForm } from "./NewsletterForm";
import { EmbedsSection } from "./EmbedsSection";
import { ThemeToggle } from "./ThemeToggle";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center text-earth">
      <main className="relative flex h-full min-h-screen w-full max-w-[430px] flex-col overflow-x-hidden pb-24">
        <div className="fixed bottom-6 right-6 z-50">
          <ThemeToggle />
        </div>

        <ProfileHeader />

        <div className="space-y-6 px-4">
          <SocialRow />
          <FeaturedLinks />
          <LinkList />
          <NewsletterForm />
          <EmbedsSection />
        </div>

        <footer className="mt-10 px-4 text-center">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-earth/30 dark:text-earth/30">
            — end of manifest —
          </p>
        </footer>
      </main>
    </div>
  );
}
