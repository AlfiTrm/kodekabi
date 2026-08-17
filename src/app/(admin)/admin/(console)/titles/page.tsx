import type { Metadata } from "next";

import { AdminTitlesPage } from "@/src/features/admin/titles/containers/admin-titles-page";

export const metadata: Metadata = { title: "Titles | KODEKABI Admin" };

export default async function AdminTitlesRoute({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rawPage = typeof params.page === "string" ? Number.parseInt(params.page, 10) : 1;
  const search = typeof params.search === "string" ? params.search.trim() : "";
  return <AdminTitlesPage search={search} page={Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1} />;
}
