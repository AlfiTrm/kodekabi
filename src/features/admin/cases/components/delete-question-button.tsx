"use client";

import { useActionState, useState } from "react";

import { Modal } from "@/src/shared/components/ui/modal";
import { AdminIcon } from "../../_shared/components/admin-icon";
import { deleteAdminQuestionAction } from "../actions/delete-admin-question-action";
import type { AdminCase, AdminCaseQuestion } from "../types/admin-case";

const initialState = { error: null };

export function DeleteQuestionButton({ caseItem, question }: { caseItem: AdminCase; question: AdminCaseQuestion }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(deleteAdminQuestionAction, initialState);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Hapus ${question.code}`} className="grid size-9 cursor-pointer place-items-center rounded-xl border border-border-strong text-foreground/40 transition-colors hover:border-red/50 hover:bg-red/8 hover:text-red">
        <AdminIcon name="delete" className="size-4" />
      </button>

      {open ? (
        <Modal labelledBy="delete-question-title" onClose={() => pending ? undefined : setOpen(false)} className="max-w-md">
          <div className="p-6 sm:p-7">
            <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-red/12 font-display text-xl font-bold text-red">!</span>
            <h2 id="delete-question-title" className="mt-5 font-display text-2xl font-semibold tracking-[-0.025em]">Hapus question?</h2>
            <p className="mt-3 text-sm leading-6 text-foreground/50"><strong className="text-foreground">{question.code}</strong> beserta konfigurasi penilaiannya akan dihapus permanen.</p>
            {state.error ? <p role="alert" className="mt-4 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}
            <form action={formAction} className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <input type="hidden" name="case_id" value={caseItem.case_id} />
              <input type="hidden" name="version_id" value={caseItem.current_case_version_id} />
              <input type="hidden" name="question_id" value={question.case_question_id} />
              <input type="hidden" name="case_slug" value={caseItem.slug} />
              <button type="button" disabled={pending} onClick={() => setOpen(false)} className="h-10 min-w-24 cursor-pointer rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:text-foreground disabled:cursor-not-allowed">Batal</button>
              <button type="submit" disabled={pending} className="h-10 min-w-32 cursor-pointer rounded-full bg-red px-5 text-xs font-semibold text-button-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Menghapus..." : "Hapus Permanen"}</button>
            </form>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
