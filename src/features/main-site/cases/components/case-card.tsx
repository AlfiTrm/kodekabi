import Link from "next/link";

import type { UserCase } from "../types/case";

const difficultyLabels: Record<string, string> = {
  low: "Mudah",
  medium: "Sedang",
  high: "Sulit",
};

function caseState(item: UserCase) {
  if (item.access_status === "locked") return { label: item.locked_reason || `Terbuka di level ${item.minimum_level}`, locked: true };
  if (item.progress_status === "completed") return { label: "Selesai", locked: false };
  if (["on_going", "ongoing", "in_progress"].includes(item.progress_status)) return { label: "Lanjutkan", locked: false };
  return { label: "Baru", locked: false };
}

export function CaseCard({ item }: { item: UserCase }) {
  const state = caseState(item);
  const difficulty = difficultyLabels[item.difficulty_level] ?? item.difficulty_level;

  const card = (
    <article className={`group flex h-full min-h-[21rem] flex-col overflow-hidden rounded-2xl border bg-surface transition-[transform,border-color,box-shadow] duration-300 ${state.locked ? "border-dashed border-border-strong opacity-70" : "border-white/8 hover:-translate-y-1 hover:rotate-1 hover:border-white/20 hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]"}`}>
      <div
        className="relative min-h-44 overflow-hidden bg-surface-muted bg-cover bg-center"
        style={item.thumbnail_url ? { backgroundImage: `url(${JSON.stringify(item.thumbnail_url)})` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-background/10 to-transparent" />
        <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-background/75 px-3 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
          {state.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 font-display text-xl font-bold leading-tight text-foreground">{item.title}</h2>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-foreground/55">{item.short_description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5 font-mono text-[9px] uppercase tracking-[0.08em] text-foreground/40">
          <span>{difficulty}</span>
          <span aria-hidden="true">·</span>
          <span>{item.estimated_duration_minutes} mnt</span>
          {item.minimum_level > 1 ? <><span aria-hidden="true">·</span><span>Lv {item.minimum_level}</span></> : null}
        </div>
      </div>
    </article>
  );

  if (state.locked) return card;

  return (
    <Link href={`/gameplay/start/${encodeURIComponent(item.case_id)}`} className="block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple">
      {card}
    </Link>
  );
}
