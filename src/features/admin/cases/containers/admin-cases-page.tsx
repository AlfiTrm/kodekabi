import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminDataError } from "../../_shared/components/admin-data-error";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { AdminTableSkeleton } from "../../_shared/components/admin-table-skeleton";
import { buildAdminQueryHref } from "../../_shared/utils/admin-query";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { CaseFilters } from "../components/case-filters";
import { CasesTable } from "../components/cases-table";
import { getAdminCases } from "../services/admin-cases-service";

export type AdminCasesPageProps = {
  search: string;
  status: string;
  difficulty: string;
  page: number;
};

export function AdminCasesPage(props: AdminCasesPageProps) {
  const queryKey = `${props.search}|${props.status}|${props.difficulty}|${props.page}`;

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Case CMS"
        description="Manajemen kasus investigasi"
        action={<Link href="/admin/cases/add" className="inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-orange">+ Tambah Case Baru</Link>}
      />
      <div className="mt-7">
        <CaseFilters search={props.search} status={props.status} difficulty={props.difficulty} />
      </div>
      <Suspense key={queryKey} fallback={<AdminTableSkeleton rows={5} />}>
        <AdminCasesResult {...props} />
      </Suspense>
    </div>
  );
}

async function AdminCasesResult({ search, status, difficulty, page }: AdminCasesPageProps) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  let result: Awaited<ReturnType<typeof getAdminCases>>;
  try {
    result = await getAdminCases({ search, status, difficulty, page, limit: 10 }, accessToken);
  } catch {
    return <AdminDataError title="Data case gagal dimuat." description="Periksa sesi admin atau koneksi API, lalu muat ulang halaman." />;
  }

  const lastPage = Math.max(1, result.pagination.total_pages);
  if (page > lastPage) {
    const currentQuery = new URLSearchParams({ search, status, difficulty });
    redirect(buildAdminQueryHref("/admin/cases", currentQuery, { page: lastPage }, { resetPage: false }));
  }

  return <div className="mt-5"><CasesTable cases={result.cases} pagination={result.pagination} query={{ search, status, difficulty }} /></div>;
}
