import type { UserCase } from "../../cases/types/case";

export type LobbyProfile = {
  user_id: string;
  username: string;
  avatar_id: string | null;
  avatar_url: string;
  title: string;
  coin_balance: number;
};

export type LobbyLevel = {
  current_level: number;
  current_xp: number;
  current_level_xp: number;
  next_level: number;
  next_level_xp: number;
  progress_xp: number;
  remaining_xp: number;
  progress_percent: number;
  title: string;
};

export type LobbyCityStat = {
  key: string;
  label: string;
  value: number;
  delta: number;
  status: string;
};

export type UserLobbyResponse = {
  profile: LobbyProfile;
  level: LobbyLevel;
  visual_state: string;
  city_stats: LobbyCityStat[] | null;
  featured_case: UserCase | null;
  continue_case: UserCase | null;
  other_cases: UserCase[] | null;
};
