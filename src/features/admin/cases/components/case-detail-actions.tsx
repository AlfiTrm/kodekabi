"use client";

import { useActionState, useState } from "react";

import { Modal } from "@/src/shared/components/ui/modal";
import { deleteAdminCaseAction } from "../actions/delete-admin-case-action";
import type { AdminCase } from "../types/admin-case";

const initialDeleteState = { error: null };

export function CaseDetailActions({ caseItem }: { caseItem: AdminCase }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteAdminCaseAction, initialDeleteState);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled title="Endpoint publish belum tersedia" className="h-10 cursor-not-allowed rounded-full border border-border-strong px-5 text-xs font-semibold opacity-45">Publish</button>
        <button type="button" disabled title="Endpoint archive belum tersedia" className="h-10 cursor-not-allowed rounded-full border border-border-strong px-5 text-xs font-semibold text-orange opacity-45">Archive</button>
        <button type="button" disabled title="Form edit metadata belum tersedia" className="h-10 cursor-not-allowed rounded-full bg-purple px-5 text-xs font-semibold text-white opacity-45">Edit Metadata</button>
        <button type="button" onClick={() => setDeleteOpen(true)} className="h-10 cursor-pointer rounded-full border border-red/55 px-5 text-xs font-semibold text-red transition-colors hover:bg-red/8">Hapus Case</button>
      </div>

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
