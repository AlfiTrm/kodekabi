import type { LeaderboardEntry } from "../types/leaderboard";

export const podiumEntries: LeaderboardEntry[] = [
  { rank: 1, username: "algo_hunter", initial: "A", level: 9, points: 2140, tone: "purple" },
  { rank: 2, username: "rizky_cek", initial: "R", level: 8, points: 1850, tone: "blue" },
  { rank: 3, username: "dita.verif", initial: "D", level: 8, points: 1720, tone: "orange" },
];

export const rankedEntries: LeaderboardEntry[] = [
  { rank: 4, username: "bima_riset", initial: "B", level: 8, points: 1580, tone: "blue" },
  { rank: 5, username: "salsa.membaca", initial: "S", level: 7, points: 1510, tone: "red" },
  { rank: 6, username: "fajar_logic", initial: "F", level: 7, points: 1470, tone: "green" },
  { rank: 7, username: "galih.skeptis", initial: "G", level: 6, points: 1360, tone: "orange" },
];

export const currentUserEntry: LeaderboardEntry = {
  rank: 102,
  username: "nadia_audit",
  initial: "N",
  level: 7,
  points: 1420,
  tone: "purple",
  currentUser: true,
};

