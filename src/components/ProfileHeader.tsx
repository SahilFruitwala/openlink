import { profile } from "../config/openlink";

export function ProfileHeader() {
  return (
    <header className="flex w-full flex-col items-center px-6 pt-10 pb-6 text-center">
      <div className="rise-in relative mb-5" style={{ animationDelay: "0ms" }}>
        <div className="profile-glow relative h-28 w-28 overflow-hidden rounded-[1.75rem] border-[3px] border-white bg-cream transition-transform hover:scale-[1.03] dark:border-white/10 dark:bg-zinc-900">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border-[3px] border-cream bg-primary text-[#1a1f2b] shadow-lg dark:border-[#131319] dark:text-[#131319]">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
      </div>

      <div className="rise-in space-y-1.5" style={{ animationDelay: "140ms" }}>
        <h1 className="font-display text-[26px] font-bold tracking-tight text-earth dark:text-earth">
          {profile.name}
        </h1>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-earth/45 dark:text-earth/50">
          // {profile.role}
        </p>
        <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-earth/10 px-3 py-1 dark:border-white/10">
          <span className="font-mono text-[11px] font-semibold tracking-tight text-earth/60 dark:text-earth/70">
            {profile.handle}
          </span>
        </div>
        <p className="mx-auto mt-4 max-w-[300px] text-[13px] font-medium leading-relaxed text-earth/65 dark:text-earth/80">
          {profile.bio}
        </p>
      </div>
    </header>
  );
}

