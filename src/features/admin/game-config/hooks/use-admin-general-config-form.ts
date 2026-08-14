"use client";

import { useState } from "react";
import type { AdminGeneralGameConfig } from "../types/admin-game-config";

export function useAdminGeneralConfigForm(config: AdminGeneralGameConfig) {
  const [maxCasesPerDay, setMaxCasesPerDay] = useState(String(config.max_cases_per_day));
  const [cooldownMinutes, setCooldownMinutes] = useState(String(config.cooldown_between_cases_minutes));
  const [streakMultiplier, setStreakMultiplier] = useState(String(config.streak_bonus_multiplier));
  const [maintenanceMode, setMaintenanceMode] = useState(config.maintenance_mode);

  const valid = Number.isInteger(Number(maxCasesPerDay))
    && Number(maxCasesPerDay) > 0
    && Number.isInteger(Number(cooldownMinutes))
    && Number(cooldownMinutes) > 0
    && Number(streakMultiplier) > 0;

  const dirty = Number(maxCasesPerDay) !== config.max_cases_per_day
    || Number(cooldownMinutes) !== config.cooldown_between_cases_minutes
    || Number(streakMultiplier) !== config.streak_bonus_multiplier
    || maintenanceMode !== config.maintenance_mode;

  return {
    values: { maxCasesPerDay, cooldownMinutes, streakMultiplier, maintenanceMode },
    setters: { setMaxCasesPerDay, setCooldownMinutes, setStreakMultiplier, setMaintenanceMode },
    valid,
    dirty,
  };
}
