"use client";

import Link from "next/link";
import { startTransition, useActionState, useState, type FormEvent } from "react";

import { AdminFilterSelect } from "../../_shared/components/admin-filter-select";
import { createAdminCaseAction } from "../actions/create-admin-case-action";
import { CaseThumbnailUpload } from "./case-thumbnail-upload";
import { caseUnlockOptions, type CaseUnlockValue } from "../data/case-form-options";
import type { AdminCaseLookups } from "../types/admin-case";

const initialState = { error: null };
const fieldClass = "h-11 w-full rounded-xl border border-border-strong bg-background px-3 text-xs text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-purple disabled:cursor-not-allowed disabled:opacity-55";
const textAreaClass = "min-h-24 w-full resize-y rounded-xl border border-border-strong bg-background px-3 py-3 text-xs leading-relaxed text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-purple disabled:cursor-not-allowed disabled:opacity-55";

type CreateCaseFormProps = {
  lookups: AdminCaseLookups;
};

export function CreateCaseForm({ lookups }: CreateCaseFormProps) {
  const [state, formAction, pending] = useActionState(createAdminCaseAction, initialState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState(lookups.themes[0]?.value ?? "");
  const [themeOtherText, setThemeOtherText] = useState("");
  const [competency, setCompetency] = useState(lookups.competency_focuses[0]?.value ?? "");
  const [difficulty, setDifficulty] = useState(lookups.difficulty_levels[0]?.value ?? "low");
  const [risk, setRisk] = useState(lookups.risk_levels.find((option) => option.value === "medium")?.value ?? lookups.risk_levels[0]?.value ?? "");
  const [unlock, setUnlock] = useState<CaseUnlockValue>(caseUnlockOptions[0].value);
  const [generationSource] = useState(lookups.generation_sources.find((option) => option.value === "manual")?.value ?? lookups.generation_sources[0]?.value ?? "manual");
  const hasRequiredLookups = Boolean(theme && competency && difficulty && risk && generationSource);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    if (submitter instanceof HTMLButtonElement && submitter.name) {
      formData.set(submitter.name, submitter.value);
    }

    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
      <input type="hidden" name="generation_source" value="manual" />

      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
        <h2 className="font-display text-base font-semibold">Informasi Dasar</h2>
        <div className="mt-5 space-y-5">
          <label className="block text-xs font-semibold">Judul Case
            <input name="title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required disabled={pending} placeholder="Masukkan judul kasus menarik..." className={`mt-2 ${fieldClass}`} />
          </label>

          <label className="block text-xs font-semibold">Deskripsi Singkat
            <textarea name="short_description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} required disabled={pending} placeholder="Uraikan sinopsis kasus misteri di sini..." className={`mt-2 ${textAreaClass}`} />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <span className="mb-2 block text-xs font-semibold">Tema/Kategori</span>
              <AdminFilterSelect name="theme" label="Tema" value={theme} options={lookups.themes} onChange={setTheme} disabled={pending} showLabel={false} />
              {theme === "other" ? (
                <input key="theme-other-text" name="theme_other_text" value={themeOtherText} onChange={(event) => setThemeOtherText(event.target.value)} required disabled={pending} placeholder="Jelaskan tema lainnya..." className={`mt-2 ${fieldClass}`} />
              ) : (
                <input key="theme-other-empty" type="hidden" name="theme_other_text" value="" readOnly />
              )}
            </div>

            <div>
              <span className="mb-2 block text-xs font-semibold">Fokus Kompetensi</span>
              <AdminFilterSelect name="competency_focus" label="Kompetensi" value={competency} options={lookups.competency_focuses} onChange={setCompetency} disabled={pending} showLabel={false} />
            </div>

            <fieldset disabled={pending}>
              <legend className="text-xs font-semibold">Tingkat Kesulitan</legend>
              <div className="mt-2 space-y-2">
                {lookups.difficulty_levels.map((option) => (
                  <label key={option.value} className="flex w-fit cursor-pointer items-center gap-2 text-xs text-foreground/70">
                    <input type="radio" name="difficulty_level" value={option.value} checked={difficulty === option.value} onChange={() => setDifficulty(option.value)} className="size-4 accent-green" />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block text-xs font-semibold">Estimasi Durasi (Menit)
              <input name="estimated_duration_minutes" type="number" min={1} max={240} required disabled={pending} placeholder="Misal: 45" className={`mt-2 ${fieldClass}`} />
            </label>

            <div>
              <span className="mb-2 block text-xs font-semibold">Risk Level</span>
              <AdminFilterSelect name="risk_level" label="Risk" value={risk} options={lookups.risk_levels} onChange={setRisk} disabled={pending} showLabel={false} />
            </div>

            <div>
              <span className="mb-2 block text-xs font-semibold">Unlock Requirement</span>
              <AdminFilterSelect name="unlock_requirement_type" label="Unlock" value={unlock} options={caseUnlockOptions.map((option) => ({ value: option.value, label: option.label }))} onChange={(value) => setUnlock(value as CaseUnlockValue)} disabled={pending} showLabel={false} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
        <h2 className="font-display text-base font-semibold">Thumbnail Case</h2>
        <div className="mt-5">
          <CaseThumbnailUpload disabled={pending} />
        </div>
        <label className="mt-5 block text-xs font-semibold">Thumbnail Prompt
          <textarea name="thumbnail_prompt" disabled={pending} maxLength={1000} placeholder="Tulis prompt visual untuk AI generator..." className={`mt-2 ${textAreaClass}`} />
        </label>
      </section>

      {!hasRequiredLookups ? <p role="alert" className="rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">Data lookup case belum lengkap. Muat ulang halaman atau periksa API.</p> : null}
      {state.error ? <p role="alert" className="rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}

      <div className="flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:justify-end">
        <Link href="/admin/cases" className="inline-flex h-10 min-w-24 items-center justify-center rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:border-foreground/35 hover:text-foreground">Batal</Link>
        <button type="submit" disabled={pending || !hasRequiredLookups} className="h-10 min-w-40 cursor-pointer rounded-full bg-purple px-6 text-xs font-semibold text-white transition-colors hover:bg-purple/80 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/30">{pending ? "Menyimpan..." : "Simpan Draft"}</button>
      </div>
    </form>
  );
}

