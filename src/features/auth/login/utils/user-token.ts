import "server-only";

import { USER_ACCESS_DURATION_SECONDS } from "../constants/user-auth";

type UserTokenClaims = {
  IsAdmin?: boolean;
  RoleName?: string;
  is_admin?: boolean;
  role?: string;
  role_name?: string;
  exp?: number;
};

function readClaims(token: string): UserTokenClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as UserTokenClaims;
  } catch {
    return null;
  }
}

export function isUserAccessToken(token: string) {
  const claims = readClaims(token);
  if (!claims) return false;

  const role = (claims.RoleName ?? claims.role_name ?? claims.role)?.toLowerCase();
  const isAdmin = claims.IsAdmin ?? claims.is_admin;
  const isExpired = typeof claims.exp === "number" && claims.exp * 1000 <= Date.now();

  return !isExpired && isAdmin !== true && role === "user";
}

export function getUserAccessDuration(token: string, expiresIn?: number) {
  if (typeof expiresIn === "number" && expiresIn > 0) return Math.floor(expiresIn);

  const expiresAt = readClaims(token)?.exp;
  if (typeof expiresAt !== "number") return USER_ACCESS_DURATION_SECONDS;

  return Math.max(1, Math.floor(expiresAt - Date.now() / 1000));
}
