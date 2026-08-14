import { AdminDataError } from "../../_shared/components/admin-data-error";
import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { GameLevelFilters } from "../components/game-level-filters";
import { GameLevelsPanel } from "../components/game-levels-panel";
import { GameConfigTabs } from "../components/game-config-tabs";
import { GeneralGameConfigForm } from "../components/general-game-config-form";
import type { AdminGeneralGameConfig } from "../types/admin-game-config";
import type { AdminGameLevel, AdminGameLevelsPagination } from "../types/admin-game-level";

type AdminGameConfigPageProps = {
  activeTab: "general" | "xp-level";
  config?: AdminGeneralGameConfig;
  levels?: AdminGameLevel[];
  pagination?: AdminGameLevelsPagination;
  search?: string;
  loadError?: boolean;
};

export function AdminGameConfigPage({ activeTab, config, levels = [], pagination, search = "", loadError = false }: AdminGameConfigPageProps) {
  const errorTitle = activeTab === "general" ? "Game config gagal dimuat." : "Level game gagal dimuat.";

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader title="Game Config" description="Konfigurasi gameplay KODEKABI" />
      <div className="mt-7"><GameConfigTabs activeTab={activeTab} /></div>
      <div className="mt-6">
        {loadError ? (
          <AdminDataError title={errorTitle} description="Periksa sesi admin atau koneksi API, lalu muat ulang halaman." />
        ) : activeTab === "general" && config ? (
          <GeneralGameConfigForm key={config.updated_at} config={config} />
        ) : activeTab === "xp-level" && pagination ? (
          <div className="space-y-4">
            <div className="max-w-sm"><GameLevelFilters search={search} /></div>
            <GameLevelsPanel levels={levels} pagination={pagination} search={search} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
