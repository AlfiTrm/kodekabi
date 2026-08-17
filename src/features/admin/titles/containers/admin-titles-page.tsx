import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminDataError } from "../../_shared/components/admin-data-error";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { AdminTableSkeleton } from "../../_shared/components/admin-table-skeleton";
import { buildAdminQueryHref } from "../../_shared/utils/admin-query";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { TitleFilters } from "../components/title-filters";
import { TitlesTable } from "../components/titles-table";
import { getAdminTitles } from "../services/admin-titles-service";

type AdminTitlesPageProps = {
  search: string;
  page: number;
};

export function AdminTitlesPage(props: AdminTitlesPageProps) {
  const queryKey = `${props.search}|${props.page}`;

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Titles"
        description="Kelola gelar (title) yang dapat dikenakan pemain KODEKABI."
        action={<Link href="/admin/titles/add" className="inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-xs font-semibold text-button-ink transition-colors hover:bg-purple hover:text-white">+ Tambah Title</Link>}
      />
      <div className="mt-7"><TitleFilters search={props.search} /></div>
      <Suspense key={queryKey} fallback={<AdminTableSkeleton />}>
        <AdminTitlesResult {...props} />
      </Suspense>
    </div>
  );
}

async function AdminTitlesResult({ search, page }: AdminTitlesPageProps) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  let result: Awaited<ReturnType<typeof getAdminTitles>>;
  try {
    result = await getAdminTitles({ search, page, limit: 10 }, accessToken);
  } catch {
    return <AdminDataError title="Data title gagal dimuat." description="Periksa sesi admin atau koneksi API, lalu muat ulang halaman." />;
  }

  const lastPage = Math.max(1, result.pagination.total_pages);
  if (page > lastPage) {
    const currentQuery = new URLSearchParams({ search });
    redirect(buildAdminQueryHref("/admin/titles", currentQuery, { page: lastPage }, { resetPage: false }));
  }

  return <div className="mt-5"><TitlesTable titles={result.titles} pagination={result.pagination} query={{ search }} /></div>;
}
