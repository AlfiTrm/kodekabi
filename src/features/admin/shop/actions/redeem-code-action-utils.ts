import { ApiError } from "@/src/shared/services/api/api-error";

export function redeemCodeActionError(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message || fallback : fallback;
}
