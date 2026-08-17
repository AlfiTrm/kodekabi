import Link from "next/link";

import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminIcon } from "../../_shared/components/admin-icon";
import { AdminPagination } from "../../_shared/components/admin-pagination";
import { AdminTableShell } from "../../_shared/components/admin-table-shell";
import { buildAdminQueryHref } from "../../_shared/utils/admin-query";
import type { AdminTitle, AdminTitlesPagination } from "../types/admin-title";

const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date);
}

type TitlesTableProps = {
  titles: AdminTitle[];
  pagination: AdminTitlesPagination;
  query: { search: string };
};

export function TitlesTable({ titles, pagination, query }: TitlesTableProps) {
  const safeTitles = Array.isArray(titles) ? titles : [];
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  function buildPageHref(page: number) {
    const params = new URLSearchParams({ search: query.search });
    return buildAdminQueryHref("/admin/titles", params, { page }, { resetPage: false });
  }

  return (
    <AdminTableShell
      footer={
        <>
          <p className="text-[10px] text-foreground/40">Menampilkan {start}-{end} dari {pagination.total.toLocaleString("id-ID")} title</p>
          <AdminPagination page={pagination.page} totalPages={Math.max(1, pagination.total_pages)} buildHref={buildPageHref} />
        </>
      }
    >
      <table className="w-full min-w-[960px] border-collapse text-left">
        <thead className="border-b border-border text-[9px] uppercase text-foreground/45">
          <tr>
            <th className="px-5 py-4 font-medium">Gambar</th>
            <th className="px-4 py-4 font-medium">Nama Title</th>
            <th className="px-4 py-4 font-medium">Unlock Level</th>
            <th className="px-4 py-4 font-medium">Status</th>
            <th className="px-4 py-4 font-medium">Diperbarui</th>
            <th className="sticky right-0 z-10 bg-surface px-5 py-4 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {safeTitles.map((title) => (
            <tr key={title.title_id} className="group transition-colors hover:bg-white/[0.025]">
              <td className="px-5 py-3">
                <span className="relative block size-11 overflow-hidden rounded-xl border border-white/10 bg-background">
                  {title.image_border ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Title hosts are dynamic backend data.
                    <img src={title.image_border} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
                  ) : <span className="grid size-full place-items-center text-xs text-foreground/25">?</span>}
                </span>
              </td>
              <td className="px-4 py-3"><strong className="text-xs font-semibold">{title.title}</strong></td>
              <td className="px-4 py-3 font-mono text-[10px] text-orange">LV {title.unlock_level}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase ${title.status === "active" ? "bg-green/12 text-green" : "bg-surface-muted text-foreground/45"}`}>{title.status}</span></td>
              <td className="px-4 py-3 text-[10px] text-foreground/45">{formatDate(title.updated_at)}</td>
              <td className="sticky right-0 bg-surface px-5 py-3 group-hover:bg-surface-elevated">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/titles/${encodeURIComponent(title.title_id)}`} prefetch={false} aria-label={`Lihat ${title.title}`} className="grid size-9 place-items-center rounded-xl border border-border-strong text-foreground/45 transition-colors hover:border-purple hover:text-purple"><AdminIcon name="view" className="size-4" /></Link>
                  <Link href={`/admin/titles/${encodeURIComponent(title.title_id)}?edit=1`} prefetch={false} aria-label={`Edit ${title.title}`} className="grid size-9 place-items-center rounded-xl border border-border-strong text-orange transition-colors hover:border-orange hover:bg-orange/8"><AdminIcon name="edit" className="size-4" /></Link>
                </div>
              </td>
            </tr>
          ))}
          {safeTitles.length === 0 ? <tr><td colSpan={6}><AdminEmptyState title="Title belum tersedia" description="Belum ada title pada halaman ini. Tambahkan title pertama untuk memulai katalog." /></td></tr> : null}
        </tbody>
      </table>
    </AdminTableShell>
  );
}
