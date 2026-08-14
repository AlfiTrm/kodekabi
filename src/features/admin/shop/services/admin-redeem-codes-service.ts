import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type {
  AdminRedeemCodesQuery,
  AdminRedeemCodesResponse,
  CreateAdminRedeemCodeResponse,
  DeleteAdminRedeemCodeResponse,
  UploadAdminRedeemCodesResponse,
} from "../types/admin-redeem-code";

function authorization(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

export async function getAdminRedeemCodes(query: AdminRedeemCodesQuery, accessToken: string) {
  const params = new URLSearchParams({ page: String(query.page), limit: String(query.limit) });
  if (query.search) params.set("search", query.search);
  if (query.redeemItemId) params.set("redeem_item_id", query.redeemItemId);
  if (query.status) params.set("status", query.status);

  const result = await serverApi<AdminRedeemCodesResponse>(`/admin/redeem-codes?${params}`, {
    method: "GET",
    headers: authorization(accessToken),
  });

  return {
    redeemCodes: Array.isArray(result.redeem_codes) ? result.redeem_codes : [],
    pagination: result.pagination ?? { page: query.page, limit: query.limit, total: 0, total_pages: 0 },
  };
}

export function createAdminRedeemCode(payload: { redeem_item_id: string; code: string; expires_at: string }, accessToken: string) {
  return serverApi<CreateAdminRedeemCodeResponse, typeof payload>("/admin/redeem-codes/manual", {
    method: "POST",
    body: payload,
    headers: authorization(accessToken),
  });
}

export function uploadAdminRedeemCodes(file: File, accessToken: string) {
  const payload = new FormData();
  payload.set("file", file);
  return serverApi<UploadAdminRedeemCodesResponse, FormData>("/admin/redeem-codes/csv", {
    method: "POST",
    body: payload,
    headers: authorization(accessToken),
  });
}

export function deleteAdminRedeemCode(redeemCodeId: string, accessToken: string) {
  return serverApi<DeleteAdminRedeemCodeResponse>(`/admin/redeem-codes/${encodeURIComponent(redeemCodeId)}`, {
    method: "DELETE",
    headers: authorization(accessToken),
  });
}
