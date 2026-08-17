"use client";

import { useActionState, useState, type ChangeEvent } from "react";

import { Modal } from "@/src/shared/components/ui/modal";
import { deleteAdminCaseAction } from "../actions/delete-admin-case-action";
import { publishAdminCaseAction } from "../actions/publish-admin-case-action";
import { updateAdminCaseAction } from "../actions/update-admin-case-action";
import type { AdminCase } from "../types/admin-case";

const initialDeleteState = { error: null };
const initialPublishState = { error: null, success: null, requirements: [] };

export function CaseDetailActions({ caseItem }: { caseItem: AdminCase }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteAdminCaseAction, initialDeleteState);
  const [publishState, publishFormAction, publishPending] = useActionState(publishAdminCaseAction, initialPublishState);
  const [updateState, updateFormAction, updatePending] = useActionState(updateAdminCaseAction, { error: null });
  const [editOpen, setEditOpen] = useState(false);
  const published = caseItem.status === "published";
  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const input = event.currentTarget;
    if (file && file.size > 1024 * 1024) {
      input.value = "";
      input.setCustomValidity("Ukuran thumbnail maksimal 1MB.");
      input.reportValidity();
      input.setCustomValidity("");
      return;
    }

    input.setCustomValidity("");
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={published}
          onClick={() => setPublishOpen(true)}
          title={published ? "Case sudah dipublikasikan" : "Publikasikan case"}
          className="h-10 cursor-pointer rounded-full border border-border-strong px-5 text-xs font-semibold transition-colors hover:border-green hover:text-green disabled:cursor-not-allowed disabled:opacity-45"
        >
          {published ? "Published" : "Publish"}
        </button>
        <button type="button" disabled title="Endpoint archive belum tersedia" className="h-10 cursor-not-allowed rounded-full border border-border-strong px-5 text-xs font-semibold text-orange opacity-45">Archive</button>
        <button type="button" onClick={() => setEditOpen(true)} className="h-10 cursor-pointer rounded-full bg-purple px-5 text-xs font-semibold text-white transition-colors hover:bg-purple/80">Edit Metadata</button>
        <button type="button" onClick={() => setDeleteOpen(true)} className="h-10 cursor-pointer rounded-full border border-red/55 px-5 text-xs font-semibold text-red transition-colors hover:bg-red/8">Hapus Case</button>
      </div>

      {publishOpen ? (
        <Modal labelledBy="publish-case-title" onClose={() => publishPending ? undefined : setPublishOpen(false)} className="max-w-lg">
          <div className="p-6 sm:p-7">
            <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-green/12 font-display text-xl font-bold text-green">✓</span>
            <h2 id="publish-case-title" className="mt-5 font-display text-2xl font-semibold uppercase tracking-[-0.025em]">Publish {caseItem.title}?</h2>
            <p className="mt-3 text-sm leading-6 text-foreground/50">Backend akan memeriksa question, evidence, AI prompt, dan reward sebelum case tersedia untuk pemain.</p>

            {publishState.error ? <p role="alert" className="mt-4 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{publishState.error}</p> : null}
            {publishState.success ? (
              <div role="status" className="mt-4 rounded-xl border border-green/25 bg-green/8 px-4 py-3">
                <p className="text-xs font-semibold text-green">{publishState.success}</p>
                {publishState.requirements.length > 0 ? (
                  <ul className="mt-3 space-y-1.5 text-[10px] text-foreground/60">
                    {publishState.requirements.map((requirement) => (
                      <li key={requirement.key} className="flex items-center justify-between gap-4">
                        <span>{requirement.label}</span>
                        <span className="font-mono text-green">Terpenuhi</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            {publishState.success ? (
              <div className="mt-7 flex justify-end">
                <button type="button" onClick={() => setPublishOpen(false)} className="h-10 min-w-24 cursor-pointer rounded-full bg-white px-5 text-xs font-semibold text-button-ink transition-colors hover:bg-green">Tutup</button>
              </div>
            ) : (
              <form action={publishFormAction} className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <input type="hidden" name="case_id" value={caseItem.case_id} />
                <input type="hidden" name="case_slug" value={caseItem.slug} />
                <button type="button" disabled={publishPending} onClick={() => setPublishOpen(false)} className="h-10 min-w-24 cursor-pointer rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:text-foreground disabled:cursor-not-allowed">Batal</button>
                <button type="submit" disabled={publishPending} className="h-10 min-w-36 cursor-pointer rounded-full bg-green px-5 text-xs font-semibold text-button-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50">{publishPending ? "Memeriksa..." : "Publish Case"}</button>
              </form>
            )}
          </div>
        </Modal>
      ) : null}

      {editOpen ? (
        <Modal labelledBy="edit-case-title" onClose={() => updatePending ? undefined : setEditOpen(false)} className="max-w-3xl">
          <form action={updateFormAction} className="max-h-[85vh] overflow-y-auto p-6 sm:p-7">
            <div className="flex items-start justify-between gap-5"><div><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-purple">Case metadata</p><h2 id="edit-case-title" className="mt-2 font-display text-2xl font-semibold uppercase">Edit Metadata</h2></div><button type="button" onClick={() => setEditOpen(false)} className="size-9 rounded-xl border border-border-strong text-foreground/50" aria-label="Tutup">×</button></div>
            <input type="hidden" name="case_id" value={caseItem.case_id} /><input type="hidden" name="case_slug" value={caseItem.slug} /><input type="hidden" name="theme_other_text" value={caseItem.theme_other_text ?? ""} /><input type="hidden" name="generation_source" value={caseItem.generation_source || "manual"} />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold sm:col-span-2">Judul Case<input name="title" defaultValue={caseItem.title} required className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs outline-none focus:border-purple" /></label>
              <label className="text-xs font-semibold sm:col-span-2">Deskripsi Singkat<textarea name="short_description" defaultValue={caseItem.short_description} required className="mt-2 min-h-20 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs outline-none focus:border-purple" /></label>
              <label className="text-xs font-semibold">Tema<select name="theme" defaultValue={caseItem.theme} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs"><option value="misleading_health_advice">Misleading Health Advice</option><option value="other">Lainnya</option></select></label>
              <label className="text-xs font-semibold">Fokus Kompetensi<select name="competency_focus" defaultValue={caseItem.competency_focus} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs"><option value="evidence_evaluation">Evidence Evaluation</option><option value="claim_analysis">Claim Analysis</option><option value="reasoning">Reasoning</option></select></label>
              <label className="text-xs font-semibold">Difficulty<select name="difficulty_level" defaultValue={caseItem.difficulty_level} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
              <label className="text-xs font-semibold">Risk Level<select name="risk_level" defaultValue={caseItem.risk_level} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
              <label className="text-xs font-semibold">Durasi (menit)<input name="estimated_duration_minutes" type="number" min="1" defaultValue={caseItem.estimated_duration_minutes} required className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs" /></label>
              <label className="text-xs font-semibold">Minimum Level<input name="minimum_level" type="number" min="0" defaultValue={caseItem.minimum_level} required className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs" /></label>
              <label className="text-xs font-semibold">Minimum Reputation<input name="minimum_reputation" type="number" min="0" defaultValue={caseItem.minimum_reputation} required className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs" /></label>
              <label className="text-xs font-semibold sm:col-span-2">Thumbnail Prompt<textarea name="thumbnail_prompt" defaultValue={caseItem.thumbnail_prompt} className="mt-2 min-h-16 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs" /></label>
              <label className="text-xs font-semibold sm:col-span-2">Thumbnail Baru<span className="mt-2 block text-[10px] font-normal text-foreground/45">Opsional. PNG/JPG maksimal 1MB. Kosongkan jika tidak mengganti thumbnail.</span><input name="thumbnail" type="file" accept="image/png,image/jpeg" onChange={handleThumbnailChange} className="mt-2 block w-full rounded-xl border border-dashed border-border-strong p-3 text-xs" /></label>
            </div>
            {updateState.error ? <p role="alert" className="mt-5 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{updateState.error}</p> : null}
            <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={() => setEditOpen(false)} disabled={updatePending} className="h-10 rounded-full border border-border-strong px-5 text-xs text-foreground/55">Batal</button><button type="submit" disabled={updatePending} className="h-10 rounded-full bg-purple px-6 text-xs font-semibold text-white disabled:opacity-50">{updatePending ? "Menyimpan..." : "Simpan Metadata"}</button></div>
          </form>
        </Modal>
      ) : null}

      {deleteOpen ? (
        <Modal labelledBy="delete-case-title" onClose={() => deletePending ? undefined : setDeleteOpen(false)} className="max-w-md">
          <div className="p-6 sm:p-7">
            <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-red/12 font-display text-xl font-bold text-red">!</span>
            <h2 id="delete-case-title" className="mt-5 font-display text-2xl font-semibold uppercase tracking-[-0.025em]">Hapus {caseItem.title}?</h2>
            <p className="mt-3 text-sm leading-6 text-foreground/50">Case beserta draft konfigurasinya akan dihapus permanen dari Case CMS. Tindakan ini tidak dapat dibatalkan.</p>
            {deleteState.error ? <p role="alert" className="mt-4 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{deleteState.error}</p> : null}
            <form action={deleteFormAction} className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <input type="hidden" name="case_id" value={caseItem.case_id} />
              <button type="button" disabled={deletePending} onClick={() => setDeleteOpen(false)} className="h-10 min-w-24 cursor-pointer rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:text-foreground disabled:cursor-not-allowed">Batal</button>
              <button type="submit" disabled={deletePending} className="h-10 min-w-32 cursor-pointer rounded-full bg-red px-5 text-xs font-semibold text-button-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50">{deletePending ? "Menghapus..." : "Hapus Permanen"}</button>
            </form>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
