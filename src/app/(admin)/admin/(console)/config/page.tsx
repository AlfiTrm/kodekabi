import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_ACCESS_COOKIE } from "@/src/features/admin/auth/constants/admin-auth";
import { AdminGameConfigPage } from "@/src/features/admin/game-config/containers/admin-game-config-page";
import { getAdminGeneralGameConfig } from "@/src/features/admin/game-config/services/admin-game-config-service";
import { getAdminGameLevels } from "@/src/features/admin/game-config/services/admin-game-levels-service";
import type { AdminGeneralGameConfig } from "@/src/features/admin/game-config/types/admin-game-config";
import type { AdminGameLevel, AdminGameLevelsPagination } from "@/src/features/admin/game-config/types/admin-game-level";

export const metadata: Metadata = { title: "Game Config | KODEKABI Admin" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminGameConfigRoute({ searchParams }: { searchParams: SearchParams }) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/admin/login");

  const query = await searchParams;
  const activeTab = first(query.tab) === "xp-level" ? "xp-level" : "general";

  if (activeTab === "xp-level") {
    const search = first(query.search)?.trim() ?? "";
    const pageValue = Number(first(query.page));
    const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
    let levels: AdminGameLevel[] = [];
    let pagination: AdminGameLevelsPagination | undefined;

    try {
      const result = await getAdminGameLevels({ page, limit: 10, search }, accessToken);
      levels = result.levels;
      pagination = result.pagination;
    } catch {
      return <AdminGameConfigPage activeTab="xp-level" search={search} loadError />;
    }

    return <AdminGameConfigPage activeTab="xp-level" levels={levels} pagination={pagination} search={search} />;
  }

  let config: AdminGeneralGameConfig | null = null;
  try { config = await getAdminGeneralGameConfig(accessToken); }
  catch { /* The error state is rendered outside the fetch boundary. */ }

  if (!config) return <AdminGameConfigPage activeTab="general" loadError />;

  return <AdminGameConfigPage activeTab="general" config={config} />;
}
