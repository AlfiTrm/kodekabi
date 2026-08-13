"use client";

import { useActionState, useState } from "react";
import { Modal } from "@/src/shared/components/ui/modal";
import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminPagination } from "../../_shared/components/admin-pagination";
import { AdminTableShell } from "../../_shared/components/admin-table-shell";
import { deleteAdminGameLevelAction } from "../actions/delete-admin-game-level-action";
import type { AdminGameLevel, AdminGameLevelsPagination } from "../types/admin-game-level";
import { GameLevelForm } from "./game-level-form";

const initialState = { error: null };

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function GameLevelsPanel({ levels, pagination, search }: { levels: AdminGameLevel[]; pagination: AdminGameLevelsPagination; search: string }) {
  const [editing, setEditing] = useState<AdminGameLevel | null | "new">(null);
  const [deleting, setDeleting] = useState<AdminGameLevel | null>(null);
  const [deleteState, deleteAction, deletingPending] = useActionState(deleteAdminGameLevelAction, initialState);
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  function pageHref(page: number) {
    const params = new URLSearchParams({ tab: "xp-level", page: String(page) });
    if (search) params.set("search", search);
    return `/admin/config?${params}`;
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Tabel Progresi Level</h2>
          <p className="mt-1 text-[10px] text-foreground/40">Urutan level, kebutuhan XP, dan reward pemain.</p>
        </div>
        <button type="button" onClick={() => setEditing("new")} className="h-9 shrink-0 cursor-pointer rounded-full border border-purple/35 px-4 text-[10px] font-semibold text-purple transition-colors hover:bg-purple hover:text-white">+ Tambah Level</button>
      </div>

      <AdminTableShell footer={<><p className="text-[10px] text-foreground/40">Menampilkan {start}-{end} dari {pagination.total} level</p><AdminPagination page={pagination.page} totalPages={Math.max(1, pagination.total_pages)} buildHref={pageHref} /></>}>
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead className="border-b border-border text-[9px] uppercase text-foreground/45"><tr><th className="px-4 py-3 font-medium">Level</th><th className="px-4 py-3 font-medium">XP Kebutuhan</th><th className="px-4 py-3 font-medium">Gelar / Badge</th><th className="px-4 py-3 font-medium">Reward Koin</th><th className="sticky right-0 bg-surface px-4 py-3 text-right font-medium">Aksi</th></tr></thead>
          <tbody className="divide-y divide-border">
            {levels.map((item) => (
              <tr key={item.game_level_id} className="group hover:bg-white/[0.025]">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-orange">LV {item.level}</td>
                <td className="px-4 py-3 font-mono text-[10px]">{formatNumber(item.xp_required)} XP</td>
                <td className="px-4 py-3 text-xs font-semibold">{item.title}</td>
                <td className="px-4 py-3 font-mono text-[10px] text-orange">{formatNumber(item.reward_coin)} KOIN</td>
                <td className="sticky right-0 bg-surface px-4 py-3 group-hover:bg-surface-elevated"><div className="flex justify-end gap-2"><button type="button" onClick={() => setEditing(item)} className="h-8 cursor-pointer rounded-lg border border-border-strong px-3 text-[9px] transition-colors hover:border-purple hover:text-purple">Edit</button><button type="button" onClick={() => setDeleting(item)} className="h-8 cursor-pointer rounded-lg border border-border-strong px-3 text-[9px] text-red transition-colors hover:border-red hover:bg-red/8">Hapus</button></div></td>
              </tr>
            ))}
            {levels.length === 0 ? <tr><td colSpan={5}><AdminEmptyState title="Level belum tersedia" description="Tambahkan level pertama atau ubah kata pencarian." /></td></tr> : null}
          </tbody>
        </table>
      </AdminTableShell>

      {editing ? <Modal labelledBy="game-level-form-title" onClose={() => setEditing(null)} className="max-w-xl"><GameLevelForm level={editing === "new" ? undefined : editing} onCancel={() => setEditing(null)} /></Modal> : null}
      {deleting ? (
        <Modal labelledBy="delete-level-title" onClose={() => deletingPending ? undefined : setDeleting(null)} className="max-w-md">
          <div className="p-6 sm:p-7"><h2 id="delete-level-title" className="font-display text-2xl font-semibold">Hapus Level {deleting.level}?</h2><p className="mt-3 text-xs leading-5 text-foreground/50">Level &quot;{deleting.title}&quot; akan dihapus permanen. Pastikan tidak ada progres pemain yang bergantung padanya.</p>{deleteState.error ? <p role="alert" className="mt-4 rounded-xl border border-red/30 bg-red/8 px-4 py-3 text-xs text-red">{deleteState.error}</p> : null}<form action={deleteAction} className="mt-7 flex justify-end gap-3"><input type="hidden" name="game_level_id" value={deleting.game_level_id} /><button type="button" disabled={deletingPending} onClick={() => setDeleting(null)} className="h-10 cursor-pointer rounded-full border border-border-strong px-5 text-xs disabled:cursor-not-allowed">Batal</button><button type="submit" disabled={deletingPending} className="h-10 cursor-pointer rounded-full bg-red px-5 text-xs font-semibold text-button-ink disabled:cursor-not-allowed disabled:opacity-50">{deletingPending ? "Menghapus..." : "Hapus Level"}</button></form></div>
        </Modal>
      ) : null}
    </section>
  );
}
