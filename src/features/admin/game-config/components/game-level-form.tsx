"use client";

import { useActionState } from "react";
import { createAdminGameLevelAction } from "../actions/create-admin-game-level-action";
import { updateAdminGameLevelAction } from "../actions/update-admin-game-level-action";
import { useAdminGameLevelForm } from "../hooks/use-admin-game-level-form";
import type { AdminGameLevel } from "../types/admin-game-level";

const initialState = { error: null };

function LevelField({ label, name, value, onChange, min = 0, suffix }: { label: string; name: string; value: string; onChange: (value: string) => void; min?: number; suffix?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold">{label}</span>
      <span className="flex h-11 items-center rounded-xl border border-border-strong bg-background focus-within:border-purple">
        <input name={name} type="number" min={min} step="1" required value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 text-xs outline-none" />
        {suffix ? <span className="pr-4 text-[9px] font-semibold uppercase text-orange">{suffix}</span> : null}
      </span>
    </label>
  );
}

export function GameLevelForm({ level, onCancel }: { level?: AdminGameLevel; onCancel: () => void }) {
  const action = level ? updateAdminGameLevelAction : createAdminGameLevelAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const { values, setters, valid, dirty } = useAdminGameLevelForm(level);

  return (
    <form action={formAction} className="p-6 sm:p-7">
      {level ? <input type="hidden" name="game_level_id" value={level.game_level_id} /> : null}
      <h2 id="game-level-form-title" className="font-display text-2xl font-semibold tracking-[-0.025em]">{level ? `Edit Level ${level.level}` : "Tambah Level"}</h2>
      <p className="mt-2 text-xs leading-5 text-foreground/45">Atur ambang XP, gelar yang terbuka, dan hadiah koin pemain.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <LevelField label="Level" name="level" value={values.levelNumber} onChange={setters.setLevelNumber} min={1} />
        <LevelField label="XP Kebutuhan" name="xp_required" value={values.xpRequired} onChange={setters.setXpRequired} suffix="XP" />
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-xs font-semibold">Gelar / Badge</span>
          <input name="title" required maxLength={100} value={values.title} onChange={(event) => setters.setTitle(event.target.value)} placeholder="Contoh: Pemburu Fakta" className="h-11 w-full rounded-xl border border-border-strong bg-background px-4 text-xs outline-none placeholder:text-foreground/25 focus:border-purple" />
        </label>
        <div className="sm:col-span-2"><LevelField label="Reward Koin" name="reward_coin" value={values.rewardCoin} onChange={setters.setRewardCoin} suffix="koin" /></div>
      </div>

      {state.error ? <p role="alert" className="mt-5 rounded-xl border border-red/30 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}
      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <button type="button" disabled={pending} onClick={onCancel} className="h-10 min-w-24 cursor-pointer rounded-full border border-border-strong px-5 text-xs text-foreground/55 disabled:cursor-not-allowed">Batal</button>
        <button type="submit" disabled={pending || !valid || !dirty} className="h-10 min-w-36 cursor-pointer rounded-full bg-white px-5 text-xs font-semibold text-button-ink transition-colors hover:bg-purple hover:text-white disabled:cursor-not-allowed disabled:bg-foreground/10 disabled:text-foreground/30">{pending ? "Menyimpan..." : level ? "Simpan Perubahan" : "Tambah Level"}</button>
      </div>
    </form>
  );
}
