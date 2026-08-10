import Link from "next/link";

import { AdminEmptyState } from "../../_shared/components/admin-empty-state";
import { AdminIcon } from "../../_shared/components/admin-icon";
import { AdminPagination } from "../../_shared/components/admin-pagination";
import { AdminTableShell } from "../../_shared/components/admin-table-shell";
import { buildAdminQueryHref } from "../../_shared/utils/admin-query";
import type { AdminUser, AdminUsersPagination } from "../types/admin-user";

type UsersTableProps = {
  users: AdminUser[];
  pagination: AdminUsersPagination;
  query: { search: string; role: string; status: string };
};

const statusClasses: Record<string, string> = {
  active: "bg-green/12 text-green",
  suspended: "bg-orange/12 text-orange",
  banned: "bg-red/12 text-red",
};

const userDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return userDateFormatter.format(date);
}

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export function UsersTable({ users, pagination, query }: UsersTableProps) {
  const safeUsers = Array.isArray(users) ? users : [];
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  function buildPageHref(page: number) {
    const params = new URLSearchParams({
      search: query.search,
      role: query.role,
      status: query.status,
    });
    return buildAdminQueryHref("/admin/users", params, { page }, { resetPage: false });
  }

  return (
    <AdminTableShell
      footer={
        <>
          <p className="text-[10px] text-foreground/40">Menampilkan {start}-{end} dari {pagination.total.toLocaleString("id-ID")} pengguna</p>
          <AdminPagination page={pagination.page} totalPages={Math.max(1, pagination.total_pages)} buildHref={buildPageHref} />
        </>
      }
    >
      <table className="w-full min-w-[980px] border-collapse text-left">
        <thead className="border-b border-border text-[9px] uppercase text-foreground/45">
          <tr>
            <th className="px-5 py-4 font-medium">Username</th>
            <th className="px-4 py-4 font-medium">Email</th>
            <th className="px-4 py-4 font-medium">Role</th>
            <th className="px-4 py-4 font-medium">Level</th>
            <th className="px-4 py-4 font-medium">Status</th>
            <th className="px-4 py-4 font-medium">Terdaftar</th>
            <th className="sticky right-0 z-10 bg-surface px-5 py-4 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {safeUsers.map((user) => (
            <tr key={user.user_id} className="group transition-colors hover:bg-white/[0.025]">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-purple/15 text-[10px] font-bold text-purple">
                    {initials(user.username)}
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- Avatar hosts are dynamic backend data and cannot be safely allowlisted at build time.
                      <img src={user.avatar_url} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                    ) : null}
                  </span>
                  <strong className="text-xs font-semibold">{user.username}</strong>
                </div>
              </td>
              <td className="px-4 py-3.5 text-xs text-foreground/45">{user.email}</td>
              <td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase ${user.role_name === "admin" ? "bg-purple/15 text-purple" : "bg-surface-muted text-foreground/50"}`}>{user.role_name.replace("_", " ")}</span></td>
              <td className="px-4 py-3.5 font-mono text-[10px]">LV {user.current_level}</td>
              <td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[8px] font-bold capitalize ${statusClasses[user.status] ?? "bg-surface-muted text-foreground/55"}`}>{user.status}</span></td>
              <td className="px-4 py-3.5 text-xs text-foreground/45">{formatDate(user.created_at)}</td>
              <td className="sticky right-0 bg-surface px-5 py-3.5 group-hover:bg-surface-elevated">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/users/${encodeURIComponent(user.username)}`} prefetch={false} aria-label={`Lihat ${user.username}`} className="grid size-9 cursor-pointer place-items-center rounded-xl border border-border-strong text-foreground/45 transition-colors hover:border-purple hover:text-purple"><AdminIcon name="view" className="size-4" /></Link>
                  <Link href={`/admin/users/${encodeURIComponent(user.username)}/edit`} prefetch={false} aria-label={`Edit ${user.username}`} className="grid size-9 cursor-pointer place-items-center rounded-xl border border-border-strong text-orange transition-colors hover:border-orange hover:bg-orange/8"><AdminIcon name="edit" className="size-4" /></Link>
                </div>
              </td>
            </tr>
          ))}
          {safeUsers.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <AdminEmptyState title="Pengguna tidak ditemukan" description="Tidak ada pengguna yang cocok dengan kata kunci atau filter yang dipilih." />
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </AdminTableShell>
  );
}
