import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type { AdminAuditLogsQuery, AdminAuditLogsResponse } from "../types/admin-audit-log";

export async function getAdminAuditLogs(query: AdminAuditLogsQuery, accessToken: string) {
  const params = new URLSearchParams({ page: String(query.page), limit: String(query.limit) });
  if (query.actorAdminId && query.actorAdminId !== "all") params.set("actor_admin_id", query.actorAdminId);
  if (query.actionType && query.actionType !== "all") params.set("action_type", query.actionType);
  if (query.module && query.module !== "all") params.set("module", query.module);
  if (query.targetType && query.targetType !== "all") params.set("target_type", query.targetType);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.range && query.range !== "custom") params.set("range", query.range);

  const result = await serverApi<AdminAuditLogsResponse>(`/admin/audit-logs?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    auditLogs: Array.isArray(result.audit_logs) ? result.audit_logs : [],
    pagination: result.pagination ?? { page: query.page, limit: query.limit, total: 0, total_pages: 0 },
  };
}
