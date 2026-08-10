import type { Metadata } from "next";

import { AdminUsersPage } from "@/src/features/admin/users/containers/admin-users-page";

export const metadata: Metadata = {
  title: "Users | KODEKABI Admin",
};

type AdminUsersRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOf(value: string | string[] | undefined, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export default async function AdminUsersRoute({ searchParams }: AdminUsersRouteProps) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(valueOf(params.page, "1"), 10);

  return (
    <AdminUsersPage
      search={valueOf(params.search).trim()}
      role={valueOf(params.role, "all")}
      status={valueOf(params.status, "all")}
      page={Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1}
    />
  );
}
