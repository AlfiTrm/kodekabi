import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";

import type { RedeemItemsResponse } from "../types/redeem";

export async function getUserRedeemItems(query: { search: string; page: number; limit: number }, accessToken: string) {
  const params = new URLSearchParams({ page: String(query.page), limit: String(query.limit) });
  if (query.search.trim()) params.set("search", query.search.trim());

  const result = await serverApi<RedeemItemsResponse>(`/users/redeem/items?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    items: Array.isArray(result.items) ? result.items : [],
    pagination: result.pagination ?? { page: query.page, limit: query.limit, total: 0, total_pages: 0 },
  };
}
