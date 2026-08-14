import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminRedeemItemDetailPage } from "@/src/features/admin/shop/containers/admin-redeem-item-detail-page";
import { getAdminRedeemItemDetail, getAdminRedeemTypes } from "@/src/features/admin/shop/services/admin-redeem-items-service";

export const metadata: Metadata = { title: "Detail Item Redeem | KODEKABI Admin" };

export default async function AdminRedeemItemDetailRoute({ params, searchParams }: { params: Promise<{ redeemItemId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  const { redeemItemId } = await params;
  let detail;
  try { detail = await getAdminRedeemItemDetail(redeemItemId, token); }
  catch { notFound(); }
  const types = [detail.item.type];
  try {
    const result = await getAdminRedeemTypes(token);
    result.forEach((type) => {
      if (!types.some((item) => item.code === type.code)) types.push(type);
    });
  } catch { /* The current type keeps the editor usable during lookup failure. */ }
  const query = await searchParams;
  return <AdminRedeemItemDetailPage item={detail.item} types={types} edit={query.edit === "1"} />;
}
