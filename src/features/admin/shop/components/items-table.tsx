import Link from "next/link";

import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminIcon } from "../../_shared/components/admin-icon";
import { AdminPagination } from "../../_shared/components/admin-pagination";
import { AdminTableShell } from "../../_shared/components/admin-table-shell";
import type { AdminItem, AdminItemsPagination } from "../types/admin-item";

const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date);
}

function formatCoin(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function ItemsTable({ items, pagination }: { items: AdminItem[]; pagination: AdminItemsPagination }) {
  const safeItems = Array.isArray(items) ? items : [];
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <AdminTableShell
      footer={
        <>
          <p className="text-[10px] text-foreground/40">Menampilkan {start}-{end} dari {pagination.total.toLocaleString("id-ID")} item toko</p>
          <AdminPagination page={pagination.page} totalPages={Math.max(1, pagination.total_pages)} buildHref={(page) => `/admin/shop?page=${page}`} />
        </>
      }
    >
      <table className="w-full min-w-[1040px] border-collapse text-left">
        <thead className="border-b border-border text-[9px] uppercase text-foreground/45">
          <tr>
            <th className="px-5 py-4 font-medium">Gambar</th>
            <th className="px-4 py-4 font-medium">Nama Item</th>
            <th className="px-4 py-4 font-medium">Kategori</th>
            <th className="px-4 py-4 font-medium">Harga Koin</th>
            <th className="px-4 py-4 font-medium">Visibilitas</th>
            <th className="px-4 py-4 font-medium">Featured</th>
            <th className="px-4 py-4 font-medium">Status</th>
            <th className="px-4 py-4 font-medium">Diperbarui</th>
            <th className="sticky right-0 z-10 bg-surface px-5 py-4 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {safeItems.map((item) => (
            <tr key={item.item_id} className="group transition-colors hover:bg-white/[0.025]">
              <td className="px-5 py-3">
                <span className="relative block size-11 overflow-hidden rounded-xl border border-white/10 bg-background">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Item hosts are dynamic backend data.
                    <img src={item.image_url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
                  ) : <span className="grid size-full place-items-center text-xs text-foreground/25">?</span>}
                </span>
              </td>
              <td className="px-4 py-3"><strong className="text-xs font-semibold">{item.name}</strong></td>
              <td className="px-4 py-3"><span className="rounded-full bg-purple/12 px-2.5 py-1 text-[8px] font-bold uppercase text-purple">{item.category?.name ?? "-"}</span></td>
              <td className="px-4 py-3 font-mono text-[10px] text-orange">{formatCoin(item.price_coin)} <span aria-label="koin" className="text-foreground/50">●</span></td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[8px] font-bold ${item.is_visible ? "bg-green/12 text-green" : "bg-red/12 text-red"}`}>{item.is_visible ? "Tampil" : "Tersembunyi"}</span></td>
              <td className="px-4 py-3 text-[10px] text-foreground/55">{item.is_featured ? "Ya" : "Tidak"}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase ${item.status === "active" ? "bg-green/12 text-green" : "bg-surface-muted text-foreground/45"}`}>{item.status}</span></td>
              <td className="px-4 py-3 text-[10px] text-foreground/45">{formatDate(item.updated_at)}</td>
              <td className="sticky right-0 bg-surface px-5 py-3 group-hover:bg-surface-elevated">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/shop/${encodeURIComponent(item.item_id)}`} prefetch={false} aria-label={`Lihat ${item.name}`} className="grid size-9 place-items-center rounded-xl border border-border-strong text-foreground/45 transition-colors hover:border-purple hover:text-purple"><AdminIcon name="view" className="size-4" /></Link>
                  <Link href={`/admin/shop/${encodeURIComponent(item.item_id)}?edit=1`} prefetch={false} aria-label={`Edit ${item.name}`} className="grid size-9 place-items-center rounded-xl border border-border-strong text-orange transition-colors hover:border-orange hover:bg-orange/8"><AdminIcon name="edit" className="size-4" /></Link>
                </div>
              </td>
            </tr>
          ))}
          {safeItems.length === 0 ? <tr><td colSpan={9}><AdminEmptyState title="Item belum tersedia" description="Belum ada item toko pada halaman ini. Tambahkan item pertama untuk memulai katalog." /></td></tr> : null}
        </tbody>
      </table>
    </AdminTableShell>
  );
}

