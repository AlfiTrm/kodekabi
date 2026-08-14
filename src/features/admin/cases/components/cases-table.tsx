import Link from "next/link";

import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminIcon } from "../../_shared/components/admin-icon";
import { AdminPagination } from "../../_shared/components/admin-pagination";
import { AdminTableShell } from "../../_shared/components/admin-table-shell";
import { buildAdminQueryHref } from "../../_shared/utils/admin-query";
import type { AdminCase, AdminCasesPagination } from "../types/admin-case";

type CasesTableProps = {
  cases: AdminCase[];
  pagination: AdminCasesPagination;
  query: { search: string; status: string; difficulty: string };
};

const statusClasses: Record<string, string> = {
  published: "bg-green/12 text-green",
  draft: "bg-surface-muted text-foreground/50",
  archived: "bg-red/12 text-red",
};

const difficultyClasses: Record<string, string> = {
  low: "bg-green/12 text-green",
  medium: "bg-orange/12 text-orange",
  high: "bg-red/12 text-red",
};

const difficultyLabels: Record<string, string> = {
  low: "Easy",
  medium: "Medium",
  high: "Hard",
};

const caseDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : caseDateFormatter.format(date);
}

function compactCaseId(caseId: string) {
  return `KB-${caseId.replaceAll("-", "").slice(0, 4).toUpperCase()}`;
}

export function CasesTable({ cases, pagination, query }: CasesTableProps) {
  const safeCases = Array.isArray(cases) ? cases : [];
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  function buildPageHref(page: number) {
    const params = new URLSearchParams({
      search: query.search,
      status: query.status,
      difficulty: query.difficulty,
    });
    return buildAdminQueryHref("/admin/cases", params, { page }, { resetPage: false });
  }

  function buildCaseHref(caseItem: AdminCase, hash = "") {
    const path = `/admin/cases/${encodeURIComponent(caseItem.slug)}`;
    return `${path}?caseId=${encodeURIComponent(caseItem.case_id)}${hash}`;
  }

  return (
    <AdminTableShell
      footer={
        <>
          <p className="text-[10px] text-foreground/40">Menampilkan {start}-{end} dari {pagination.total.toLocaleString("id-ID")} case investigasi</p>
          <AdminPagination page={pagination.page} totalPages={Math.max(1, pagination.total_pages)} buildHref={buildPageHref} previousLabel="Sebelumnya" nextLabel="Selanjutnya" />
        </>
      }
    >
      <table className="w-full min-w-[1080px] border-collapse text-left">
        <thead className="border-b border-border text-[9px] uppercase text-foreground/45">
          <tr>
            <th className="px-5 py-4 font-medium">ID</th>
            <th className="px-4 py-4 font-medium">Judul Case</th>
            <th className="px-4 py-4 font-medium">Difficulty</th>
            <th className="px-4 py-4 font-medium">Status</th>
            <th className="px-4 py-4 font-medium">Jumlah Soal</th>
            <th className="px-4 py-4 font-medium">AI Model</th>
            <th className="px-4 py-4 font-medium">Terakhir Diubah</th>
            <th className="sticky right-0 z-10 bg-surface px-5 py-4 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {safeCases.map((caseItem) => (
            <tr key={caseItem.case_id} className="group transition-colors hover:bg-white/[0.025]">
              <td className="px-5 py-3.5 font-mono text-[10px] text-foreground/45">{compactCaseId(caseItem.case_id)}</td>
              <td className="px-4 py-3.5"><strong className="text-xs font-semibold">{caseItem.title}</strong></td>
              <td className="px-4 py-3.5"><span className={`rounded-lg px-2.5 py-1 font-mono text-[8px] font-bold uppercase ${difficultyClasses[caseItem.difficulty_level] ?? "bg-surface-muted text-foreground/55"}`}>{difficultyLabels[caseItem.difficulty_level] ?? caseItem.difficulty_level}</span></td>
              <td className="px-4 py-3.5"><span className={`rounded-lg px-2.5 py-1 font-mono text-[8px] font-bold uppercase ${statusClasses[caseItem.status] ?? "bg-surface-muted text-foreground/55"}`}>{caseItem.status}</span></td>
              <td className="px-4 py-3.5 font-mono text-[10px]">{caseItem.question_count} Soal</td>
              <td className="px-4 py-3.5 font-mono text-[10px] text-orange">{caseItem.ai_model ?? "-"}</td>
              <td className="px-4 py-3.5 text-xs text-foreground/45">{formatDate(caseItem.updated_at)}</td>
              <td className="sticky right-0 bg-surface px-5 py-3.5 group-hover:bg-surface-elevated">
                <div className="flex justify-end gap-2">
                  <Link href={buildCaseHref(caseItem)} prefetch={false} aria-label={`Lihat ${caseItem.title}`} className="grid size-9 cursor-pointer place-items-center rounded-xl border border-border-strong text-foreground/45 transition-colors hover:border-purple hover:text-purple"><AdminIcon name="view" className="size-4" /></Link>
                  <Link href={buildCaseHref(caseItem, "#workspace")} prefetch={false} aria-label={`Kelola ${caseItem.title}`} className="grid size-9 cursor-pointer place-items-center rounded-xl border border-border-strong text-orange transition-colors hover:border-orange hover:bg-orange/8"><AdminIcon name="config" className="size-4" /></Link>
                </div>
              </td>
            </tr>
          ))}
          {safeCases.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <AdminEmptyState title="Case tidak ditemukan" description="Belum ada case yang cocok dengan pencarian atau filter ini. Ubah filter atau buat case investigasi baru." />
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </AdminTableShell>
  );
}
