"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SiteContainer } from "@/src/shared/components/layout/site-container";
import type { UserProfileResponse } from "../types/profile";
import type { UserTitle } from "../types/profile";
import type { ShopItem } from "../../shop/types/shop";
import { AccountPanel } from "./account-panel";
import { CaseHistory } from "./case-history";
import { DetectiveStatistics } from "./detective-statistics";
import { LevelProgress } from "./level-progress";
import { LogoutModal } from "./logout-modal";
import { ProfileCard } from "./profile-card";
import { EditProfileModal } from "./edit-profile-modal";
import { updateNicknameAction } from "../actions/update-nickname-action";
import { TitleCollection } from "./title-collection";
import { InventoryCollection } from "./inventory-collection";

export function ProfileContent({ data, titles, inventory }: { data: UserProfileResponse; titles: UserTitle[]; inventory: ShopItem[] }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const stats = Array.isArray(data.stats) ? data.stats : [];
  const history = Array.isArray(data.case_history?.items) ? data.case_history.items : [];
  return <>
    <main className="min-h-screen flex-1 bg-background pb-16 pt-24 sm:pt-28"><SiteContainer><div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]"><div className="space-y-4"><ProfileCard profile={data.profile} onEditNickname={() => { setNicknameMessage(null); setEditing(true); }} /><LevelProgress progress={data.level_progress} /><AccountPanel account={data.account} coinBalance={data.profile.coin_balance} onLogout={() => setLoggingOut(true)} /></div><div className="space-y-4"><DetectiveStatistics stats={stats} /><TitleCollection titles={titles} /><InventoryCollection items={inventory} /><CaseHistory items={history} /></div></div></SiteContainer></main>
    {editing ? <EditProfileModal initialNickname={data.profile.username} onClose={() => { if (!pending) setEditing(false); }} onSave={(nickname: string) => { startTransition(async () => { const result = await updateNicknameAction(nickname); if (result.success) { setEditing(false); router.refresh(); } else setNicknameMessage(result.message); }); }} /> : null}
    {nicknameMessage ? <p role="alert" className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-full border border-red/30 bg-red/10 px-5 py-3 text-xs text-red">{nicknameMessage}</p> : null}
    {loggingOut ? <LogoutModal onClose={() => setLoggingOut(false)} /> : null}
  </>;
}
