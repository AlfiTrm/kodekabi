import { IdentityPreview } from "@/src/shared/components/game/identity-preview";

import { profileBanner, profileDetective, profileStats } from "../data/profile";
import type { ProfileTitle } from "../types/profile";

type ProfileCardProps = {
  nickname: string;
  title: ProfileTitle;
};

export function ProfileCard({ nickname, title }: ProfileCardProps) {
  return (
    <div className="relative lg:-rotate-1">
      <span className="absolute right-3 top-[-13px] z-30 rounded-full bg-white px-3 py-1.5 text-[9px] font-bold text-button-ink shadow-lg">🔥 STREAK 7</span>
      <IdentityPreview nickname={nickname} detective={profileDetective} title={title} banner={profileBanner} stats={profileStats} showMetaCopy={false} />
    </div>
  );
}
