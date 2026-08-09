import type { CaseItem } from "../types/case";

const toneClasses: Record<CaseItem["tone"], string> = {
  red: "bg-red",
  purple: "bg-purple",
  green: "bg-green",
  blue: "bg-blue",
  orange: "bg-orange-shadow",
  muted: "bg-surface-muted",
};

type CaseCardProps = {
  item: CaseItem;
};

export function CaseCard({ item }: CaseCardProps) {
  const locked = item.status === "locked";

  return (
    <article className={`group flex min-h-80 flex-col overflow-hidden rounded-2xl border bg-surface transition-[transform,border-color,box-shadow] duration-300 ${locked ? "border-dashed border-border-strong opacity-65" : "border-white/8 hover:-translate-y-1 hover:rotate-1 hover:border-white/20 hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]"}`}>
      <div className={`relative min-h-40 p-5 ${toneClasses[item.tone]}`}>
        <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-button-ink/55">{item.category}</p>
        <h2 className={`mt-2 font-display text-2xl font-bold uppercase leading-[0.9] tracking-[-0.04em] ${locked ? "text-foreground/75" : "text-white"}`}>{item.headline}</h2>
        <span className="absolute right-4 top-4 rounded-full bg-white px-2.5 py-1 text-[9px] font-bold text-button-ink">◆ {item.rating}</span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xs font-bold text-foreground">{item.title}</h3>
        <p className="mt-2 text-[10px] leading-relaxed text-foreground/50">{item.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[8px] uppercase tracking-[0.1em] text-foreground/35">
          <span>{item.difficulty}</span>
          {item.duration > 0 ? <><span>·</span><span>{item.duration} mnt</span></> : null}
          {item.xp > 0 ? <><span>·</span><span>+{item.xp} XP</span></> : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          {item.progress !== undefined ? (
            <div className="flex flex-1 items-center gap-2">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                <span className="block h-full rounded-full bg-purple" style={{ width: `${item.progress}%` }} />
              </span>
              <span className="text-[8px] font-bold text-purple">{item.progress}%</span>
            </div>
          ) : <span />}
          {item.badge ? <span className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase ${locked ? "bg-surface-muted text-foreground/40" : "bg-foreground/10 text-foreground/70"}`}>{item.badge}</span> : null}
        </div>
      </div>
    </article>
  );
}
