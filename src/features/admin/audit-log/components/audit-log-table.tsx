import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminPagination } from "../../_shared/components/admin-pagination";
import { AdminTableShell } from "../../_shared/components/admin-table-shell";
import { buildAdminQueryHref } from "../../_shared/utils/admin-query";
import type { AdminAuditLog, AdminAuditLogPagination } from "../types/admin-audit-log";

type AuditLogTableProps = {
  logs: AdminAuditLog[];
  pagination: AdminAuditLogPagination;
  query: Record<string, string>;
};

const actionClasses: Record<string, string> = {
  create: "bg-green/12 text-green",
  delete: "bg-red/12 text-red",
  update: "bg-orange/12 text-orange",
  login: "bg-purple/15 text-purple",
  config_change: "bg-orange/12 text-orange",
};

const dateFormatter = new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Jakarta" });

function formatTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date).replace(" ", "  ");
}

export function AuditLogTable({ logs, pagination, query }: AuditLogTableProps) {
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);
  const buildPageHref = (page: number) => buildAdminQueryHref("/admin/audit-log", new URLSearchParams(query), { page }, { resetPage: false });

  return (
    <AdminTableShell footer={<><p className="text-[10px] text-foreground/40">Menampilkan log {start}-{end} dari {pagination.total.toLocaleString("id-ID")} entri aktivitas</p><AdminPagination page={pagination.page} totalPages={Math.max(1, pagination.total_pages)} buildHref={buildPageHref} /></>}>
      <table className="w-full min-w-[980px] border-collapse text-left">
        <thead className="border-b border-border text-[9px] uppercase text-foreground/45"><tr><th className="px-5 py-4 font-medium">Timestamp</th><th className="px-4 py-4 font-medium">Administrator</th><th className="px-4 py-4 font-medium">Aksi</th><th className="px-4 py-4 font-medium">Modul</th><th className="px-5 py-4 font-medium">Target / Detail</th></tr></thead>
        <tbody className="divide-y divide-border">
          {logs.map((log) => <tr key={log.admin_audit_log_id} className="transition-colors hover:bg-white/[0.025]"><td className="whitespace-nowrap px-5 py-4 font-mono text-[10px] text-foreground/45">{formatTimestamp(log.created_at)}</td><td className="px-4 py-4"><strong className="text-xs">{log.actor_name}</strong>{log.actor_email ? <span className="ml-1 text-[10px] text-foreground/45">({log.actor_email})</span> : null}</td><td className="px-4 py-4"><span className={`rounded-md px-2.5 py-1 font-mono text-[8px] font-bold uppercase ${actionClasses[log.action_type] ?? "bg-surface-muted text-foreground/55"}`}>{log.action_type}</span></td><td className="px-4 py-4 font-mono text-[10px] uppercase">{log.module}</td><td className="max-w-xl px-5 py-4 text-xs text-foreground/70">{log.detail || `${log.target_type}: ${log.target_label || log.target_id}`}</td></tr>)}
          {logs.length === 0 ? <tr><td colSpan={5}><AdminEmptyState title="Belum ada jejak aktivitas" description="Tidak ada audit log yang cocok dengan filter dan rentang waktu ini." /></td></tr> : null}
        </tbody>
      </table>
    </AdminTableShell>
  );
}
