import { getTrustedImageUrl } from "@/src/features/main-site/_shared/utils/remote-media";
import { IdentityPreview } from "@/src/shared/components/game/identity-preview";

import { profileBanner } from "../data/profile";
import type { ProfileTitle, UserProfile } from "../types/profile";

export function ProfileCard({ profile, onEditNickname }: { profile: UserProfile; onEditNickname: () => void }) {
  const title: ProfileTitle = {
    id: "active-title",
    kind: "title",
    label: profile.title || "Auditor Baru",
    rarity: "starter",
    unlocked: true,
    unlockHint: "Gelar aktif",
    style: "recruit",
  };

  return (
    <div className="relative lg:-rotate-1">
      {profile.streak_count > 0 ? <span className="absolute right-3 top-[-13px] z-30 rounded-full bg-white px-3 py-1.5 text-[9px] font-bold text-button-ink shadow-lg">STREAK {profile.streak_count}</span> : null}
      <IdentityPreview
        nickname={profile.username}
        detective={{ name: profile.username, image: getTrustedImageUrl(profile.avatar_url) ?? "/mascot/mascot-jacket.webp" }}
        title={title}
        banner={profileBanner}
        stats={{ level: profile.current_level, cases: profile.cases_completed, reputation: Math.round(profile.auditor_reputation), accuracy: Math.round(profile.accuracy_percent) }}
        showMetaCopy={false}
        nicknameAction={<button type="button" onClick={onEditNickname} aria-label="Edit nickname" className="grid size-6 place-items-center rounded-full border border-white/45 bg-button-ink/20 text-xs text-white transition-colors hover:border-white hover:bg-button-ink/35">✎</button>}
      />
    </div>
  );
}
