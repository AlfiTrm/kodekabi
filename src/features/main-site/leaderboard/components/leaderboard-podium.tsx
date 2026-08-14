import { AuditorAvatar } from "./auditor-avatar";
import type { LeaderboardEntry } from "../types/leaderboard";

const podiumStyles = {
  1: { order: "order-2", height: "h-44 sm:h-56", color: "bg-purple", crown: true },
  2: { order: "order-1", height: "h-32 sm:h-40", color: "bg-blue", crown: false },
  3: { order: "order-3", height: "h-28 sm:h-36", color: "bg-orange-shadow", crown: false },
} as const;

type LeaderboardPodiumProps = {
  entries: LeaderboardEntry[];
};

export function LeaderboardPodium({ entries }: LeaderboardPodiumProps) {
  return (
    <div className="grid grid-cols-3 items-end gap-1 sm:gap-3">
      {entries.map((entry) => {
        const style = podiumStyles[entry.rank as keyof typeof podiumStyles];
        if (!style) return null;
        return (
          <article key={entry.rank} className={`flex min-w-0 flex-col items-center ${style.order}`}>
            <div className="relative flex flex-col items-center">
              {style.crown ? <span className="absolute -top-7 text-xl text-orange" aria-label="Peringkat pertama">♛</span> : null}
              <AuditorAvatar entry={entry} large />
              <p className="mt-2 max-w-full truncate text-[9px] font-bold text-foreground sm:text-xs">{entry.username}</p>
            </div>
            <div className={`mt-3 flex w-full flex-col items-center rounded-3xl px-2 pt-6 text-button-ink shadow-[0_18px_45px_rgba(0,0,0,0.2)] ${style.height} ${style.color}`}>
              <strong className="font-display text-4xl font-bold text-white sm:text-6xl">{entry.rank}</strong>
              <span className="mt-2 font-mono text-[9px] sm:text-xs">{entry.points.toLocaleString("id-ID")} PTS</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
