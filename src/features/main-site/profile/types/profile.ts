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
