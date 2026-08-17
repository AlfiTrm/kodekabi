"use client";

import { useState } from "react";

import { Modal } from "@/src/shared/components/ui/modal";
import { nicknameSuggestions } from "../data/profile";

type EditProfileModalProps = {
  initialNickname: string;
  onClose: () => void;
  onSave: (nickname: string) => void;
};

export function EditProfileModal({ initialNickname, onClose, onSave }: EditProfileModalProps) {
  const [nickname, setNickname] = useState(initialNickname);
  const canSave = nickname.trim().length >= 3;

  function randomizeNickname() {
    const available = nicknameSuggestions.filter((suggestion) => suggestion !== nickname);
    setNickname(available[Math.floor(Math.random() * available.length)] ?? nickname);
  }

  return <Modal labelledBy="edit-profile-title" onClose={onClose} className="max-w-md">
    <div className="flex items-center justify-between border-b border-white/8 px-5 py-5"><h2 id="edit-profile-title" className="font-display text-xl font-bold">Edit nickname<span className="text-red">.</span></h2><button type="button" onClick={onClose} aria-label="Tutup edit nickname" className="grid size-9 place-items-center rounded-full border border-border-strong text-foreground/55">×</button></div>
    <div className="px-5 py-7">
      <label className="text-[9px] font-bold">Nickname<span className="mt-2 flex gap-2"><input autoFocus value={nickname} maxLength={16} onChange={(event) => setNickname(event.target.value)} className="h-12 min-w-0 flex-1 rounded-xl border border-purple bg-background px-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple/25" /><button type="button" onClick={randomizeNickname} aria-label="Acak nickname" className="grid size-12 shrink-0 place-items-center rounded-xl border border-border-strong bg-surface-elevated text-lg">⚄</button></span></label>
      <div className="mt-2 flex justify-between text-[8px]"><span className="text-foreground/35">Minimal 3 karakter.</span><span className={canSave ? "text-green" : "text-red"}>{canSave ? "✓ tersedia" : "min. 3 karakter"}</span></div>
    </div>
    <div className="flex justify-end gap-2 border-t border-white/8 px-5 py-4"><button type="button" onClick={onClose} className="h-11 rounded-full border border-border-strong px-6 text-[10px] font-bold text-foreground/60">Batal</button><button type="button" disabled={!canSave} onClick={() => onSave(nickname.trim())} className="h-11 rounded-full bg-white px-7 text-[10px] font-bold text-button-ink disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/35">Simpan Nickname</button></div>
  </Modal>;
}
