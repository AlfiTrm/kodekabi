export type CaseStatus = "ongoing" | "completed" | "available" | "locked";
export type CaseTone = "red" | "purple" | "green" | "blue" | "orange" | "muted";

export type CaseItem = {
  id: string;
  category: string;
  headline: string;
  title: string;
  description: string;
  rating: string;
  difficulty: string;
  duration: number;
  xp: number;
  tone: CaseTone;
  status: CaseStatus;
  badge?: string;
  progress?: number;
};

export type CaseFilter = "all" | "ongoing" | "completed";

