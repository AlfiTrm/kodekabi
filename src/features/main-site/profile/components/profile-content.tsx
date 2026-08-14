"use client";

import { useState } from "react";
import { SiteContainer } from "@/src/shared/components/layout/site-container";
import type { UserProfileResponse } from "../types/profile";
import { AccountPanel } from "./account-panel";
import { CaseHistory } from "./case-history";
import { DetectiveStatistics } from "./detective-statistics";
import { LevelProgress } from "./level-progress";
import { LogoutModal } from "./logout-modal";
import { ProfileCard } from "./profile-card";

export function ProfileContent({ data }: { data: UserProfileResponse }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const stats = Array.isArray(data.stats) ? data.stats : [];
  const history = Array.isArray(data.case_history?.items) ? data.case_history.items : [];
  return <>
    <main className="min-h-screen flex-1 bg-background pb-16 pt-24 sm:pt-28"><SiteContainer><div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]"><div className="space-y-4"><ProfileCard profile={data.profile} /><LevelProgress progress={data.level_progress} /><AccountPanel account={data.account} coinBalance={data.profile.coin_balance} onLogout={() => setLoggingOut(true)} /></div><div className="space-y-4"><DetectiveStatistics stats={stats} /><CaseHistory items={history} /></div></div></SiteContainer></main>
    {loggingOut ? <LogoutModal onClose={() => setLoggingOut(false)} /> : null}
  </>;
}
