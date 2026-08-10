export const caseUnlockOptions = [
  { value: "open", label: "Terbuka untuk semua", minimumLevel: 1, minimumReputation: 0 },
  { value: "level_3", label: "Minimal level 3", minimumLevel: 3, minimumReputation: 0 },
  { value: "level_5", label: "Minimal level 5", minimumLevel: 5, minimumReputation: 0 },
  { value: "reputation_250", label: "Minimal 250 reputasi", minimumLevel: 1, minimumReputation: 250 },
] as const;

export type CaseUnlockValue = (typeof caseUnlockOptions)[number]["value"];
