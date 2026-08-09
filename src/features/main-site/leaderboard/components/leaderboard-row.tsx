import Image from "next/image";

import type { LeaderboardEntry } from "../types/leaderboard";
import { AuditorAvatar } from "./auditor-avatar";

type LeaderboardRowProps = {
  entry: LeaderboardEntry;
};

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  return (
    <li className={`grid min-h-14 grid-cols-[2rem_2.25rem_minmax(0,1fr)_auto] items-center gap-2 rounded-xl px-3 text-[10px] sm:grid-cols-[2.5rem_2.5rem_minmax(0,1fr)_4rem_5rem] sm:gap-3 sm:px-4 sm:text-xs ${entry.currentUser ? "border-2 border-purple bg-purple/10" : "border-2 border-transparent"}`}>
      <span className={`font-display font-bold ${entry.currentUser ? "text-purple" : "text-foreground/45"}`}>{entry.rank}</span>
      {entry.currentUser ? (
        <span className="flex size-9 items-end justify-center overflow-hidden rounded-xl bg-white">
          <Image src="/mascot/mascot-jacket.webp" alt="" width={40} height={40} className="h-9 w-auto object-contain" />
        </span>
      ) : <AuditorAvatar entry={entry} />}
      <p className="truncate font-semibold text-foreground">{entry.username}{entry.currentUser ? <span className="ml-1 text-[8px] text-purple">(kamu)</span> : null}</p>
      <span className="hidden w-fit rounded-full bg-purple/15 px-2 py-1 text-[8px] font-bold text-purple sm:inline-flex">LV {entry.level}</span>
      <span className={`text-right font-mono font-bold ${entry.currentUser ? "text-purple" : "text-foreground"}`}>{entry.points.toLocaleString("id-ID")}</span>
    </li>
  );
}

