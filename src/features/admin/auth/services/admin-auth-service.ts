import "server-only";

import { serverApi, serverApiWithMeta } from "@/src/shared/services/api/server-api";
import type { AdminLoginRequest, AdminLoginResponse, AdminVerifyOtpRequest, AdminVerifyOtpResponse } from "../types/admin-auth";

export async function loginAdmin(credentials: AdminLoginRequest) {
  const response = await serverApiWithMeta<AdminLoginResponse, AdminLoginRequest>("/auth/login", {
    method: "POST",
    body: credentials,
    timeoutMs: 60_000,
  });

  const headerSessionToken = response.headers.get("x-session-token");

  return {
    ...response.data,
    session_token: response.data.session_token ?? headerSessionToken ?? undefined,
  };
}

export function verifyAdminOtp(code: string, sessionToken: string) {
  return serverApi<AdminVerifyOtpResponse, AdminVerifyOtpRequest>("/auth/login/admin/verify-otp", {
    method: "POST",
    body: { code },
    headers: { "X-Session-Token": sessionToken },
  });
}
