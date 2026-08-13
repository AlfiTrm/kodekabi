import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";
import type {
  AdminGeneralGameConfigPayload,
  AdminGeneralGameConfigResponse,
} from "../types/admin-game-config";

const generalConfigPath = "/admin/game-config/general";

export async function getAdminGeneralGameConfig(accessToken: string) {
  const result = await serverApi<AdminGeneralGameConfigResponse>(generalConfigPath, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return result.config;
}

export async function saveAdminGeneralGameConfig(payload: AdminGeneralGameConfigPayload, accessToken: string) {
  const result = await serverApi<AdminGeneralGameConfigResponse, AdminGeneralGameConfigPayload>(generalConfigPath, {
    method: "PUT",
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return result.config;
}
