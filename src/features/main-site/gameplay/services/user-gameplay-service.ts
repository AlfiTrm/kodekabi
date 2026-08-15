import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";

import type { GameplayResponse } from "../types/gameplay";

export async function getGameplaySession(sessionId: string, accessToken: string) {
  const path = `/users/sessions/${encodeURIComponent(sessionId)}/gameplay`;

  console.log("[gameplay] fetching session", {
    sessionId,
    path,
    hasAccessToken: Boolean(accessToken),
  });

  try {
    const result = await serverApi<GameplayResponse>(path, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log("[gameplay] session fetched", {
      sessionId,
      caseId: result.session?.case_id,
      status: result.session?.status,
    });

    return result;
  } catch (error) {
    console.error("[gameplay] failed to fetch session", {
      sessionId,
      error,
    });
    throw error;
  }
}
