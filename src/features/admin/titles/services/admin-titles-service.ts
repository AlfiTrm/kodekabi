import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type {
  AdminTitleDetailResponse,
  AdminTitleMutationResponse,
  AdminTitlesQuery,
  AdminTitlesResponse,
  DeleteAdminTitleResponse,
} from "../types/admin-title";

export async function getAdminTitles(query: AdminTitlesQuery, accessToken: string) {
  const searchParams = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.search) searchParams.set("search", query.search);

  const result = await serverApi<AdminTitlesResponse>(`/admin/titles?${searchParams.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    titles: Array.isArray(result.titles) ? result.titles : [],
    pagination: result.pagination ?? {
      page: query.page,
      limit: query.limit,
      total: 0,
      total_pages: 0,
    },
  };
}

export function getAdminTitleDetail(titleId: string, accessToken: string) {
  return serverApi<AdminTitleDetailResponse>(`/admin/titles/${encodeURIComponent(titleId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function createAdminTitle(payload: FormData, accessToken: string) {
  return serverApi<AdminTitleMutationResponse, FormData>("/admin/titles", {
    method: "POST",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function updateAdminTitle(titleId: string, payload: FormData, accessToken: string) {
  return serverApi<AdminTitleMutationResponse, FormData>(`/admin/titles/${encodeURIComponent(titleId)}`, {
    method: "PATCH",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function deleteAdminTitle(titleId: string, accessToken: string) {
  return serverApi<DeleteAdminTitleResponse>(`/admin/titles/${encodeURIComponent(titleId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
