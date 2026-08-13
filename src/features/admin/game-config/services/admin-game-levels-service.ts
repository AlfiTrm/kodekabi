import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type { AdminGameLevel, AdminGameLevelPayload, AdminGameLevelsResponse } from "../types/admin-game-level";

const gameLevelsPath = "/admin/game-levels";

export async function getAdminGameLevels(params: { page: number; limit?: number; search?: string }, accessToken: string) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit ?? 10) });
  if (params.search) query.set("search", params.search);

  const result = await serverApi<AdminGameLevelsResponse>(`${gameLevelsPath}?${query}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return { ...result, levels: Array.isArray(result.levels) ? result.levels : [] };
}

export async function createAdminGameLevel(payload: AdminGameLevelPayload, accessToken: string) {
  const result = await serverApi<{ level: AdminGameLevel }, AdminGameLevelPayload>(gameLevelsPath, {
    method: "POST",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return result.level;
}

export async function updateAdminGameLevel(levelId: string, payload: AdminGameLevelPayload, accessToken: string) {
  const result = await serverApi<{ level: AdminGameLevel }, AdminGameLevelPayload>(`${gameLevelsPath}/${encodeURIComponent(levelId)}`, {
    method: "PATCH",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return result.level;
}

export async function deleteAdminGameLevel(levelId: string, accessToken: string) {
  return serverApi<{ game_level_id: string }>(`${gameLevelsPath}/${encodeURIComponent(levelId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
