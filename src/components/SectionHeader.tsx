type SectionHeaderProps = {
  index: string;
  label: string;
};

export function SectionHeader({ index, label }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-1 pb-1">
      <span className="font-mono text-[10px] font-semibold tracking-[0.1em] text-primary">
        §{index}
      </span>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-earth/40 dark:text-earth/45">
        {label}
      </span>
      <span className="h-px flex-1 bg-earth/10 dark:bg-earth/15" />
    </div>
  );
}
