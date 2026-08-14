import type { UserLevelProgress } from "../types/profile";

export function LevelProgress({ progress }: { progress: UserLevelProgress }) {
  const percent = Math.min(100, Math.max(0, Number(progress.progress_percent) || 0));
  const isMaxLevel = progress.next_level_xp <= 0 || progress.remaining_xp <= 0;

  return (
    <section className="rounded-2xl border border-white/8 bg-surface p-5">
      <div className="flex justify-between gap-4 font-mono text-[8px] uppercase text-foreground/45"><span>{isMaxLevel ? `LV ${progress.current_level} tercapai` : `Menuju LV ${progress.next_level}`}</span><span>{progress.current_xp.toLocaleString("id-ID")}{isMaxLevel ? " XP" : `/${progress.next_level_xp.toLocaleString("id-ID")} XP`}</span></div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10"><span className="block h-full rounded-full bg-purple transition-[width] duration-500" style={{ width: `${percent}%` }} /></div>
      <p className="mt-3 text-[8px] text-foreground/35">{progress.next_unlock_text || (isMaxLevel ? "Semua progres level saat ini sudah tercapai." : `${progress.remaining_xp.toLocaleString("id-ID")} XP lagi menuju level berikutnya.`)}</p>
    </section>
  );
}
