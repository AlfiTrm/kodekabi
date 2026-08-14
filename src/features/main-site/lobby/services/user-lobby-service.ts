import "server-only";

import { cache } from "react";

import { serverApi } from "@/src/shared/services/api/server-api";

import type { UserLobbyResponse } from "../types/lobby";

export const getUserLobby = cache(async (accessToken: string) => {
  const result = await serverApi<UserLobbyResponse>("/users/lobby", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    ...result,
    city_stats: Array.isArray(result.city_stats) ? result.city_stats : [],
    other_cases: Array.isArray(result.other_cases) ? result.other_cases : [],
  };
});
