export type LeaderboardScope = "weekly" | "friends" | "global";

export type LeaderboardEntry = {
  rank: number;
  username: string;
  initial: string;
  level: number;
  points: number;
  tone: "blue" | "purple" | "orange" | "red" | "green";
  currentUser?: boolean;
  avatarUrl?: string;
};

export type LeaderboardApiEntry = {
  rank: number;
  username: string;
  avatar_id: string | null;
  avatar_url: string;
  level: number;
  score: number;
  is_current_user: boolean;
};

export type LeaderboardPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type UserLeaderboardResponse = {
  entries: LeaderboardApiEntry[] | null;
  me: LeaderboardApiEntry | null;
  pagination: LeaderboardPagination | null;
};
