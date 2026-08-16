"use client";

import {
  startTransition,
  useActionState,
  useState,
  useRef,
  type FormEvent,
} from "react";

import { AdminFilterSelect } from "../../_shared/components/admin-filter-select";
import { createAdminCaseAction } from "../actions/create-admin-case-action";
import { caseUnlockOptions, type CaseUnlockValue } from "../data/case-form-options";
import {
  THEME_OPTIONS,
  COMPETENCY_OPTIONS,
  DIFFICULTY_OPTIONS,
  type AiGeneratedCaseMetadata,
  type ThemeValue,
  type CompetencyValue,
  type DifficultyValue,
} from "../../ai-generation/types/ai-generation";
import type { AdminCaseLookups } from "../types/admin-case";

const initialState = { error: null };

const fieldClass =
  "h-11 w-full rounded-xl border border-border-strong bg-background px-3 text-xs text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-purple disabled:cursor-not-allowed disabled:opacity-55";
const textAreaClass =
  "min-h-24 w-full resize-y rounded-xl border border-border-strong bg-background px-3 py-3 text-xs leading-relaxed text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-purple disabled:cursor-not-allowed disabled:opacity-55";
const sectionClass = "rounded-2xl border border-border bg-surface p-5 sm:p-7";

type AiStep =
  | { phase: "idle" }
  | { phase: "generating" }
  | { phase: "ready"; metadata: AiGeneratedCaseMetadata; imageUrl: string; imageFile: File | null }
  | { phase: "error"; message: string };

type AiAssistedCreateCaseFormProps = {
  lookups: AdminCaseLookups;
};

export function AiAssistedCreateCaseForm({ lookups }: AiAssistedCreateCaseFormProps) {
  const [state, formAction, submitting] = useActionState(createAdminCaseAction, initialState);
  const [unlock, setUnlock] = useState<CaseUnlockValue>(caseUnlockOptions[0].value);

  // AI params
  const [theme, setTheme] = useState<ThemeValue>("misleading_health_advice");
  const [themeOtherText, setThemeOtherText] = useState("");
  const [competency, setCompetency] = useState<CompetencyValue>("evidence_evaluation");
  const [difficulty, setDifficulty] = useState<DifficultyValue>("medium");

  // AI state machine
  const [aiStep, setAiStep] = useState<AiStep>({ phase: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  // Editable fields after generation
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editThumbnailPrompt, setEditThumbnailPrompt] = useState("");

  function resetAi() {
    abortRef.current?.abort();
    setAiStep({ phase: "idle" });
    setEditTitle("");
    setEditDescription("");
    setEditThumbnailPrompt("");
  }

  async function handleGenerate() {
    setAiStep({ phase: "generating" });
    abortRef.current = new AbortController();

    try {
      // 1. Generate Metadata
      const metadataRes = await fetch("/api/admin/ai/generate-case-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          theme_other_text: themeOtherText,
          competency_focus: competency,
          difficulty,
        }),
        signal: abortRef.current.signal,
      });

      const metadataData = await metadataRes.json() as { success: boolean; metadata?: AiGeneratedCaseMetadata; error?: string };

      if (!metadataData.success || !metadataData.metadata) {
        setAiStep({ phase: "error", message: metadataData.error ?? "Gagal membuat metadata case." });
        return;
      }

      const metadata = metadataData.metadata;
      setEditTitle(metadata.title);
      setEditDescription(metadata.short_description ?? "");
      setEditThumbnailPrompt(metadata.thumbnail_prompt);

      // 2. Generate Image immediately after
      const imageRes = await fetch("/api/admin/ai/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnail_prompt: metadata.thumbnail_prompt }),
        signal: abortRef.current.signal,
      });

      const imageData = await imageRes.json() as { success: boolean; image_url?: string; error?: string };
      
      let imageUrl = "";
      let imageFile: File | null = null;

      if (imageData.success && imageData.image_url) {
        imageUrl = imageData.image_url;
        try {
          const imgResponse = await fetch(imageUrl, { signal: abortRef.current.signal });
          const blob = await imgResponse.blob();
          imageFile = new File([blob], "ai-thumbnail.png", { type: blob.type || "image/png" });
        } catch {
          // Ignore blob conversion error, form submission will catch it later
        }
      }

      setAiStep({ phase: "ready", metadata, imageUrl, imageFile });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setAiStep({ phase: "error", message: "Koneksi ke AI terputus. Coba lagi." });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (aiStep.phase !== "ready") return;

    const { metadata, imageFile } = aiStep;
    const unlockOption = caseUnlockOptions.find((o) => o.value === unlock) ?? caseUnlockOptions[0];

    const formData = new FormData();
    formData.set("title", editTitle || metadata.title);
    formData.set("short_description", editDescription || metadata.short_description);
    formData.set("theme", theme);
    formData.set("theme_other_text", theme === "other" ? themeOtherText : "");
    formData.set("competency_focus", competency);
    formData.set("difficulty_level", metadata.risk_level === "high" ? "high" : difficulty);
    formData.set("risk_level", metadata.risk_level);
    formData.set("estimated_duration_minutes", String(metadata.estimated_duration_minutes));
    formData.set("minimum_level", String(unlockOption.minimumLevel));
    formData.set("minimum_reputation", String(unlockOption.minimumReputation));
    formData.set("unlock_requirement", JSON.stringify({
      min_level: unlockOption.minimumLevel,
      min_reputation: unlockOption.minimumReputation,
      prerequisite_case_ids: [],
    }));
    formData.set("thumbnail_prompt", editThumbnailPrompt || metadata.thumbnail_prompt);
    formData.set("generation_source", "ai_assisted");

    if (imageFile) {
      formData.set("thumbnail", imageFile);
    }

    startTransition(() => formAction(formData));
  }

  const isIdle = aiStep.phase === "idle" || aiStep.phase === "error";
  const isGenerating = aiStep.phase === "generating";
  const isReady = aiStep.phase === "ready";

  return (
    <div className="mt-7 space-y-5">
      {/* ── Parameter Panel ── */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-base font-semibold">Parameter AI</h2>
          {isReady && (
            <button
              type="button"
              onClick={resetAi}
              className="text-xs text-foreground/40 transition-colors hover:text-foreground"
            >
              ↺ Mulai ulang
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div>
            <span className="mb-2 block text-xs font-semibold">Tema / Kategori</span>
            <AdminFilterSelect
              name="ai_theme"
              label="Tema"
              value={theme}
              options={THEME_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
              onChange={(v) => setTheme(v as ThemeValue)}
              disabled={isGenerating || isReady}
              showLabel={false}
            />
            {theme === "other" && (
              <input
                value={themeOtherText}
                onChange={(e) => setThemeOtherText(e.target.value)}
                placeholder="Jelaskan tema lainnya..."
                disabled={isGenerating || isReady}
                className={`mt-2 ${fieldClass}`}
              />
            )}
          </div>

          <div>
            <span className="mb-2 block text-xs font-semibold">Fokus Kompetensi</span>
            <AdminFilterSelect
              name="ai_competency"
              label="Kompetensi"
              value={competency}
              options={COMPETENCY_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
              onChange={(v) => setCompetency(v as CompetencyValue)}
              disabled={isGenerating || isReady}
              showLabel={false}
            />
          </div>

          <fieldset disabled={isGenerating || isReady}>
            <legend className="mb-2 text-xs font-semibold">Tingkat Kesulitan</legend>
            <div className="space-y-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex w-fit cursor-pointer items-center gap-2 text-xs text-foreground/70">
                  <input
                    type="radio"
                    checked={difficulty === opt.value}
                    onChange={() => setDifficulty(opt.value)}
                    className="size-4 accent-purple"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {isIdle && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-purple px-6 text-xs font-semibold text-white transition-opacity hover:opacity-85"
            >
              <span aria-hidden="true">⚄</span> Generate!
            </button>
            {aiStep.phase === "error" && (
              <p role="alert" className="text-xs text-red">{aiStep.message}</p>
            )}
          </div>
        )}

        {isGenerating && (
          <div className="mt-6 flex items-center gap-3">
            <span className="inline-block size-4 animate-spin rounded-full border-2 border-purple border-t-transparent" aria-hidden="true" />
            <span className="text-xs text-foreground/60">AI sedang menyusun case & menggambar thumbnail...</span>
            <button type="button" onClick={resetAi} className="ml-auto text-xs text-foreground/40 hover:text-red">Batalkan</button>
          </div>
        )}
      </section>

      {/* ── Hasil ── */}
      {isReady && (
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="generation_source" value="ai_assisted" />

          <section className={sectionClass}>
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-green" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold">Hasil Generate</h2>
            </div>

            <div className="mt-5 space-y-5">
              <label className="block text-xs font-semibold">
                Judul Case
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  maxLength={120}
                  required
                  disabled={submitting}
                  className={`mt-2 ${fieldClass}`}
                />
              </label>

              <label className="block text-xs font-semibold">
                Deskripsi Singkat
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  maxLength={500}
                  required
                  disabled={submitting}
                  className={`mt-2 ${textAreaClass}`}
                />
              </label>

              {"metadata" in aiStep && (
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Risk Level", value: (aiStep as { metadata: AiGeneratedCaseMetadata }).metadata.risk_level },
                    { label: "Durasi", value: `${(aiStep as { metadata: AiGeneratedCaseMetadata }).metadata.estimated_duration_minutes} menit` },
                    { label: "Difficulty", value: DIFFICULTY_OPTIONS.find((d) => d.value === difficulty)?.label ?? difficulty },
                  ].map((badge) => (
                    <span key={badge.label} className="rounded-lg border border-border-strong px-3 py-1 font-mono text-[10px] text-foreground/60">
                      {badge.label}: <strong className="text-foreground">{badge.value}</strong>
                    </span>
                  ))}
                </div>
              )}

              <div>
                <span className="mb-2 block text-xs font-semibold">Unlock Requirement</span>
                <AdminFilterSelect
                  name="unlock_requirement_type"
                  label="Unlock"
                  value={unlock}
                  options={caseUnlockOptions.map((o) => ({ value: o.value, label: o.label }))}
                  onChange={(v) => setUnlock(v as CaseUnlockValue)}
                  disabled={submitting}
                  showLabel={false}
                />
              </div>
            </div>
          </section>

          <section className={`${sectionClass} mt-5`}>
            <h2 className="font-display text-base font-semibold">Thumbnail Generated</h2>

            <div className="mt-5">
              {aiStep.imageUrl ? (
                <div className="relative max-w-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={aiStep.imageUrl}
                    alt="AI-generated thumbnail"
                    className="w-full rounded-2xl border border-border object-cover shadow-lg"
                  />
                  <div className="absolute right-2 top-2 rounded-lg bg-black/60 px-2 py-1 font-mono text-[9px] text-white/80">
                    AI Generated
                  </div>
                </div>
              ) : (
                <p className="text-xs text-orange">Thumbnail gagal diunduh atau digenerate. Anda perlu upload thumbnail secara manual nanti.</p>
              )}
            </div>
            
            <label className="mt-5 block text-xs font-semibold">
              Thumbnail Prompt
              <textarea
                value={editThumbnailPrompt}
                onChange={(e) => setEditThumbnailPrompt(e.target.value)}
                maxLength={4000}
                disabled={submitting}
                className={`mt-2 ${textAreaClass} min-h-32 font-mono text-[10px] leading-relaxed text-foreground/70`}
              />
            </label>
          </section>

          {/* ── Error & Submit ── */}
          {state.error && (
            <p role="alert" className="mt-5 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">
              {state.error}
            </p>
          )}
          {!aiStep.imageFile && (
            <p role="alert" className="mt-3 rounded-xl border border-orange/25 bg-orange/8 px-4 py-3 text-xs text-orange">
              Pastikan Anda mengedit case setelah ini untuk mengupload ulang thumbnail jika gambar AI tidak terlampir.
            </p>
          )}
          <div className="mt-5 flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetAi}
              disabled={submitting}
              className="inline-flex h-10 min-w-24 items-center justify-center rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:border-foreground/35 hover:text-foreground disabled:cursor-not-allowed"
            >
              Mulai Ulang
            </button>
            <button
              type="submit"
              disabled={submitting || !aiStep.imageFile}
              className="h-10 min-w-48 cursor-pointer rounded-full bg-purple px-6 text-xs font-semibold text-white transition-colors hover:bg-purple/80 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/30"
            >
              {submitting ? "Menyimpan Draft..." : "Simpan Draft"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

