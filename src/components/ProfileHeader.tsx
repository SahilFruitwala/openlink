import { profile } from "../config/openlink";

export function ProfileHeader() {
  return (
    <header className="w-full pt-24 pb-12">
      <div className="rise-in flex items-baseline gap-5" style={{ animationDelay: "0ms" }}>
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="h-14 w-14 shrink-0 self-center rounded-full object-cover"
          loading="eager"
        />
        <div>
          <h1 className="font-serif text-[38px] leading-[1.08] tracking-[-0.02em] text-ink dark:text-ink">
            {profile.name}
          </h1>
          <p className="mt-1.5 text-[14px] uppercase tracking-[0.14em] text-faint dark:text-faint">
            {profile.role}
          </p>
        </div>
      </div>

      <p
        className="rise-in mt-8 max-w-[460px] text-[17px] leading-[1.6] text-muted dark:text-muted"
        style={{ animationDelay: "120ms" }}
      >
        {profile.bio}
      </p>
    </header>
  );
}
