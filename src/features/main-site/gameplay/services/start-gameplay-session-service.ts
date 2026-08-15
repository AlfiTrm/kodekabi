import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type { GameplayResponse, GameplaySession } from "../types/gameplay";

type StartGameplaySessionResponse = {
  session: GameplaySession;
  gameplay: GameplayResponse;
};

export async function startGameplaySession(caseId: string, accessToken: string) {
  const path = `/users/cases/${encodeURIComponent(caseId)}/sessions`;
  console.log("[gameplay] starting session", { caseId, path, hasAccessToken: Boolean(accessToken) });

  try {
    const result = await serverApi<StartGameplaySessionResponse, { initial_assessment: string; initial_confidence: number }>(path, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { initial_assessment: "need_check", initial_confidence: 60 },
    });

    console.log("[gameplay] session started", {
      caseId,
      sessionId: result.session.case_session_id,
      sessionVersion: result.session.session_version,
    });
    return result;
  } catch (error) {
    console.error("[gameplay] failed to start session", { caseId, error });
    throw error;
  }
}
