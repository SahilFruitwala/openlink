import { profile } from "../config/openlink";

export function ProfileHeader() {
  return (
    <header className="rise-in glass flex items-center gap-5 rounded-[32px] p-5">
      <img
        src={profile.avatarUrl}
        alt=""
        className="h-20 w-20 shrink-0 rounded-[22px] object-cover"
        loading="eager"
      />
      <div className="min-w-0">
        <h1 className="font-display text-[26px] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
          {profile.name}
        </h1>
        <p className="mt-1.5 text-[15px] font-semibold text-accent">{profile.role}</p>
        <p className="mt-2 text-[14px] leading-snug text-muted">{profile.bio}</p>
      </div>
    </header>
  );
}
