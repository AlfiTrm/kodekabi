"use client";

import { useActionState } from "react";
import { saveAdminGeneralConfigAction } from "../actions/save-admin-general-config-action";
import { useAdminGeneralConfigForm } from "../hooks/use-admin-general-config-form";
import type { AdminGeneralGameConfig } from "../types/admin-game-config";
import { ConfigToggle } from "./config-toggle";

const initialState = { error: null, success: null, config: null };

function ConfigNumberField({ label, name, value, onChange, suffix, min = "1", step = "1" }: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
  min?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold">{label}</span>
      <span className="flex h-12 items-center rounded-xl border border-border-strong bg-background transition-colors focus-within:border-purple">
        <input
          type="number"
          min={min}
          step={step}
          required
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
        />
        <span className="pr-4 text-[10px] font-semibold uppercase text-orange">{suffix}</span>
      </span>
    </label>
  );
}

export function GeneralGameConfigForm({ config }: { config: AdminGeneralGameConfig }) {
  const [state, action, pending] = useActionState(saveAdminGeneralConfigAction, initialState);
  const { values, setters, valid, dirty } = useAdminGeneralConfigForm(state.config ?? config);

  return (
    <form action={action}>
      <input type="hidden" name="maintenance_mode" value={String(values.maintenanceMode)} />
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Aturan Limitasi Case</h2>
          <div className="mt-6 space-y-5">
            <ConfigNumberField label="Maksimum Case per Hari" name="max_cases_per_day" value={values.maxCasesPerDay} onChange={setters.setMaxCasesPerDay} suffix="case" />
            <ConfigNumberField label="Cooldown Antar Case" name="cooldown_between_cases_minutes" value={values.cooldownMinutes} onChange={setters.setCooldownMinutes} suffix="menit" />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Aturan Streak & Sistem</h2>
          <div className="mt-6">
            <ConfigNumberField label="Multiplier Bonus Streak" name="streak_bonus_multiplier" value={values.streakMultiplier} onChange={setters.setStreakMultiplier} suffix="x multiplier" min="0.1" step="0.1" />
            <div className="mt-4 border-t border-border pt-2">
              <ConfigToggle checked={values.maintenanceMode} onChange={setters.setMaintenanceMode} label="Mode Maintenance" description="Tutup akses pemain publik untuk pemeliharaan backend" />
            </div>
            {values.maintenanceMode ? (
              <div role="alert" className="mt-2 rounded-xl border border-orange/55 bg-orange/8 px-4 py-3 text-xs leading-5 text-foreground/80">
                Mode maintenance akan memutus sesi gameplay aktif. Pastikan perubahan operasional sudah diumumkan.
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <div className="mt-5 min-h-11">
        {state.error ? <p role="alert" className="rounded-xl border border-red/30 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}
        {state.success ? <p role="status" className="rounded-xl border border-green/30 bg-green/8 px-4 py-3 text-xs text-green">{state.success}</p> : null}
      </div>
      <div className="mt-2 flex justify-end">
        <button type="submit" disabled={pending || !valid || !dirty} className="h-11 min-w-44 cursor-pointer rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-purple hover:text-white disabled:cursor-not-allowed disabled:bg-foreground/10 disabled:text-foreground/30">
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
