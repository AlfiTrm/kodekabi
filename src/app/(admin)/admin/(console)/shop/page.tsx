import type { Metadata } from "next";

import { AdminItemsPage } from "@/src/features/admin/shop/containers/admin-items-page";

export const metadata: Metadata = { title: "Shop & Redeem | KODEKABI Admin" };

export default async function AdminShopRoute({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rawPage = typeof params.page === "string" ? Number.parseInt(params.page, 10) : 1;
  const tab = params.tab === "redeem" ? "redeem" : params.tab === "codes" ? "codes" : "items";
  return <AdminItemsPage page={Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1} tab={tab} />;
}
