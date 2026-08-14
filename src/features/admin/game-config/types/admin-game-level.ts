export type AdminGameLevel = {
  game_level_id: string;
  level: number;
  xp_required: number;
  title: string;
  reward_coin: number;
  created_at: string;
  updated_at: string;
};

export type AdminGameLevelsPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type AdminGameLevelsResponse = {
  levels: AdminGameLevel[] | null;
  pagination: AdminGameLevelsPagination;
};

export type AdminGameLevelPayload = Pick<AdminGameLevel, "level" | "xp_required" | "title" | "reward_coin">;

export type AdminGameLevelActionState = {
  error: string | null;
};
