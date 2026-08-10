import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { buildAdminQueryHref } from "../../_shared/utils/admin-query";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { UserFilters } from "../components/user-filters";
import { UsersTable } from "../components/users-table";
import { getAdminUsers } from "../services/admin-users-service";

type AdminUsersPageProps = {
  search: string;
  role: string;
  status: string;
  page: number;
};

export function AdminUsersPage(props: AdminUsersPageProps) {
  const queryKey = `${props.search}|${props.role}|${props.status}|${props.page}`;

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Users"
        description="Direktori pengguna KODEKABI"
        action={<Link href="/admin/users/add" className="inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-orange">+ Tambah User</Link>}
      />
      <div className="mt-7">
        <UserFilters search={props.search} role={props.role} status={props.status} />
      </div>
      <Suspense key={queryKey} fallback={<UsersTableSkeleton />}>
        <AdminUsersResult {...props} />
      </Suspense>
    </div>
  );
}

async function AdminUsersResult({ search, role, status, page }: AdminUsersPageProps) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  let result: Awaited<ReturnType<typeof getAdminUsers>>;
  try {
    result = await getAdminUsers({ search, role, status, page, limit: 10 }, accessToken);
  } catch {
    return (
      <section className="mt-5 rounded-2xl border border-red/25 bg-red/8 px-6 py-16 text-center">
        <h2 className="text-sm font-semibold text-red">Data pengguna gagal dimuat.</h2>
        <p className="mt-2 text-xs text-foreground/45">Periksa sesi admin atau koneksi API, lalu muat ulang halaman.</p>
      </section>
    );
  }

  const lastPage = Math.max(1, result.pagination.total_pages);
  if (page > lastPage) {
    const currentQuery = new URLSearchParams({ search, role, status });
    redirect(buildAdminQueryHref("/admin/users", currentQuery, { page: lastPage }, { resetPage: false }));
  }

  return <div className="mt-5"><UsersTable users={result.users} pagination={result.pagination} query={{ search, role, status }} /></div>;
}

function UsersTableSkeleton() {
  return (
    <div className="mt-5 animate-pulse overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="h-12 border-b border-border bg-surface-muted/40" />
      {Array.from({ length: 7 }, (_, index) => <div key={index} className="h-16 border-b border-border last:border-0" />)}
    </div>
  );
}
