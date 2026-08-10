import "server-only";

type AdminTokenClaims = {
  IsAdmin?: boolean;
  RoleName?: string;
  is_admin?: boolean;
  role?: string;
  role_name?: string;
  exp?: number;
};

export function isAdminAccessToken(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;

    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminTokenClaims;
    const role = claims.RoleName ?? claims.role_name ?? claims.role;
    const isExpired = typeof claims.exp === "number" && claims.exp * 1000 <= Date.now();

    return !isExpired && (claims.IsAdmin === true || claims.is_admin === true || role?.toLowerCase() === "admin");
  } catch {
    return false;
  }
}
