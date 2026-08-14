import Image from "next/image";

import { getTrustedImageUrl } from "../../_shared/utils/remote-media";
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
  const avatarUrl = getTrustedImageUrl(entry.avatarUrl);

  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden rounded-2xl border-2 font-display font-bold ${toneClasses[entry.tone]} ${large ? "size-16 text-2xl sm:size-20 sm:text-3xl" : "size-9 text-xs"}`}>
      {avatarUrl ? <Image src={avatarUrl} alt="" fill sizes={large ? "80px" : "36px"} className="object-contain" /> : entry.initial}
    </span>
  );
}
