"use client";

import { useActionState, useState } from "react";

import { Modal } from "@/src/shared/components/ui/modal";
import { deleteAdminRedeemCodeAction } from "../actions/delete-admin-redeem-code-action";
import { AdminIcon } from "../../_shared/components/admin-icon";

export function DeleteRedeemCodeButton({ redeemCodeId, code }: { redeemCodeId: string; code: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteAdminRedeemCodeAction, { error: null });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Hapus kode ${code}`} className="grid size-9 cursor-pointer place-items-center rounded-xl border border-border-strong text-red transition-colors hover:border-red hover:bg-red/10">
        <AdminIcon name="delete" className="size-4" />
      </button>
      {open ? (
        <Modal labelledBy="delete-redeem-code-title" onClose={() => !pending && setOpen(false)} className="max-w-md p-6">
          <h2 id="delete-redeem-code-title" className="font-display text-xl font-semibold">Hapus kode redeem?</h2>
          <p className="mt-2 text-xs leading-5 text-foreground/55">Kode <strong className="font-mono text-orange">{code}</strong> akan dihapus permanen dan tidak dapat dipulihkan.</p>
          {state.error ? <p className="mt-4 rounded-xl border border-red/30 bg-red/10 p-3 text-xs text-red">{state.error}</p> : null}
          <form action={action} className="mt-6 flex justify-end gap-3">
            <input type="hidden" name="redeem_code_id" value={redeemCodeId} />
            <button type="button" disabled={pending} onClick={() => setOpen(false)} className="h-10 cursor-pointer rounded-full border border-border-strong px-5 text-xs font-semibold disabled:cursor-not-allowed">Batal</button>
            <button type="submit" disabled={pending} className="h-10 cursor-pointer rounded-full border border-red/50 bg-red/10 px-5 text-xs font-semibold text-red transition-colors hover:bg-red hover:text-white disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Menghapus..." : "Hapus Kode"}</button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
