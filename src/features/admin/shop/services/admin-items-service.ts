import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type {
  AdminItemCategoriesResponse,
  AdminItemCategory,
  AdminItemDetailResponse,
  AdminItemMutationResponse,
  AdminItemsQuery,
  AdminItemsResponse,
  DeleteAdminItemResponse,
} from "../types/admin-item";

export async function getAdminItems(query: AdminItemsQuery, accessToken: string) {
  const searchParams = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.categoryCode) searchParams.set("category_code", query.categoryCode);
  if (query.status) searchParams.set("status", query.status);
  if (query.isVisible !== undefined) searchParams.set("is_visible", String(query.isVisible));

  const result = await serverApi<AdminItemsResponse>(`/admin/items?${searchParams.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    items: Array.isArray(result.items) ? result.items : [],
    pagination: result.pagination ?? {
      page: query.page,
      limit: query.limit,
      total: 0,
      total_pages: 0,
    },
  };
}

export async function getAdminItemCategories(accessToken: string): Promise<AdminItemCategory[]> {
  const result = await serverApi<AdminItemCategoriesResponse>("/users/item-categories", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return Array.isArray(result.categories)
    ? [...result.categories].sort((left, right) => left.name.localeCompare(right.name, "id-ID"))
    : [];
}

export function getAdminItemDetail(itemId: string, accessToken: string) {
  return serverApi<AdminItemDetailResponse>(`/admin/items/${encodeURIComponent(itemId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function createAdminItem(payload: FormData, accessToken: string) {
  return serverApi<AdminItemMutationResponse, FormData>("/admin/items", {
    method: "POST",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function updateAdminItem(itemId: string, payload: FormData, accessToken: string) {
  return serverApi<AdminItemMutationResponse, FormData>(`/admin/items/${encodeURIComponent(itemId)}`, {
    method: "PATCH",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function deleteAdminItem(itemId: string, accessToken: string) {
  return serverApi<DeleteAdminItemResponse>(`/admin/items/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
