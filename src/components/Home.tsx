import { ProfileHeader } from "./ProfileHeader";
import { SocialRow } from "./SocialRow";
import { FeaturedLinks, LinkList } from "./Links";
import { NewsletterForm } from "./NewsletterForm";
import { EmbedsSection } from "./EmbedsSection";
import { ThemeToggle } from "./ThemeToggle";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center">
      <main className="relative flex h-full min-h-screen w-full max-w-[560px] flex-col overflow-x-hidden px-7 pb-28">
        <div className="fixed bottom-6 right-6 z-50">
          <ThemeToggle />
        </div>

        <ProfileHeader />
        <SocialRow />
        <FeaturedLinks />
        <LinkList />
        <NewsletterForm />
        <EmbedsSection />
      </main>
    </div>
  );
}
