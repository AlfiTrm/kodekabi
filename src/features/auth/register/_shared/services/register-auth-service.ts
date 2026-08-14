import "server-only";

import { serverApi, serverApiWithMeta } from "@/src/shared/services/api/server-api";
import type {
  RegistrationAvatar,
  RegistrationAvatarsResponse,
  RegistrationCompleteResponse,
  RegistrationSession,
  RegistrationStartResponse,
} from "../types/register-auth";

export async function startRegistration(email: string, password: string) {
  const response = await serverApiWithMeta<RegistrationStartResponse, { email: string; password: string }>("/auth/register/start", {
    method: "POST",
    body: { email, password },
  });

  return {
    ...response.data,
    session_token: response.data.session_token ?? response.headers.get("x-session-token") ?? undefined,
  };
}

export function verifyRegistrationOtp(code: string, sessionToken: string) {
  return serverApi<RegistrationSession, { code: string }>("/auth/register/verify-otp", {
    method: "POST",
    body: { code },
    headers: { "X-Session-Token": sessionToken },
  });
}

export function selectRegistrationAvatar(avatarId: string, sessionToken: string) {
  return serverApi<RegistrationSession, { avatar_id: string }>("/auth/register/avatar", {
    method: "POST",
    body: { avatar_id: avatarId },
    headers: { "X-Session-Token": sessionToken },
  });
}

export function completeRegistration(username: string, title: string, sessionToken: string) {
  return serverApi<RegistrationCompleteResponse, { username: string; title: string }>("/auth/register/complete", {
    method: "POST",
    body: { username, title },
    headers: { "X-Session-Token": sessionToken },
  });
}

export function getRegistrationSession(sessionToken: string) {
  return serverApi<RegistrationSession>("/auth/session", {
    method: "GET",
    headers: { "X-Session-Token": sessionToken },
  });
}

export async function getRegistrationAvatars(): Promise<RegistrationAvatar[]> {
  const result = await serverApi<RegistrationAvatarsResponse>("/avatars", { method: "GET" });
  return Array.isArray(result.avatars) ? result.avatars.filter((avatar) => avatar.status === "active") : [];
}

