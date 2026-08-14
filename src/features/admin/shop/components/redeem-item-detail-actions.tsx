"use client";

import { useActionState, useState } from "react";
import { Modal } from "@/src/shared/components/ui/modal";
import { deleteAdminRedeemItemAction } from "../actions/delete-admin-redeem-item-action";
import type { AdminRedeemItem, AdminRedeemType } from "../types/admin-redeem-item";
import { AdminRedeemItemForm } from "./admin-redeem-item-form";

const initialState = { error: null };

export function RedeemItemDetailActions({ item, types, initiallyEditing = false }: { item: AdminRedeemItem; types: AdminRedeemType[]; initiallyEditing?: boolean }) {
  const [editing, setEditing] = useState(initiallyEditing);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteAdminRedeemItemAction, initialState);
  return <>
    <div className="flex flex-wrap gap-3"><button type="button" onClick={() => setEditing((value) => !value)} className="h-11 cursor-pointer rounded-full bg-white px-6 text-xs font-semibold text-button-ink hover:bg-purple hover:text-white">{editing ? "Tutup Editor" : "Edit Detail Item"}</button><button type="button" onClick={() => setDeleteOpen(true)} className="h-11 cursor-pointer rounded-full border border-red/55 px-6 text-xs font-semibold text-red hover:bg-red/8">Hapus Item</button></div>
    {editing ? <div className="mt-7"><AdminRedeemItemForm item={item} types={types} onCancel={() => setEditing(false)} /></div> : null}
    {deleteOpen ? <Modal labelledBy="delete-redeem-title" onClose={() => pending ? undefined : setDeleteOpen(false)} className="max-w-md"><div className="p-6 sm:p-7"><h2 id="delete-redeem-title" className="font-display text-2xl font-semibold">Hapus {item.name}?</h2><p className="mt-3 text-sm leading-6 text-foreground/50">Item redeem akan dihapus permanen dan tidak lagi dapat diklaim pemain.</p>{state.error ? <p role="alert" className="mt-4 rounded-xl border border-red/25 bg-red/8 px-4 py-3 text-xs text-red">{state.error}</p> : null}<form action={action} className="mt-7 flex justify-end gap-3"><input type="hidden" name="redeem_item_id" value={item.redeem_item_id} /><button type="button" onClick={() => setDeleteOpen(false)} className="h-10 rounded-full border border-border-strong px-5 text-xs">Batal</button><button type="submit" disabled={pending} className="h-10 rounded-full bg-red px-5 text-xs font-semibold text-button-ink disabled:opacity-40">{pending ? "Menghapus..." : "Hapus Permanen"}</button></form></div></Modal> : null}
  </>;
}
