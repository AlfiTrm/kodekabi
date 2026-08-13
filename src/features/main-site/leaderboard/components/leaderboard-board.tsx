import type { LeaderboardEntry } from "../types/leaderboard";
import { LeaderboardList } from "./leaderboard-list";
import { LeaderboardPodium } from "./leaderboard-podium";

type LeaderboardBoardProps = {
  podiumEntries: LeaderboardEntry[];
  rankedEntries: LeaderboardEntry[];
  currentUser?: LeaderboardEntry;
};

export function LeaderboardBoard({ podiumEntries, rankedEntries, currentUser }: LeaderboardBoardProps) {
  return (
    <div className="space-y-8 sm:space-y-10">
      <section aria-label="Tiga peringkat teratas">
        <LeaderboardPodium entries={podiumEntries} />
      </section>

      <section aria-label="Peringkat keseluruhan">
        <LeaderboardList entries={rankedEntries} currentUser={currentUser} />
      </section>
    </div>
  );
}
