import type { LeaderboardEntry } from "../types/leaderboard";
import { LeaderboardRow } from "./leaderboard-row";

type LeaderboardListProps = {
  entries: LeaderboardEntry[];
  currentUser: LeaderboardEntry;
};

export function LeaderboardList({ entries, currentUser }: LeaderboardListProps) {
  return (
    <div className="rounded-b-3xl border border-white/8 bg-surface p-3 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-5">
      <ol className="space-y-1">
        {entries.map((entry) => <LeaderboardRow key={entry.rank} entry={entry} />)}
        <li aria-hidden="true" className="h-2" />
        <LeaderboardRow entry={currentUser} />
      </ol>
    </div>
  );
}

