import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ApiError } from "@/src/shared/services/api/api-error";
import { AdminDataError } from "@/src/features/admin/_shared/components/admin-data-error";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminItemDetailPage } from "@/src/features/admin/shop/containers/admin-item-detail-page";
import { uniqueItemCategories } from "@/src/features/admin/shop/data/item-category-utils";
import { getAdminItemCategories, getAdminItemDetail } from "@/src/features/admin/shop/services/admin-items-service";

export const metadata: Metadata = { title: "Detail Item | KODEKABI Admin" };

export default async function AdminItemDetailRoute({ params, searchParams }: { params: Promise<{ itemId: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { itemId } = await params;
  const query = await searchParams;
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  let detail;
  let lookupCategories;
  try {
    [detail, lookupCategories] = await Promise.all([
      getAdminItemDetail(itemId, accessToken),
      getAdminItemCategories(accessToken).catch(() => []),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <div className="mx-auto w-full max-w-[1300px] px-5 py-8 sm:px-8 lg:px-10"><AdminDataError title="Detail item gagal dimuat." description="Periksa sesi admin atau koneksi API, lalu muat ulang halaman." /></div>;
  }

  const categories = uniqueItemCategories([], detail.item.category);
  lookupCategories.forEach((category) => {
    if (!categories.some((item) => item.item_category_id === category.item_category_id)) categories.push(category);
  });
  return <AdminItemDetailPage item={detail.item} categories={categories} edit={query.edit === "1"} />;
}
