"use server";

import { cookies } from "next/headers";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { serverApi } from "@/src/shared/services/api/server-api";

import type { SubmitGameplayResponse } from "../types/gameplay";

export async function submitGameplaySessionAction(
  sessionId: string,
  sessionVersion: number,
  payload: { final_decision: string; final_confidence: number; reason: string },
  idempotencyKey: string,
) {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) return { success: false as const, message: "Sesi pengguna sudah berakhir." };

  try {
    const data = await serverApi<SubmitGameplayResponse, { session_version: number; final_decision: string; final_confidence: number; reason: string }>(
      `/users/sessions/${encodeURIComponent(sessionId)}/submit`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Idempotency-Key": idempotencyKey },
        body: { session_version: sessionVersion, ...payload },
      },
    );
    return { success: true as const, data };
  } catch (error) {
    return { success: false as const, message: error instanceof Error ? error.message : "Kasus gagal dikirim." };
  }
}
