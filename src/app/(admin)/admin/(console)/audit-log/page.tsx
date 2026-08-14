import type { Metadata } from "next";

import { AdminAuditLogPage } from "@/src/features/admin/audit-log/containers/admin-audit-log-page";

export const metadata: Metadata = { title: "Audit Log | KODEKABI Admin" };

type AdminAuditLogRouteProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function valueOf(value: string | string[] | undefined, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export default async function AdminAuditLogRoute({ searchParams }: AdminAuditLogRouteProps) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(valueOf(params.page, "1"), 10);
  return <AdminAuditLogPage actor={valueOf(params.actor, "all")} action={valueOf(params.action, "all")} module={valueOf(params.module, "all")} range={valueOf(params.range, "today")} from={valueOf(params.from)} to={valueOf(params.to)} page={Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1} />;
}
