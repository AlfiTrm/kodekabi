export type AdminGeneralGameConfig = {
  game_config_id: string;
  config_key: string;
  max_cases_per_day: number;
  cooldown_between_cases_minutes: number;
  streak_bonus_multiplier: number;
  maintenance_mode: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminGeneralGameConfigResponse = {
  config: AdminGeneralGameConfig;
};

export type AdminGeneralGameConfigPayload = Pick<
  AdminGeneralGameConfig,
  "max_cases_per_day" | "cooldown_between_cases_minutes" | "streak_bonus_multiplier" | "maintenance_mode"
>;

export type AdminGeneralGameConfigActionState = {
  error: string | null;
  success: string | null;
  config: AdminGeneralGameConfig | null;
};
