import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type {
  AdminItemCategory,
  AdminItemDetailResponse,
  AdminItemMutationResponse,
  AdminItemsQuery,
  AdminItemsResponse,
  DeleteAdminItemResponse,
} from "../types/admin-item";
import { uniqueItemCategories } from "../data/item-category-utils";

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

export async function getAdminItemCategoriesFromCatalog(accessToken: string): Promise<AdminItemCategory[]> {
  const catalog = await getAdminItems({ page: 1, limit: 10 }, accessToken);
  let categories = uniqueItemCategories(catalog.items);

  // Until the backend exposes a category lookup, use the documented avatar
  // catalog query when the unfiltered endpoint returns no rows.
  if (categories.length === 0) {
    const avatarCatalog = await getAdminItems({
      page: 1,
      limit: 10,
      categoryCode: "avatar",
      status: "active",
      isVisible: true,
    }, accessToken);
    categories = uniqueItemCategories(avatarCatalog.items);
  }

  return categories;
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
