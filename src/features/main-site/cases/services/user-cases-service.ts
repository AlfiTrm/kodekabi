import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";

import type { UserCasesQuery, UserCasesResponse } from "../types/case";

export async function getUserCases(query: UserCasesQuery, accessToken: string) {
  const searchParams = new URLSearchParams({
    tab: query.tab,
    page: String(query.page),
    limit: String(query.limit),
  });

  const result = await serverApi<UserCasesResponse>(`/users/cases?${searchParams.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    cases: Array.isArray(result.cases) ? result.cases : [],
    pagination: result.pagination ?? {
      page: query.page,
      limit: query.limit,
      total: 0,
      total_pages: 0,
    },
  };
}
