import type { Metadata } from "next";

import { AdminCasesPage } from "@/src/features/admin/cases/containers/admin-cases-page";

export const metadata: Metadata = {
  title: "Case CMS | KODEKABI Admin",
};

type AdminCasesRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOf(value: string | string[] | undefined, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export default async function AdminCasesRoute({ searchParams }: AdminCasesRouteProps) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(valueOf(params.page, "1"), 10);

  return (
    <AdminCasesPage
      search={valueOf(params.search).trim()}
      status={valueOf(params.status, "all")}
      difficulty={valueOf(params.difficulty, "all")}
      page={Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1}
    />
  );
}
