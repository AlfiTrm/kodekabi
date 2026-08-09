"use client";

import { useState } from "react";

import { DecorativeTitle } from "@/src/shared/components/game/decorative-title";
import { IdentityPreview } from "@/src/shared/components/game/identity-preview";
import { Modal } from "@/src/shared/components/ui/modal";

import { nicknameSuggestions, profileBanner, profileDetective, profileStats, profileTitles } from "../data/profile";
import type { ProfileTitle } from "../types/profile";

type EditProfileModalProps = {
  initialNickname: string;
  initialTitle: ProfileTitle;
  onClose: () => void;
  onSave: (nickname: string, title: ProfileTitle) => void;
};

export function EditProfileModal({ initialNickname, initialTitle, onClose, onSave }: EditProfileModalProps) {
  const [nickname, setNickname] = useState(initialNickname);
  const [titleId, setTitleId] = useState(initialTitle.id);
  const selectedTitle = profileTitles.find((title) => title.id === titleId) ?? initialTitle;
  const canSave = nickname.trim().length >= 3;

  function randomizeNickname() {
    const available = nicknameSuggestions.filter((suggestion) => suggestion !== nickname);
    setNickname(available[Math.floor(Math.random() * available.length)] ?? nickname);
  }

  return (
    <Modal labelledBy="edit-profile-title" onClose={onClose} className="max-w-4xl">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-5 sm:px-7">
        <h2 id="edit-profile-title" className="font-display text-2xl font-bold uppercase tracking-[-0.04em]">Edit Profil<span className="text-red">.</span></h2>
        <button type="button" onClick={onClose} aria-label="Tutup edit profil" className="grid size-9 place-items-center rounded-full border border-border-strong text-foreground/55 transition-colors hover:text-foreground">×</button>
      </div>

      <div className="grid gap-8 px-5 py-7 sm:px-7 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <label className="text-[9px] font-bold text-foreground">Nickname
            <span className="mt-2 flex gap-2">
              <input value={nickname} maxLength={16} onChange={(event) => setNickname(event.target.value)} className="h-12 min-w-0 flex-1 rounded-xl border border-purple bg-background px-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple/25" />
              <button type="button" onClick={randomizeNickname} aria-label="Acak nickname" className="grid size-12 shrink-0 place-items-center rounded-xl border border-border-strong bg-surface-elevated text-lg transition-colors hover:border-purple">⚄</button>
            </span>
          </label>
          <div className="mt-2 flex justify-between text-[8px]"><span className="text-foreground/35">Bisa diganti 1× per 7 hari. Tersisa diganti 12 hari lalu.</span><span className={canSave ? "text-green" : "text-red"}>{canSave ? "✓ tersedia" : "min. 3 karakter"}</span></div>

          <fieldset className="mt-6">
            <legend className="text-[9px] font-bold">Gelar</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {profileTitles.map((title) => (
                <button key={title.id} type="button" disabled={!title.unlocked} onClick={() => setTitleId(title.id)} className={`rounded-xl border p-2 transition-colors ${title.id === titleId ? "border-orange bg-orange/10" : title.unlocked ? "border-border-strong hover:border-foreground/40" : "border-dashed border-border-strong opacity-35"}`}>
                  <DecorativeTitle title={title} compact />
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div>
          <p className="mb-3 text-center font-mono text-[8px] uppercase tracking-[0.14em] text-foreground/35">Pratinjau kartu</p>
          <div className="mx-auto max-w-[240px] rotate-2"><IdentityPreview nickname={nickname} detective={profileDetective} title={selectedTitle} banner={profileBanner} stats={profileStats} showMetaCopy={false} /></div>
          <p className="mt-4 text-center text-[8px] text-foreground/30">Perubahan langsung terlihat di peringkat & papan kota.</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-white/8 px-5 py-4 sm:px-7">
        <button type="button" onClick={onClose} className="h-11 rounded-full border border-border-strong px-6 text-[10px] font-bold text-foreground/60 transition-colors hover:text-foreground">Batal</button>
        <button type="button" disabled={!canSave} onClick={() => onSave(nickname.trim(), selectedTitle)} className="h-11 rounded-full bg-white px-7 text-[10px] font-bold text-button-ink transition-colors enabled:hover:bg-orange disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/35">Simpan Perubahan</button>
      </div>
    </Modal>
  );
}
