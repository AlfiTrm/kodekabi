import "server-only";

import { cache } from "react";

import { serverApi } from "@/src/shared/services/api/server-api";

import type { UserProfileResponse } from "../types/profile";

export const getUserProfile = cache(async (accessToken: string) => {
  const result = await serverApi<UserProfileResponse>("/users/profile", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  console.log("[level-debug] Response /users/profile:", {
    profile: {
      username: result.profile?.username,
      current_level: result.profile?.current_level,
      current_xp: result.profile?.current_xp,
    },
    level_progress: result.level_progress,
  });

  return {
    ...result,
    stats: Array.isArray(result.stats) ? result.stats : [],
    case_history: {
      items: Array.isArray(result.case_history?.items) ? result.case_history.items : [],
    },
  };
});
