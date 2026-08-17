import type { TitleCosmetic } from "@/src/shared/types/game-cosmetic";

export type ProfileTitle = TitleCosmetic & {
  requirement?: string;
};

export type DetectiveSkill = {
  label: string;
  value: number;
  tone: "blue" | "purple" | "orange" | "red" | "green";
};

export type ProfileBadge = {
  id: string;
  label: string;
  symbol: string;
  tone: "red" | "green" | "orange" | "purple";
  unlocked: boolean;
};

export type CaseHistoryItem = {
  id: string;
  title: string;
  meta: string;
  result: string;
  tone: "red" | "green" | "blue";
};

export type UserProfile = {
  user_id: string;
  username: string;
  email: string;
  avatar_id: string | null;
  avatar_url: string;
  title: string;
  current_level: number;
  current_xp: number;
  coin_balance: number;
  auditor_reputation: number;
  accuracy_percent: number;
  cases_completed: number;
  streak_count: number;
  season_label: string;
};

export type UserLevelProgress = {
  current_level: number;
  next_level: number;
  current_xp: number;
  next_level_xp: number;
  remaining_xp: number;
  progress_xp: number;
  progress_percent: number;
  next_unlock_text: string;
};

export type UserProfileStat = {
  key: string;
  label: string;
  score: number;
  average: number;
};

export type UserProfileAccount = {
  email: string;
  is_email_verified: boolean;
  connected_to: string;
};

export type UserCaseHistoryItem = {
  case_id: string;
  title: string;
  completed_at: string;
  difficulty_label: string;
  xp_reward: number;
  result_status: string;
  score_label: string;
  is_retryable: boolean;
};

export type UserProfileResponse = {
  profile: UserProfile;
  level_progress: UserLevelProgress;
  stats: UserProfileStat[] | null;
  account: UserProfileAccount;
  case_history: { items: UserCaseHistoryItem[] | null } | null;
};

export type UserTitle = {
  title_id: string;
  title: string;
  unlock_level: number;
  image_border: string;
  is_owned: boolean;
  is_equipped: boolean;
  can_equip: boolean;
};

export type UserTitlesResponse = {
  titles: UserTitle[] | null;
};

export type EquippedShopItem = {
  item_id: string;
  item_category_id: string;
  category_code: string;
  category_name: string;
  avatar_id: string | null;
  name: string;
  description: string;
  price_coin: number;
  image_url: string;
  ownership_status: string;
  is_owned: boolean;
  is_equipped: boolean;
  can_purchase: boolean;
  can_equip: boolean;
};

export type EquipShopItemResponse = {
  item: EquippedShopItem;
  avatar_id: string | null;
};
