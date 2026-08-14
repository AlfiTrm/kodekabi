import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type { AdminRedeemItemDetailResponse, AdminRedeemItemMutationResponse, AdminRedeemItemsQuery, AdminRedeemItemsResponse, AdminRedeemType, AdminRedeemTypesWireResponse, DeleteAdminRedeemItemResponse } from "../types/admin-redeem-item";

function isRedeemType(value: unknown): value is AdminRedeemType {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AdminRedeemType>;
  return typeof candidate.redeem_type_id === "string"
    && typeof candidate.code === "string"
    && typeof candidate.name === "string";
}

export function normalizeAdminRedeemTypes(payload: AdminRedeemTypesWireResponse): AdminRedeemType[] {
  if (Array.isArray(payload)) return payload.filter(isRedeemType);

  if ("types" in payload) {
    return Array.isArray(payload.types) ? payload.types.filter(isRedeemType) : [];
  }

  if (payload.data !== null) {
    return normalizeAdminRedeemTypes(payload.data);
  }

  return [];
}

export async function getAdminRedeemItems(query: AdminRedeemItemsQuery, accessToken: string) {
  const params = new URLSearchParams({ page: String(query.page), limit: String(query.limit) });
  if (query.search) params.set("search", query.search);
  if (query.typeCode) params.set("type_code", query.typeCode);
  if (query.status) params.set("status", query.status);
  if (query.claimPeriod) params.set("claim_period", query.claimPeriod);
  const result = await serverApi<AdminRedeemItemsResponse>(`/admin/redeem-items?${params}`, { method: "GET", headers: { Authorization: `Bearer ${accessToken}` } });
  return { items: Array.isArray(result.items) ? result.items : [], pagination: result.pagination ?? { page: query.page, limit: query.limit, total: 0, total_pages: 0 } };
}

export async function getAdminRedeemTypes(accessToken: string) {
  const result = await serverApi<AdminRedeemTypesWireResponse>("/admin/redeem-types", { method: "GET", headers: { Authorization: `Bearer ${accessToken}` } });
  return normalizeAdminRedeemTypes(result);
}

export function getAdminRedeemItemDetail(itemId: string, accessToken: string) {
  return serverApi<AdminRedeemItemDetailResponse>(`/admin/redeem-items/${encodeURIComponent(itemId)}`, { method: "GET", headers: { Authorization: `Bearer ${accessToken}` } });
}

export function createAdminRedeemItem(payload: FormData, accessToken: string) {
  return serverApi<AdminRedeemItemMutationResponse, FormData>("/admin/redeem-items", { method: "POST", body: payload, headers: { Authorization: `Bearer ${accessToken}` } });
}

export function updateAdminRedeemItem(itemId: string, payload: FormData, accessToken: string) {
  return serverApi<AdminRedeemItemMutationResponse, FormData>(`/admin/redeem-items/${encodeURIComponent(itemId)}`, { method: "PATCH", body: payload, headers: { Authorization: `Bearer ${accessToken}` } });
}

export function deleteAdminRedeemItem(itemId: string, accessToken: string) {
  return serverApi<DeleteAdminRedeemItemResponse>(`/admin/redeem-items/${encodeURIComponent(itemId)}`, { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } });
}
