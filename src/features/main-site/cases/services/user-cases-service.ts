import "server-only";

import { serverApi } from "@/src/shared/services/api/server-api";

import type { UserCasesQuery, UserCasesResponse } from "../types/case";

export async function getUserCases(query: UserCasesQuery, accessToken: string) {
  const searchParams = new URLSearchParams({
    tab: query.tab,
    page: String(query.page),
    limit: String(query.limit),
  });
  const path = `/users/cases?${searchParams.toString()}`;

  console.info("[cases] fetching user cases", {
    path,
    tab: query.tab,
    page: query.page,
    limit: query.limit,
    hasAccessToken: Boolean(accessToken),
  });

  try {
    const result = await serverApi<UserCasesResponse>(path, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const cases = Array.isArray(result.cases) ? result.cases : [];

    console.info("[cases] user cases fetched", {
      tab: query.tab,
      page: query.page,
      count: cases.length,
      total: result.pagination?.total ?? 0,
      totalPages: result.pagination?.total_pages ?? 0,
    });

    cases.forEach((item) => {
      console.info("[cases] card status", {
        caseId: item.case_id,
        title: item.title,
        accessStatus: item.access_status,
        progressStatus: item.progress_status,
        lockedReason: item.locked_reason,
      });
    });

    return {
      cases,
      pagination: result.pagination ?? {
        page: query.page,
        limit: query.limit,
        total: 0,
        total_pages: 0,
      },
    };
  } catch (error) {
    console.error("[cases] failed to fetch user cases", {
      path,
      tab: query.tab,
      page: query.page,
      error,
    });
    throw error;
  }
}
