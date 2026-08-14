export type AdminAuditLog = {
  admin_audit_log_id: string;
  actor_admin_id: string | null;
  actor_name: string;
  actor_email: string;
  action_type: string;
  module: string;
  target_type: string;
  target_id: string;
  target_label: string;
  detail: string;
  created_at: string;
};

export type AdminAuditLogPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type AdminAuditLogsResponse = {
  audit_logs: AdminAuditLog[] | null;
  pagination: AdminAuditLogPagination | null;
};

export type AdminAuditLogsQuery = {
  actorAdminId?: string;
  actionType?: string;
  module?: string;
  targetType?: string;
  from?: string;
  to?: string;
  range?: string;
  page: number;
  limit: number;
};
