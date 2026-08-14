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

  const apiRelatedItems = Array.isArray(result.related_items) ? result.related_items : [];
  if (apiRelatedItems.length > 0) {
    return {
      ...result,
      related_items: apiRelatedItems.filter((item) => item.item_id !== result.item.item_id),
    };
  }

  const category = result.item.category_code === "avatar" ? "avatar" : "all";
  const catalog = await getUserShopItems({ category, page: 1, limit: 12 }, accessToken).catch(() => null);
  const fallbackRelatedItems = catalog?.items
    .filter((item) => item.item_id !== result.item.item_id && item.category_code === result.item.category_code)
    .slice(0, 8) ?? [];

  return {
    ...result,
    related_items: fallbackRelatedItems,
  };
}
