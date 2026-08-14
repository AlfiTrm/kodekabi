import "server-only";

import { cache } from "react";

import { serverApi } from "@/src/shared/services/api/server-api";

import type { UserProfileResponse } from "../types/profile";

export const getUserProfile = cache(async (accessToken: string) => {
  const result = await serverApi<UserProfileResponse>("/users/profile", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    ...result,
    stats: Array.isArray(result.stats) ? result.stats : [],
    case_history: {
      items: Array.isArray(result.case_history?.items) ? result.case_history.items : [],
    },
  };
});
