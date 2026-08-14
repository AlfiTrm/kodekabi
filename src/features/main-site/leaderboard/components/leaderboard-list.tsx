import type { LeaderboardEntry } from "../types/leaderboard";
import { LeaderboardRow } from "./leaderboard-row";

type LeaderboardListProps = {
  entries: LeaderboardEntry[];
  currentUser?: LeaderboardEntry;
};

export function LeaderboardList({ entries, currentUser }: LeaderboardListProps) {
  if (entries.length === 0 && !currentUser) {
    return (
      <div className="rounded-3xl border border-dashed border-border-strong bg-surface px-6 py-14 text-center">
        <p className="text-sm font-semibold text-foreground">Belum ada auditor dalam peringkat.</p>
        <p className="mt-2 text-xs text-foreground/45">Selesaikan kasus pertama untuk mencatat skor.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/8 bg-surface p-3 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-5">
      <ol className="space-y-1">
        {entries.map((entry) => <LeaderboardRow key={entry.rank} entry={entry} />)}
        {currentUser ? <li aria-hidden="true" className="h-2" /> : null}
        {currentUser ? <LeaderboardRow entry={currentUser} /> : null}
      </ol>
    </div>
  );
}
