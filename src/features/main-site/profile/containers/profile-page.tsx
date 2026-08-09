"use client";

import { useState } from "react";

import { SiteContainer } from "@/src/shared/components/layout/site-container";

import { AccountPanel } from "../components/account-panel";
import { BadgeCollection } from "../components/badge-collection";
import { CaseHistory } from "../components/case-history";
import { DetectiveStatistics } from "../components/detective-statistics";
import { EditProfileModal } from "../components/edit-profile-modal";
import { LevelProgress } from "../components/level-progress";
import { LogoutModal } from "../components/logout-modal";
import { ProfileActions } from "../components/profile-actions";
import { ProfileCard } from "../components/profile-card";
import { TitleCollection } from "../components/title-collection";
import { profileTitles } from "../data/profile";

export function ProfilePage() {
  const [nickname, setNickname] = useState("NadiaJeli");
  const [selectedTitle, setSelectedTitle] = useState(profileTitles[1]);
  const [editing, setEditing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <>
      <main className="min-h-screen flex-1 bg-background pb-16 pt-24 sm:pt-28">
        <SiteContainer>
          <div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
            <div className="space-y-4">
              <ProfileCard nickname={nickname} title={selectedTitle} />
              <ProfileActions onEdit={() => setEditing(true)} />
              <LevelProgress />
              <AccountPanel onLogout={() => setLoggingOut(true)} />
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                <DetectiveStatistics />
                <BadgeCollection />
              </div>
              <TitleCollection selectedTitle={selectedTitle} />
              <CaseHistory />
            </div>
          </div>
        </SiteContainer>
      </main>

      {editing ? (
        <EditProfileModal
          initialNickname={nickname}
          initialTitle={selectedTitle}
          onClose={() => setEditing(false)}
          onSave={(nextNickname, nextTitle) => {
            setNickname(nextNickname);
            setSelectedTitle(nextTitle);
            setEditing(false);
          }}
        />
      ) : null}
      {loggingOut ? <LogoutModal onClose={() => setLoggingOut(false)} /> : null}
    </>
  );
}
