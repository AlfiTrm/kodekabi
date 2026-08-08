export type LeaderboardScope = "weekly" | "friends" | "global";

export type LeaderboardEntry = {
  rank: number;
  username: string;
  initial: string;
  level: number;
  points: number;
  tone: "blue" | "purple" | "orange" | "red" | "green";
  currentUser?: boolean;
};

