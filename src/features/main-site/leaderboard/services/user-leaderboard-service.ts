import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";

import type { UserLeaderboardResponse } from "../types/leaderboard";

export async function getUserLeaderboard(page: number, limit: number, accessToken: string) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const result = await serverApi<UserLeaderboardResponse>(`/users/leaderboard?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    entries: Array.isArray(result.entries) ? result.entries : [],
    me: result.me ?? null,
    pagination: result.pagination ?? { page, limit, total: 0, total_pages: 0 },
  };
}
