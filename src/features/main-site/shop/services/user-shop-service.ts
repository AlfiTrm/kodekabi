import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";

import type { ShopItemDetailResponse, ShopItemsQuery, ShopItemsResponse } from "../types/shop";

export async function getUserShopItems(query: ShopItemsQuery, accessToken: string) {
  const searchParams = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.category !== "all") searchParams.set("category_code", query.category);
  if (query.search?.trim()) searchParams.set("search", query.search.trim());

  const result = await serverApi<ShopItemsResponse>(`/users/shop/items?${searchParams.toString()}`, {
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

export async function getUserShopItem(itemId: string, accessToken: string) {
  const result = await serverApi<ShopItemDetailResponse>(`/users/shop/items/${encodeURIComponent(itemId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    ...result,
    related_items: Array.isArray(result.related_items) ? result.related_items : [],
  };
}
