import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type { AdminRole, AdminUserDetailResponse, AdminUsersQuery, AdminUsersResponse, CreateAdminUserRequest, CreateAdminUserResponse, DeleteAdminUserResponse, UpdateAdminUserAccessRequest, UpdateAdminUserAccessResponse, UpdateAdminUserRequest, UpdateAdminUserResponse } from "../types/admin-user";

export async function getAdminUsers(query: AdminUsersQuery, accessToken: string) {
  const searchParams = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.search) searchParams.set("search", query.search);
  if (query.role && query.role !== "all") searchParams.set("role", query.role);
  if (query.status && query.status !== "all") searchParams.set("status", query.status);

  const result = await serverApi<AdminUsersResponse>(`/admin/users?${searchParams.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    ...result,
    users: Array.isArray(result.users) ? result.users : [],
    pagination: result.pagination ?? {
      page: query.page,
      limit: query.limit,
      total: 0,
      total_pages: 0,
    },
  };
}

export async function getAdminRoles(accessToken: string) {
  const roles = await serverApi<AdminRole[] | null>("/admin/roles", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return Array.isArray(roles) ? roles : [];
}

export async function getAdminUserDetail(userId: string, accessToken: string) {
  const result = await serverApi<AdminUserDetailResponse>(`/admin/users/${encodeURIComponent(userId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    ...result,
    recent_progress: {
      items: Array.isArray(result.recent_progress?.items) ? result.recent_progress.items : [],
    },
  };
}

export async function resolveAdminUserId(username: string, accessToken: string) {
  const result = await getAdminUsers({ search: username, page: 1, limit: 20 }, accessToken);
  return result.users.find((user) => user.username.toLocaleLowerCase() === username.toLocaleLowerCase())?.user_id ?? null;
}

export function createAdminUser(payload: CreateAdminUserRequest, accessToken: string) {
  return serverApi<CreateAdminUserResponse, CreateAdminUserRequest>("/admin/users", {
    method: "POST",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function updateAdminUser(userId: string, payload: UpdateAdminUserRequest, accessToken: string) {
  return serverApi<UpdateAdminUserResponse, UpdateAdminUserRequest>(`/admin/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function updateAdminUserAccess(userId: string, payload: UpdateAdminUserAccessRequest, accessToken: string) {
  return serverApi<UpdateAdminUserAccessResponse, UpdateAdminUserAccessRequest>(`/admin/users/${encodeURIComponent(userId)}/access`, {
    method: "PATCH",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function deleteAdminUser(userId: string, accessToken: string) {
  return serverApi<DeleteAdminUserResponse>(`/admin/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
