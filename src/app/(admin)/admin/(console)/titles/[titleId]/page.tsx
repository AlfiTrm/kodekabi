import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { AdminDataError } from "@/src/features/admin/_shared/components/admin-data-error";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminTitleDetailPage } from "@/src/features/admin/titles/containers/admin-title-detail-page";
import { getAdminTitleDetail } from "@/src/features/admin/titles/services/admin-titles-service";

export const metadata: Metadata = { title: "Detail Title | KODEKABI Admin" };

export default async function AdminTitleDetailRoute({ params, searchParams }: { params: Promise<{ titleId: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { titleId } = await params;
  const query = await searchParams;
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let detail;
  try {
    detail = await getAdminTitleDetail(titleId, accessToken);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <div className="mx-auto w-full max-w-[1300px] px-5 py-8 sm:px-8 lg:px-10"><AdminDataError title="Detail title gagal dimuat." description="Periksa sesi admin atau koneksi API, lalu muat ulang halaman." /></div>;
  }

  return <AdminTitleDetailPage title={detail.title} edit={query.edit === "1"} />;
}
