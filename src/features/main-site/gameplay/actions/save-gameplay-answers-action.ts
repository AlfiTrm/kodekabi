"use server";

import { cookies } from "next/headers";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { serverApi } from "@/src/shared/services/api/server-api";

import type { GameplayAnswer, SaveAnswersResponse } from "../types/gameplay";

export async function saveGameplayAnswersAction(sessionId: string, sessionVersion: number, answers: GameplayAnswer[], idempotencyKey: string) {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) return { success: false as const, message: "Sesi pengguna sudah berakhir." };

  try {
    const data = await serverApi<SaveAnswersResponse, { session_version: number; answers: GameplayAnswer[] }>(
      `/users/sessions/${encodeURIComponent(sessionId)}/answers`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}`, "Idempotency-Key": idempotencyKey },
        body: { session_version: sessionVersion, answers },
      },
    );
    return { success: true as const, data };
  } catch (error) {
    return { success: false as const, message: error instanceof Error ? error.message : "Jawaban gagal disimpan." };
  }
}
