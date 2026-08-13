import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminDataError } from "../../_shared/components/admin-data-error";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { AdminTableSkeleton } from "../../_shared/components/admin-table-skeleton";
import { buildAdminQueryHref } from "../../_shared/utils/admin-query";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { getAdminUsers } from "../../users/services/admin-users-service";
import { AuditLogFilters } from "../components/audit-log-filters";
import { AuditLogTable } from "../components/audit-log-table";
import { getAdminAuditLogs } from "../services/admin-audit-log-service";

type AdminAuditLogPageProps = {
  actor: string;
  action: string;
  module: string;
  range: string;
  from: string;
  to: string;
  page: number;
};

export async function AdminAuditLogPage(props: AdminAuditLogPageProps) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  let adminOptions: { value: string; label: string }[] = [{ value: "all", label: "Semua Admin" }];
  try {
    const admins = await getAdminUsers({ role: "admin", page: 1, limit: 100 }, accessToken);
    adminOptions = [
      ...adminOptions,
      ...admins.users.map((admin) => ({ value: admin.user_id, label: `${admin.username}${admin.email ? ` · ${admin.email}` : ""}` })),
    ];
  } catch {
    // Audit logs remain usable if the optional actor directory is unavailable.
  }

  const queryKey = `${props.actor}|${props.action}|${props.module}|${props.range}|${props.from}|${props.to}|${props.page}`;

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader title="Audit Log" description="Riwayat aktivitas administrator konsol KODEKABI" />
      <div className="mt-7"><AuditLogFilters values={props} adminOptions={adminOptions} /></div>
      <Suspense key={queryKey} fallback={<AdminTableSkeleton />}><AdminAuditLogResult {...props} accessToken={accessToken} /></Suspense>
    </div>
  );
}

async function AdminAuditLogResult({ accessToken, ...props }: AdminAuditLogPageProps & { accessToken: string }) {
  let result: Awaited<ReturnType<typeof getAdminAuditLogs>>;
  try {
    result = await getAdminAuditLogs({ actorAdminId: props.actor, actionType: props.action, module: props.module, from: props.from, to: props.to, range: props.range, page: props.page, limit: 10 }, accessToken);
  } catch {
    return <AdminDataError title="Audit log gagal dimuat." description="Periksa sesi admin atau koneksi API, lalu muat ulang halaman." />;
  }

  const lastPage = Math.max(1, result.pagination.total_pages);
  if (props.page > lastPage) {
    const query = new URLSearchParams({ actor: props.actor, action: props.action, module: props.module, range: props.range, from: props.from, to: props.to });
    redirect(buildAdminQueryHref("/admin/audit-log", query, { page: lastPage }, { resetPage: false }));
  }

  const query = { actor: props.actor, action: props.action, module: props.module, range: props.range, from: props.from, to: props.to };
  return <div className="mt-5"><AuditLogTable logs={result.auditLogs} pagination={result.pagination} query={query} /></div>;
}
