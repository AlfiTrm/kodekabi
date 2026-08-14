import "server-only";

import { cookies } from "next/headers";

import { REGISTER_EMAIL_COOKIE, REGISTER_SESSION_COOKIE, REGISTER_SESSION_FALLBACK_SECONDS } from "../constants/register-auth";
import { getRegistrationSession } from "../services/register-auth-service";
import type { RegistrationSession } from "../types/register-auth";

export function getRegistrationSessionDuration(expiresAt?: string) {
  const expiresAtMs = expiresAt ? Date.parse(expiresAt) : Number.NaN;
  if (!Number.isFinite(expiresAtMs)) return REGISTER_SESSION_FALLBACK_SECONDS;
  return Math.max(60, Math.floor((expiresAtMs - Date.now()) / 1000));
}

export async function readRegistrationSession(): Promise<RegistrationSession | null> {
  const token = (await cookies()).get(REGISTER_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    return await getRegistrationSession(token);
  } catch {
    return null;
  }
}

export async function readRegistrationToken() {
  return (await cookies()).get(REGISTER_SESSION_COOKIE)?.value ?? null;
}

export async function saveRegistrationCookies(sessionToken: string, email: string, expiresAt?: string) {
  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    maxAge: getRegistrationSessionDuration(expiresAt),
    path: "/register",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  cookieStore.set(REGISTER_SESSION_COOKIE, sessionToken, options);
  cookieStore.set(REGISTER_EMAIL_COOKIE, email, options);
}

export async function clearRegistrationCookies() {
  const cookieStore = await cookies();
  const expiredOptions = { httpOnly: true, maxAge: 0, path: "/register", sameSite: "lax" as const, secure: process.env.NODE_ENV === "production" };
  cookieStore.set(REGISTER_SESSION_COOKIE, "", expiredOptions);
  cookieStore.set(REGISTER_EMAIL_COOKIE, "", expiredOptions);
}
