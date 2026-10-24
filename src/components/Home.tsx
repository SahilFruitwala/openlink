import { ProfileHeader } from "./ProfileHeader";
import { FeaturedLinks, LinkList } from "./Links";
import { NewsletterForm } from "./NewsletterForm";
import { EmbedsSection } from "./EmbedsSection";
import { Dock } from "./SocialRow";

export default function Home() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] px-5 pb-36 pt-10">
      <ProfileHeader />

      <main className="mt-5 flex flex-col gap-5">
        <FeaturedLinks />
        <LinkList />
        <NewsletterForm />
        <EmbedsSection />
      </main>

      <Dock />
    </div>
  );
}
