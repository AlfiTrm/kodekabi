"use client";

import { useActionState, useState } from "react";

import { Modal } from "@/src/shared/components/ui/modal";
import { deleteAdminCaseAction } from "../actions/delete-admin-case-action";
import { publishAdminCaseAction } from "../actions/publish-admin-case-action";
import type { AdminCase } from "../types/admin-case";

const initialDeleteState = { error: null };
const initialPublishState = { error: null, success: null, requirements: [] };

export function CaseDetailActions({ caseItem }: { caseItem: AdminCase }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteAdminCaseAction, initialDeleteState);
  const [publishState, publishFormAction, publishPending] = useActionState(publishAdminCaseAction, initialPublishState);
  const published = caseItem.status === "published";

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
        <button type="button" disabled title="Form edit metadata belum tersedia" className="h-10 cursor-not-allowed rounded-full bg-purple px-5 text-xs font-semibold text-white opacity-45">Edit Metadata</button>
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
