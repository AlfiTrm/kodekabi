"use server";

import { cookies } from "next/headers";

import { USER_ACCESS_COOKIE } from "@/src/features/auth/login/constants/user-auth";
import { serverApi } from "@/src/shared/services/api/server-api";

import type { OpenEvidenceResponse } from "../types/gameplay";

export async function openGameplayEvidenceAction(
  sessionId: string,
  evidenceId: string,
  sessionVersion: number,
  idempotencyKey: string,
) {
  const accessToken = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!accessToken) return { success: false as const, message: "Sesi pengguna sudah berakhir." };

  try {
    const data = await serverApi<OpenEvidenceResponse, { session_version: number }>(
      `/users/sessions/${encodeURIComponent(sessionId)}/evidences/${encodeURIComponent(evidenceId)}/open`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Idempotency-Key": idempotencyKey,
        },
        body: { session_version: sessionVersion },
      },
    );

    return { success: true as const, data };
  } catch (error) {
    return { success: false as const, message: error instanceof Error ? error.message : "Evidence gagal dibuka." };
  }
}
