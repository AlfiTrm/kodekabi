import type { LeaderboardEntry } from "../types/leaderboard";

const toneClasses: Record<LeaderboardEntry["tone"], string> = {
  blue: "border-blue bg-blue/20 text-blue",
  purple: "border-purple bg-purple/25 text-purple",
  orange: "border-orange-shadow bg-orange/20 text-orange",
  red: "border-red bg-red/20 text-red",
  green: "border-green bg-green/20 text-green",
};

type AuditorAvatarProps = {
  entry: LeaderboardEntry;
  large?: boolean;
};

export function AuditorAvatar({ entry, large = false }: AuditorAvatarProps) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-2xl border-2 font-display font-bold ${toneClasses[entry.tone]} ${large ? "size-16 text-2xl sm:size-20 sm:text-3xl" : "size-9 text-xs"}`}>
      {entry.initial}
    </span>
  );
}

