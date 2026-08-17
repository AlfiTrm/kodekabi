"use client";

import { useActionState, useState } from "react";

import { Modal } from "@/src/shared/components/ui/modal";
import { deleteAdminTitleAction } from "../actions/delete-admin-title-action";
import type { AdminTitle } from "../types/admin-title";
import { AdminTitleForm } from "./admin-title-form";

const initialState = { error: null };

export function TitleDetailActions({ title, initiallyEditing = false }: { title: AdminTitle; initiallyEditing?: boolean }) {
  const [editing, setEditing] = useState(initiallyEditing);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [state, formAction, pending] = useActionState(deleteAdminTitleAction, initialState);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setEditing((current) => !current)} className="h-11 cursor-pointer rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-purple hover:text-white">{editing ? "Tutup Editor" : "Edit Detail Title"}</button>
        <button type="button" onClick={() => setDeleteOpen(true)} className="h-11 cursor-pointer rounded-full border border-red/55 px-6 text-xs font-semibold text-red transition-colors hover:bg-red/8">Hapus Title</button>
      </div>

      {editing ? <div className="mt-7"><AdminTitleForm title={title} onCancel={() => setEditing(false)} /></div> : null}

      {deleteOpen ? (
        <Modal labelledBy="delete-title-title" onClose={() => pending ? undefined : setDeleteOpen(false)} className="max-w-md">
          <div className="p-6 sm:p-7">
            <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-red/12 font-display text-xl font-bold text-red">!</span>
            <h2 id="delete-title-title" className="mt-5 font-display text-2xl font-semibold tracking-[-0.025em]">Hapus {title.title}?</h2>
            <p className="mt-3 text-sm leading-6 text-foreground/50">Title akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.</p>
            {state.error ? <p role="alert" className="mt-4 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}
            <form action={formAction} className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <input type="hidden" name="title_id" value={title.title_id} />
              <button type="button" disabled={pending} onClick={() => setDeleteOpen(false)} className="h-10 min-w-24 cursor-pointer rounded-full border border-border-strong px-5 text-xs text-foreground/55 disabled:cursor-not-allowed">Batal</button>
              <button type="submit" disabled={pending} className="h-10 min-w-32 cursor-pointer rounded-full bg-red px-5 text-xs font-semibold text-button-ink disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Menghapus..." : "Hapus Permanen"}</button>
            </form>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
