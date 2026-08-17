import "server-only";

import { cache } from "react";

import { serverApi } from "@/src/shared/services/api/server-api";

import type { UserTitlesResponse } from "../types/profile";

export const getUserTitles = cache(async (accessToken: string) => {
  const result = await serverApi<UserTitlesResponse>("/users/titles", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return Array.isArray(result.titles) ? result.titles : [];
});
