"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { Modal } from "@/src/shared/components/ui/modal";
import { deleteAdminUserAction } from "../actions/delete-admin-user-action";
import { updateAdminUserAccessAction } from "../actions/update-admin-user-access-action";
import type { AdminUserDetail } from "../types/admin-user";

const initialState = { error: null, success: null };
const initialDeleteState = { error: null };

export function UserManagementPanel({ user }: { user: AdminUserDetail }) {
  const [state, formAction, pending] = useActionState(updateAdminUserAccessAction, initialState);
  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteAdminUserAction, initialDeleteState);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const targetStatus = user.status === "active" ? "suspended" : "active";

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold uppercase tracking-[-0.02em]">Aksi manajemen.</h2>
      <div className="mt-5 space-y-2.5">
        <Link href={`/admin/users/${encodeURIComponent(user.username)}/edit`} className="inline-flex h-10 w-full items-center justify-center rounded-full border border-white bg-white text-xs font-semibold text-button-ink transition-colors hover:bg-orange">Edit Detail User</Link>
        <form action={formAction}>
          <input type="hidden" name="user_id" value={user.user_id} />
          <input type="hidden" name="username" value={user.username} />
          <input type="hidden" name="role_name" value={user.role_name} />
          <input type="hidden" name="status" value={targetStatus} />
          <button type="submit" disabled={pending} className={`h-10 w-full cursor-pointer rounded-full border text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${targetStatus === "active" ? "border-green text-green hover:bg-green/8" : "border-orange text-orange hover:bg-orange/8"}`}>
            {pending ? "Memperbarui..." : targetStatus === "active" ? "Aktifkan Akun" : "Suspend Akun"}
          </button>
        </form>
        <button type="button" onClick={() => setDeleteOpen(true)} className="h-10 w-full cursor-pointer rounded-full border border-red text-xs font-semibold text-red transition-colors hover:bg-red/8">Hapus Akun</button>
      </div>
      {state.error ? <p role="alert" className="mt-4 text-[10px] text-red">{state.error}</p> : null}
      {state.success ? <p role="status" className="mt-4 text-[10px] text-green">{state.success}</p> : null}

      {deleteOpen ? (
        <Modal labelledBy="delete-user-title" onClose={() => deletePending ? undefined : setDeleteOpen(false)} className="max-w-md">
          <div className="p-6 sm:p-7">
            <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-red/12 font-display text-xl font-bold text-red">!</span>
            <h2 id="delete-user-title" className="mt-5 font-display text-2xl font-semibold uppercase tracking-[-0.025em]">Hapus {user.username}?</h2>
            <p className="mt-3 text-sm leading-6 text-foreground/50">Akun dan akses pengguna akan dihapus secara permanen. Tindakan ini tidak bisa dibatalkan dari admin console.</p>
            {deleteState.error ? <p role="alert" className="mt-4 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{deleteState.error}</p> : null}
            <form action={deleteFormAction} className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <input type="hidden" name="user_id" value={user.user_id} />
              <button type="button" disabled={deletePending} onClick={() => setDeleteOpen(false)} className="h-10 min-w-24 cursor-pointer rounded-full border border-border-strong px-5 text-xs text-foreground/55 transition-colors hover:text-foreground disabled:cursor-not-allowed">Batal</button>
              <button type="submit" disabled={deletePending} className="h-10 min-w-32 cursor-pointer rounded-full bg-red px-5 text-xs font-semibold text-button-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50">{deletePending ? "Menghapus..." : "Hapus Permanen"}</button>
            </form>
          </div>
        </Modal>
      ) : null}
    </section>
  );
}
